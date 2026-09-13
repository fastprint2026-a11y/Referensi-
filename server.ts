import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { 
  searchOpenAlex, 
  searchGoogleBooks, 
  searchArXiv, 
  searchCrossref,
  searchDOAB,
  searchInternetArchive,
  searchOpenLibrary,
  searchProjectGutenberg,
  searchDOAJ,
  searchIslamicReferences,
  searchIndonesianUniversities
} from './server/academicSearch.js';
import { 
  analyzeSearchIntent, 
  deconstructThesisTitle, 
  extractEmpiricalMatrixFromAbstract,
  synthesizeLiteratureReview,
  generateMethodologyGuide,
  paraphraseAcademicText
} from './server/geminiService.js';
import { AcademicSource, EmpiricalStudyItem, SearchFilters, SourceType, SintaRank } from './src/types.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Categorical Priority:
// Tier 1 = Buku & Ebook (DOAB, OAPEN, Google Books, Internet Archive, Open Library, Gutenberg)
// Tier 2 = Jurnal Ilmiah & Artikel Empiris (DOAJ, OpenAlex, Crossref, arXiv)
// Tier 3 = Skripsi, Tesis, Disertasi & Repository Kampus (UI, UGM, UNAIR, UNDIP, ITS, UB, UNY, UNS, UIN)
// Tier 4 = Prosiding Konferensi
// Tier 5 = Dokumen / Dataset lainnya
function getCategoryTier(source: AcademicSource): number {
  if (source.sourceType === 'ebook' || source.databaseSource === 'DOAB' || source.databaseSource === 'OAPEN' || source.databaseSource === 'Google Books' || source.databaseSource === 'Open Library' || source.databaseSource === 'Project Gutenberg') {
    return 1;
  }
  if (source.sourceType === 'jurnal' || source.sourceType === 'artikel' || source.sourceType === 'esai' || source.databaseSource === 'DOAJ') {
    return 2;
  }
  if (source.sourceType === 'skripsi' || source.sourceType === 'tesis' || source.sourceType === 'disertasi' || source.databaseSource === 'Repository Kampus') {
    return 3;
  }
  if (source.sourceType === 'prosiding') return 4;
  return 5;
}

// Helper: Filter and Sort Academic Sources
function filterAndSortSources(sources: AcademicSource[], filters?: SearchFilters): AcademicSource[] {
  let result = [...sources];

  // 1. Database Category Filter (Books vs Journals vs Islamic vs Indonesia)
  if (filters?.databaseCategory && filters.databaseCategory !== 'all') {
    if (filters.databaseCategory === 'books_only') {
      result = result.filter(s => s.sourceType === 'ebook' || ['DOAB', 'OAPEN', 'Google Books', 'Internet Archive', 'Open Library', 'Project Gutenberg'].includes(s.databaseSource));
    } else if (filters.databaseCategory === 'journals_only') {
      result = result.filter(s => s.sourceType === 'jurnal' || s.sourceType === 'artikel' || ['DOAJ', 'OpenAlex', 'Crossref', 'arXiv'].includes(s.databaseSource));
    } else if (filters.databaseCategory === 'islamic_only') {
      result = result.filter(s => s.isIslamicReference || s.databaseSource === 'Referensi Keislaman');
    } else if (filters.databaseCategory === 'indonesia_only') {
      result = result.filter(s => s.language === 'id' || s.databaseSource === 'Repository Kampus' || Boolean(s.sintaRank && s.sintaRank.startsWith('SINTA')));
    }
  }

  // 2. Source Type Filter
  if (filters?.sourceTypes && filters.sourceTypes.length > 0) {
    result = result.filter(s => filters.sourceTypes.includes(s.sourceType));
  }

  // 3. Year Range Filter
  if (filters?.yearRange && filters.yearRange !== 'all') {
    result = result.filter(s => {
      const y = parseInt(String(s.year), 10);
      if (isNaN(y)) return true;
      if (filters.yearRange === '2024-2026') return y >= 2024 && y <= 2026;
      if (filters.yearRange === '2020-2023') return y >= 2020 && y <= 2023;
      if (filters.yearRange === '2015-2019') return y >= 2015 && y <= 2019;
      if (filters.yearRange === 'pre-2015') return y < 2015;
      return true;
    });
  }

  // 4. Access Type Filter
  if (filters?.accessType && filters.accessType !== 'all') {
    if (filters.accessType === 'pdf_only') {
      result = result.filter(s => s.accessStatus === 'pdf_available' && Boolean(s.pdfUrl));
    } else if (filters.accessType === 'open_access') {
      result = result.filter(s => s.accessStatus === 'open_access' || s.accessStatus === 'pdf_available');
    }
  }

  // 5. Language Filter
  if (filters?.language && filters.language !== 'all') {
    result = result.filter(s => s.language === filters.language);
  }

  // 6. SINTA & Reputasi Filter
  if (filters?.sintaFilter && filters.sintaFilter !== 'all') {
    if (filters.sintaFilter === 'sinta1_2') {
      result = result.filter(s => s.sintaRank === 'SINTA 1' || s.sintaRank === 'SINTA 2');
    } else if (filters.sintaFilter === 'sinta3_6') {
      result = result.filter(s => s.sintaRank === 'SINTA 3' || s.sintaRank === 'SINTA 4' || s.sintaRank === 'SINTA 5' || s.sintaRank === 'SINTA 6' || s.sintaRank === 'Nasional');
    } else if (filters.sintaFilter === 'international') {
      result = result.filter(s => s.sintaRank === 'Scopus' || s.sintaRank === 'DOAJ' || s.databaseSource === 'arXiv' || s.language === 'en');
    }
  }

  // 7. Strict Categorical Grouped Sorting:
  // JANGAN DICAMPUR:
  // Urutan Teratas (Tier 1): Buku & Ebook (DOAB, OAPEN, Google Books, Internet Archive, Open Library, Gutenberg)
  // Urutan Kedua (Tier 2): Jurnal Ilmiah (DOAJ, OpenAlex, Crossref, arXiv)
  // Urutan Ketiga (Tier 3): Skripsi & Repository Kampus
  // Urutan Keempat (Tier 4): Prosiding
  result.sort((a, b) => {
    // 1. Primary order: Category Tier
    const tierA = getCategoryTier(a);
    const tierB = getCategoryTier(b);
    if (tierA !== tierB) {
      return tierA - tierB;
    }

    // 2. Secondary order within same tier: Prioritize Verified PDF / Full Access
    const aHasPdf = (a.accessStatus === 'pdf_available' && Boolean(a.pdfUrl)) || a.accessStatus === 'open_access';
    const bHasPdf = (b.accessStatus === 'pdf_available' && Boolean(b.pdfUrl)) || b.accessStatus === 'open_access';
    if (aHasPdf !== bHasPdf) {
      return aHasPdf ? -1 : 1;
    }

    // 3. Apply user custom sortBy if specified
    if (filters?.sortBy === 'year_desc') {
      return Number(b.year || 0) - Number(a.year || 0);
    }
    if (filters?.sortBy === 'year_asc') {
      return Number(a.year || 0) - Number(b.year || 0);
    }
    if (filters?.sortBy === 'citations') {
      return (b.citationCount || 0) - (a.citationCount || 0);
    }

    // 4. Default within same tier: Relevance Score
    const aWeight = (a.relevanceScore || 70) + (a.pdfUrl ? 15 : 0) + (a.doi ? 5 : 0);
    const bWeight = (b.relevanceScore || 70) + (b.pdfUrl ? 15 : 0) + (b.doi ? 5 : 0);
    return bWeight - aWeight;
  });

  return result;
}

// Helper: Deduplicate sources by DOI or Title
function deduplicateSources(sources: AcademicSource[]): AcademicSource[] {
  const seenTitles = new Set<string>();
  const seenDois = new Set<string>();
  const out: AcademicSource[] = [];

  for (const s of sources) {
    const cleanTitle = s.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 45);
    const cleanDoi = s.doi ? s.doi.toLowerCase().trim() : null;

    if (cleanDoi && seenDois.has(cleanDoi)) continue;
    if (seenTitles.has(cleanTitle)) continue;

    if (cleanDoi) seenDois.add(cleanDoi);
    seenTitles.add(cleanTitle);
    out.push(s);
  }

  return out;
}

// 2. Main Search Endpoint: /api/search
app.post('/api/search', async (req, res) => {
  try {
    const { query, mode = 'general', filters } = req.body;
    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'Kata kunci pencarian diperlukan.' });
    }

    const trimmedQuery = query.trim();

    // Step 1: Analyze user intent and extract Indonesian & English academic keywords
    const intentAnalysis = await analyzeSearchIntent(trimmedQuery);

    // Queries to execute
    const queriesToRun = [trimmedQuery];
    if (intentAnalysis.englishTerms && intentAnalysis.englishTerms.length > 0) {
      queriesToRun.push(intentAnalysis.englishTerms[0]);
    }
    if (intentAnalysis.suggestedTerms && intentAnalysis.suggestedTerms.length > 0) {
      queriesToRun.push(intentAnalysis.suggestedTerms[0]);
    }

    // Step 2: Detect Book-Priority & Islamic Intent
    const lowerQuery = trimmedQuery.toLowerCase();
    const isBookPriority = 
      filters?.databaseCategory === 'books_only' ||
      lowerQuery.includes('buku') || 
      lowerQuery.includes('book') || 
      lowerQuery.includes('ebook') ||
      lowerQuery.includes('teori') ||
      lowerQuery.includes('pengantar') ||
      lowerQuery.includes('metode') ||
      lowerQuery.includes('metodologi') ||
      lowerQuery.includes('textbook') ||
      lowerQuery.includes('panduan');

    const isIslamicQuery = 
      filters?.databaseCategory === 'islamic_only' ||
      lowerQuery.includes('islam') ||
      lowerQuery.includes('syariah') ||
      lowerQuery.includes('quran') ||
      lowerQuery.includes('hadits') ||
      lowerQuery.includes('hadis') ||
      lowerQuery.includes('fiqh') ||
      lowerQuery.includes('fikih') ||
      lowerQuery.includes('sunnah') ||
      lowerQuery.includes('tafsir') ||
      lowerQuery.includes('pesantren') ||
      lowerQuery.includes('wakaf') ||
      lowerQuery.includes('zakat') ||
      lowerQuery.includes('muamalah') ||
      lowerQuery.includes('shamela');

    // Step 3: Fetch concurrently across hierarchical academic sources
    // TAHAP 1: Ebook & Buku Digital (DOAB, OAPEN, Google Books, Internet Archive, Open Library, Gutenberg)
    const bookPromises: Promise<AcademicSource[]>[] = [
      searchDOAB(trimmedQuery, isBookPriority ? 10 : 6),
      searchGoogleBooks(trimmedQuery, isBookPriority ? 10 : 8),
      searchInternetArchive(trimmedQuery, isBookPriority ? 8 : 6),
      searchOpenLibrary(trimmedQuery, 6),
      searchProjectGutenberg(trimmedQuery, 4),
    ];

    if (intentAnalysis.englishTerms[0] && isBookPriority) {
      bookPromises.push(searchDOAB(intentAnalysis.englishTerms[0], 6));
    }
    if (!lowerQuery.includes('buku') && !lowerQuery.includes('book')) {
      bookPromises.push(searchGoogleBooks(`buku ${trimmedQuery}`, 6));
    }

    // TAHAP 2: Jurnal Ilmiah, Artikel, & Repositori Kampus (DOAJ, OpenAlex, Repository Kampus, Crossref, arXiv)
    const journalPromises: Promise<AcademicSource[]>[] = [
      searchDOAJ(trimmedQuery, 8),
      searchOpenAlex(trimmedQuery, 12),
      searchIndonesianUniversities(trimmedQuery, 6),
      searchCrossref(trimmedQuery, 6),
      searchArXiv(trimmedQuery, 5),
    ];

    if (intentAnalysis.englishTerms[0] && intentAnalysis.englishTerms[0] !== trimmedQuery) {
      journalPromises.push(searchOpenAlex(intentAnalysis.englishTerms[0], 8));
      journalPromises.push(searchDOAJ(intentAnalysis.englishTerms[0], 6));
    }

    // TAHAP KHUSUS: Referensi Keislaman (Shamela, Archive Islamic, Waqfeya)
    const islamicPromises: Promise<AcademicSource[]>[] = [];
    if (isIslamicQuery) {
      islamicPromises.push(searchIslamicReferences(trimmedQuery, 8));
    }

    // Execute all queries concurrently with allSettled to ensure resilient fallback
    const allResults = await Promise.allSettled([
      ...bookPromises,
      ...journalPromises,
      ...islamicPromises
    ]);

    const combined = allResults
      .filter((r): r is PromiseFulfilledResult<AcademicSource[]> => r.status === 'fulfilled')
      .flatMap((r) => r.value);

    // Deduplicate
    const uniqueSources = deduplicateSources(combined);

    // Filter and Sort
    const filteredSources = filterAndSortSources(uniqueSources, filters);

    // Calculate categorical breakdown counts
    const booksFound = filteredSources.filter(s => s.sourceType === 'ebook' || ['DOAB', 'OAPEN', 'Google Books', 'Internet Archive', 'Open Library', 'Project Gutenberg'].includes(s.databaseSource)).length;
    const journalsFound = filteredSources.filter(s => s.sourceType === 'jurnal' || s.sourceType === 'artikel' || ['DOAJ', 'OpenAlex', 'Crossref', 'arXiv'].includes(s.databaseSource)).length;
    const reposFound = filteredSources.filter(s => s.databaseSource === 'Repository Kampus' || s.sourceType === 'skripsi' || s.sourceType === 'tesis').length;
    const islamicFound = filteredSources.filter(s => s.isIslamicReference || s.databaseSource === 'Referensi Keislaman').length;

    res.json({
      success: true,
      query: trimmedQuery,
      mode,
      intentAnalysis,
      isBookPriority,
      isIslamicQuery,
      stats: {
        books: booksFound,
        journals: journalsFound,
        repositories: reposFound,
        islamic: islamicFound,
      },
      totalFound: filteredSources.length,
      sources: filteredSources,
    });
  } catch (err: any) {
    console.error('Error in /api/search:', err);
    res.status(500).json({ error: 'Gagal melakukan pencarian referensi.', details: err?.message });
  }
});

// 3. Thesis Title Deconstruction Endpoint: /api/analyze-title
app.post('/api/analyze-title', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Judul skripsi diperlukan.' });
    }

    const deconstruction = await deconstructThesisTitle(title.trim());

    // Search real references for independent variable, dependent variable, and theories
    const searchTasks: Promise<AcademicSource[]>[] = [];

    // Variable X search
    if (deconstruction.independentVariables?.[0]) {
      searchTasks.push(searchOpenAlex(deconstruction.independentVariables[0], 6));
    }
    // Variable Y search
    if (deconstruction.dependentVariables?.[0]) {
      searchTasks.push(searchOpenAlex(deconstruction.dependentVariables[0], 6));
    }
    // Grand Theory books search
    if (deconstruction.recommendedGrandTheories?.[0]) {
      searchTasks.push(searchGoogleBooks(deconstruction.recommendedGrandTheories[0], 6));
      searchTasks.push(searchOpenAlex(deconstruction.recommendedGrandTheories[0], 6));
    }
    // General title academic search
    searchTasks.push(searchOpenAlex(title.trim(), 8));

    const results = await Promise.all(searchTasks);
    const deduplicated = deduplicateSources(results.flat());

    res.json({
      success: true,
      deconstruction,
      totalFound: deduplicated.length,
      sources: deduplicated,
    });
  } catch (err: any) {
    console.error('Error in /api/analyze-title:', err);
    res.status(500).json({ error: 'Gagal membedah judul skripsi.', details: err?.message });
  }
});

// 4. Chapter Specific Finder: /api/thesis-chapter
app.post('/api/thesis-chapter', async (req, res) => {
  try {
    const { topic, chapter = 'BAB II', methodology } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topik skripsi diperlukan.' });

    let queries: string[] = [];

    if (chapter === 'BAB II') {
      // Landasan Teori, Variabel, Tinjauan Pustaka
      queries = [
        `teori ${topic}`,
        `landasan teori ${topic}`,
        `tinjauan pustaka ${topic}`,
        `kajian teori ${topic}`,
      ];
    } else if (chapter === 'BAB III') {
      // Metodologi Penelitian
      const methodTerm = methodology ? `metode penelitian ${methodology}` : 'metode penelitian';
      queries = [
        `${methodTerm} ${topic}`,
        `desain penelitian ${topic}`,
        `analisis data ${topic}`,
        'metodologi penelitian kuantitatif kualitatif',
      ];
    } else {
      queries = [topic];
    }

    const fetches: Promise<AcademicSource[]>[] = [];
    for (const q of queries.slice(0, 3)) {
      fetches.push(searchOpenAlex(q, 6));
      fetches.push(searchGoogleBooks(q, 4));
    }

    const fetched = await Promise.all(fetches);
    const combined = deduplicateSources(fetched.flat());

    res.json({
      success: true,
      topic,
      chapter,
      sources: combined,
    });
  } catch (err: any) {
    console.error('Error in /api/thesis-chapter:', err);
    res.status(500).json({ error: 'Gagal mencari referensi bab skripsi.' });
  }
});

// 5. Empirical Matrix Review: /api/empirical-matrix
app.post('/api/empirical-matrix', async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topik penelitian diperlukan.' });

    // Fetch real journal articles with abstracts from OpenAlex & Crossref
    const openAlexArticles = await searchOpenAlex(`penelitian ${topic} jurnal`, 12);
    const crossrefArticles = await searchCrossref(topic, 8);

    const candidates = deduplicateSources([...openAlexArticles, ...crossrefArticles])
      .filter(a => a.abstract && a.abstract.length > 60)
      .slice(0, 6);

    const matrixItems: EmpiricalStudyItem[] = [];

    for (const item of candidates) {
      const extracted = await extractEmpiricalMatrixFromAbstract(item.title, item.abstract);
      matrixItems.push({
        id: item.id,
        title: item.title,
        authors: item.authors.map(a => a.name).join(', '),
        year: item.year,
        methodology: extracted.methodology,
        variables: extracted.variables,
        sampleOrObject: extracted.sampleOrObject,
        mainFindings: extracted.mainFindings,
        doi: item.doi,
        articleUrl: item.sourceUrl,
        pdfUrl: item.pdfUrl,
        journalOrPublisher: item.journal || item.publisher,
      });
    }

    res.json({
      success: true,
      topic,
      total: matrixItems.length,
      matrix: matrixItems,
    });
  } catch (err: any) {
    console.error('Error in /api/empirical-matrix:', err);
    res.status(500).json({ error: 'Gagal menyusun matrik penelitian terdahulu.' });
  }
});

// 6. Literature Review Synthesizer (Bab II): /api/literature-synthesis
app.post('/api/literature-synthesis', async (req, res) => {
  try {
    const { sources, topic } = req.body;
    if (!sources || !Array.isArray(sources) || sources.length === 0) {
      return res.status(400).json({ error: 'Pilih minimal 1 sumber referensi untuk disintesis.' });
    }
    const synthesis = await synthesizeLiteratureReview(sources, topic);
    res.json({ success: true, synthesis });
  } catch (err: any) {
    console.error('Error in /api/literature-synthesis:', err);
    res.status(500).json({ error: 'Gagal membuat sintesis tinjauan pustaka.' });
  }
});

// 7. Methodology & Statistical Tests Guide (Bab III): /api/methodology-guide
app.post('/api/methodology-guide', async (req, res) => {
  try {
    const { title, variables } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Judul penelitian diperlukan.' });
    }
    const guide = await generateMethodologyGuide(title, variables);
    res.json({ success: true, guide });
  } catch (err: any) {
    console.error('Error in /api/methodology-guide:', err);
    res.status(500).json({ error: 'Gagal menghasilkan panduan metodologi.' });
  }
});

// 8. Academic Paraphrasing Tool: /api/paraphrase
app.post('/api/paraphrase', async (req, res) => {
  try {
    const { text, authorSource } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Teks yang ingin diparafrasekan tidak boleh kosong.' });
    }
    const paraphrase = await paraphraseAcademicText(text, authorSource);
    res.json({ success: true, paraphrase });
  } catch (err: any) {
    console.error('Error in /api/paraphrase:', err);
    res.status(500).json({ error: 'Gagal melakukan parafrase akademik.' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZAIN.NET Server running on http://localhost:${PORT}`);
  });
}

startServer();
