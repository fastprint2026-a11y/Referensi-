import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Book,
  FileText, 
  GraduationCap, 
  FileCode, 
  Layers, 
  SlidersHorizontal, 
  Loader2, 
  Download, 
  ShieldCheck, 
  Globe, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  BookmarkCheck,
  Bookmark,
  AlertCircle
} from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchCard } from './components/SearchCard';
import { FilterSidebar } from './components/FilterSidebar';
import { DetailModal } from './components/DetailModal';
import { CitationModal } from './components/CitationModal';
import { ThesisReferenceMode } from './components/ThesisReferenceMode';
import { ThesisTitleAnalyzer } from './components/ThesisTitleAnalyzer';
import { ChapterFinderModal } from './components/ChapterFinderModal';
import { EmpiricalMatrixView } from './components/EmpiricalMatrixView';
import { LiteratureSynthesisView } from './components/LiteratureSynthesisView';
import { MethodologyGuideView } from './components/MethodologyGuideView';
import { AcademicParaphraseView } from './components/AcademicParaphraseView';
import { SavedReferencesView } from './components/SavedReferencesView';
import { SearchHistoryView } from './components/SearchHistoryView';
import { ResponsibleSearchNotice } from './components/ResponsibleSearchNotice';

import { 
  AcademicSource, 
  SearchFilters, 
  SearchIntentAnalysis, 
  SearchHistoryItem, 
  ChapterCategory,
  SourceType 
} from './types';
import { executeSearch } from './services/api';

const DEFAULT_FILTERS: SearchFilters = {
  sourceTypes: [],
  yearRange: 'all',
  accessType: 'all',
  language: 'all',
  sortBy: 'relevance',
};

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<string>('beranda');

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<string>('general');
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Search results state
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<AcademicSource[]>([]);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'all' | 'ebook' | 'jurnal' | 'skripsi' | 'prosiding' | 'islamic'>('all');
  const [intentAnalysis, setIntentAnalysis] = useState<SearchIntentAnalysis | null>(null);
  const [totalFound, setTotalFound] = useState(0);
  const [searchStats, setSearchStats] = useState<{ books: number; journals: number; repositories: number; islamic: number; isBookPriority?: boolean } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Categorical organization: NEVER mixed together
  // Urutan Teratas: Buku & Ebook (DOAB, OAPEN, Google Books, Internet Archive, Open Library, Gutenberg)
  // Urutan Kedua: Jurnal Ilmiah (DOAJ, OpenAlex, Crossref, arXiv)
  // Urutan Ketiga: Skripsi & Repositori Kampus (UI, UGM, UNDIP, UNAIR, UB, dll)
  // Urutan Khusus: Referensi Keislaman (Kitab & Kajian Islam)
  // Urutan Terakhir: Prosiding Konferensi
  const categoryGroups = useMemo(() => {
    const islamicRefs = results.filter(s => s.isIslamicReference || s.databaseSource === 'Referensi Keislaman');
    const ebooks = results.filter(s => !s.isIslamicReference && s.databaseSource !== 'Referensi Keislaman' && s.sourceType === 'ebook');
    const journals = results.filter(s => !s.isIslamicReference && s.databaseSource !== 'Referensi Keislaman' && (s.sourceType === 'jurnal' || s.sourceType === 'artikel' || s.sourceType === 'esai'));
    const theses = results.filter(s => !s.isIslamicReference && s.databaseSource !== 'Referensi Keislaman' && (s.sourceType === 'skripsi' || s.sourceType === 'tesis' || s.sourceType === 'disertasi' || s.databaseSource === 'Repository Kampus'));
    const proceedings = results.filter(s => !s.isIslamicReference && s.sourceType === 'prosiding');
    const others = results.filter(s => !s.isIslamicReference && s.databaseSource !== 'Referensi Keislaman' && (s.sourceType === 'laporan' || s.sourceType === 'dataset'));

    return [
      {
        id: 'ebook' as const,
        title: 'Buku & Ebook Teks Akademik (DOAB, OAPEN, Google Books, Open Library)',
        subtitle: 'Buku Teks Peer-Reviewed, Open Access, Grand Theory, Metodologi Penelitian & Pegangan Dosen',
        icon: <Book className="w-5 h-5 text-amber-400" />,
        badge: '⭐ PRIORITAS TERATAS (TAHAP 1)',
        badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        headerBorder: 'border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900 to-[#0b1324]',
        items: ebooks,
      },
      {
        id: 'jurnal' as const,
        title: 'Artikel Jurnal Ilmiah Bereputasi (DOAJ, OpenAlex, Crossref, arXiv)',
        subtitle: 'Penelitian Empiris, Studi Terdahulu & Kajian Ilmiah Terindeks (Tahap 2)',
        icon: <FileText className="w-5 h-5 text-blue-400" />,
        badge: 'TAHAP 2: JURNAL ILMIAH',
        badgeClass: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
        headerBorder: 'border-blue-500/40 bg-gradient-to-r from-blue-950/40 via-slate-900 to-[#0b1324]',
        items: journals,
      },
      {
        id: 'skripsi' as const,
        title: 'Repositori Kampus & Skripsi/Tesis (UI, UGM, UNDIP, UNAIR, UB, dll)',
        subtitle: 'Repository Karya Akhir Mahasiswa Perguruan Tinggi Nasional & Internasional',
        icon: <GraduationCap className="w-5 h-5 text-purple-400" />,
        badge: 'REPOSITORI KAMPUS',
        badgeClass: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
        headerBorder: 'border-purple-500/40 bg-gradient-to-r from-purple-950/40 via-slate-900 to-[#0b1324]',
        items: theses,
      },
      {
        id: 'islamic' as const,
        title: 'Pustaka & Referensi Keislaman (Kitab, Hadits, Fiqh)',
        subtitle: 'Koleksi Pustaka Islam Digital, Kitab Klasik & Riset Keislaman Terverifikasi',
        icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
        badge: 'REFERENSI KEISLAMAN',
        badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        headerBorder: 'border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#0b1324]',
        items: islamicRefs,
      },
      {
        id: 'prosiding' as const,
        title: 'Prosiding Konferensi & Publikasi Riset',
        subtitle: 'Prosiding Seminar Ilmiah Nasional/Internasional & Dokumen Riset',
        icon: <FileCode className="w-5 h-5 text-cyan-400" />,
        badge: 'KATEGORI #4',
        badgeClass: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
        headerBorder: 'border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-[#0b1324]',
        items: [...proceedings, ...others],
      },
    ].filter(g => g.items.length > 0);
  }, [results]);

  const displayedGroups = useMemo(() => {
    if (selectedCategoryTab === 'all') return categoryGroups;
    return categoryGroups.filter(g => g.id === selectedCategoryTab);
  }, [categoryGroups, selectedCategoryTab]);

  // Modals state
  const [selectedSourceForDetail, setSelectedSourceForDetail] = useState<AcademicSource | null>(null);
  const [selectedSourceForCitation, setSelectedSourceForCitation] = useState<AcademicSource | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Persistence (LocalStorage)
  const [savedSources, setSavedSources] = useState<AcademicSource[]>(() => {
    try {
      const stored = localStorage.getItem('zain_saved_references');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('zain_search_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save to LocalStorage effects
  useEffect(() => {
    localStorage.setItem('zain_saved_references', JSON.stringify(savedSources));
  }, [savedSources]);

  useEffect(() => {
    localStorage.setItem('zain_search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Quick Suggestion Chips for Students
  const studentSuggestions = [
    'Buku Metode Penelitian Sugiyono',
    'Jurnal Pengaruh Media Sosial Minat Beli',
    'Landasan Teori Brand Image Kotler',
    'Penelitian Stunting Balita',
    'Machine Learning Klasifikasi Algoritma',
    'Kinerja Keuangan CAMEL Bank',
  ];

  // Perform search
  const handlePerformSearch = async (queryText?: string, modeToUse?: string, customFilters?: SearchFilters) => {
    const q = (queryText !== undefined ? queryText : searchQuery).trim();
    if (!q) return;

    const currentMode = modeToUse || searchMode;
    const currentFilters = customFilters || filters;

    setIsLoading(true);
    setErrorMessage(null);
    setHasSearched(true);
    setActiveTab('beranda');

    try {
      const response = await executeSearch(q, currentMode, currentFilters);
      setResults(response.sources || []);
      setIntentAnalysis(response.intentAnalysis || null);
      setTotalFound(response.totalFound || 0);
      if (response.stats) {
        setSearchStats({
          ...response.stats,
          isBookPriority: response.isBookPriority,
        });
      }

      // Add to search history
      const historyItem: SearchHistoryItem = {
        id: Date.now().toString(),
        query: q,
        mode: currentMode,
        timestamp: Date.now(),
        resultCount: response.totalFound || 0,
      };
      setSearchHistory(prev => [historyItem, ...prev.filter(h => h.query.toLowerCase() !== q.toLowerCase())].slice(0, 30));
    } catch (err: any) {
      console.error('Search error:', err);
      setErrorMessage(err.message || 'Terjadi gangguan saat mengambil data referensi ilmiah.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePerformSearch();
  };

  // Toggle Save / Bookmark
  const handleToggleSave = (source: AcademicSource) => {
    const exists = savedSources.some(s => s.id === source.id);
    if (exists) {
      setSavedSources(prev => prev.filter(s => s.id !== source.id));
      showToastFeedback('Dihapus dari Referensi Saya');
    } else {
      const newSource: AcademicSource = {
        ...source,
        chapterCategory: 'BAB II', // default to BAB II
      };
      setSavedSources(prev => [newSource, ...prev]);
      showToastFeedback('Disimpan ke Referensi Saya (Bab II)!');
    }
  };

  const showToastFeedback = (msg: string) => {
    setSaveFeedback(msg);
    setTimeout(() => setSaveFeedback(null), 2500);
  };

  const handleUpdateCategory = (id: string, category: ChapterCategory) => {
    setSavedSources(prev => prev.map(s => s.id === id ? { ...s, chapterCategory: category } : s));
    showToastFeedback(`Dipindahkan ke ${category}`);
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setSavedSources(prev => prev.map(s => s.id === id ? { ...s, notes } : s));
    showToastFeedback('Catatan referensi diperbarui');
  };

  const handleRemoveSaved = (id: string) => {
    setSavedSources(prev => prev.filter(s => s.id !== id));
    showToastFeedback('Referensi dihapus dari koleksi');
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    showToastFeedback('Riwayat pencarian dikosongkan');
  };

  const handleRemoveHistoryItem = (id: string) => {
    setSearchHistory(prev => prev.filter(h => h.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {saveFeedback && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-xs shadow-2xl shadow-blue-500/40 border border-blue-400/40 flex items-center space-x-2 animate-bounce">
          <BookmarkCheck className="w-4 h-4 text-amber-300" />
          <span>{saveFeedback}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedSources.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* VIEW 1: BERANDA / SEARCH ENGINE */}
        {activeTab === 'beranda' && (
          <div className="space-y-8">
            
            {/* Hero / Search Bar Box */}
            <div className="relative rounded-2xl bg-gradient-to-br from-[#0c1427] via-[#090f1d] to-[#060a15] border border-slate-800/90 p-6 sm:p-10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-1/4 -mt-16 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 -mb-16 -mr-16 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
                
                {/* Micro Badge */}
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Mesin Pencari Ebook, Jurnal & Skripsi Terverifikasi</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-['Cinzel',serif] leading-tight">
                  Cari Referensi Ilmiah Untuk Skripsi & Tugas Akhir
                </h1>

                <p className="text-slate-400 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
                  Temukan buku teks, artikel jurnal terindeks, tesis, dan pustaka akademik dengan tautan resmi dan PDF yang dapat diverifikasi secara langsung.
                </p>

                {/* Primary Search Input Form */}
                <form onSubmit={handleSearchSubmit} className="pt-3 max-w-3xl mx-auto">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Masukkan kata kunci, topik skripsi, nama penulis, atau judul buku..."
                      className="w-full bg-[#070c18] border-2 border-slate-700 hover:border-slate-600 focus:border-blue-500 rounded-2xl py-4 pl-12 pr-32 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-xl transition-all"
                      required
                    />
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 absolute left-4 pointer-events-none" />

                    <button
                      type="submit"
                      disabled={isLoading || !searchQuery.trim()}
                      className="absolute right-2 sm:right-2.5 px-5 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 disabled:opacity-50 transition-all flex items-center space-x-1.5"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="hidden sm:inline">Mencari...</span>
                        </>
                      ) : (
                        <>
                          <span>CARI</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Search Modes Tabs */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                  {[
                    { id: 'general', label: '🌐 Semua Sumber', desc: 'Jurnal, Buku, Skripsi' },
                    { id: 'ebook', label: '📚 Ebook & Buku Teks', desc: 'Grand Theory & Metodologi' },
                    { id: 'jurnal', label: '📄 Jurnal Ilmiah', desc: 'Artikel Empiris Terakreditasi' },
                    { id: 'skripsi', label: '🎓 Skripsi & Tesis', desc: 'Repository Mahasiswa' },
                    { id: 'prosiding', label: '📑 Prosiding', desc: 'Konferensi Ilmiah' },
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSearchMode(m.id);
                        if (searchQuery.trim()) {
                          handlePerformSearch(searchQuery, m.id);
                        }
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        searchMode === m.id
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 border border-blue-400/40'
                          : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Suggestions Pills */}
                <div className="pt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-400">
                  <span className="text-[11px] text-slate-500 mr-1">Contoh topik:</span>
                  {studentSuggestions.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSearchQuery(item);
                        handlePerformSearch(item);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-blue-300 border border-slate-800/80 text-[11px] transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* AI Search Intent & Context Banner (Only when intent is available) */}
            {intentAnalysis && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-500/20 shadow-lg space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-blue-400">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Analisis Akademik Mesin Pencari</span>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                    Bidang: <strong className="text-white">{intentAnalysis.primarySubject}</strong>
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  <span className="text-slate-400">Maksud Pencarian:</span> {intentAnalysis.intentDescription}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                      Kata Kunci Bahasa Inggris (Internasional):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {intentAnalysis.englishTerms?.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSearchQuery(term);
                            handlePerformSearch(term);
                          }}
                          className="text-[11px] font-medium text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40 hover:underline"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                      Saran Pemanfaatan Bab Skripsi:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {intentAnalysis.recommendedChapters?.map((ch, i) => (
                        <span key={i} className="text-[11px] font-medium text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                          ✓ {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notice for Academic Integrity */}
            <ResponsibleSearchNotice />

            {/* Results Layout: Sidebar + Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* Desktop Filter Sidebar */}
              <div className="hidden lg:block lg:col-span-1 sticky top-24">
                <FilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  onApplyFilters={() => handlePerformSearch(searchQuery, searchMode, filters)}
                  onResetFilters={() => {
                    setFilters(DEFAULT_FILTERS);
                    handlePerformSearch(searchQuery, searchMode, DEFAULT_FILTERS);
                  }}
                />
              </div>

              {/* Mobile Filter Toggle */}
              <div className="lg:hidden flex items-center justify-between pb-2">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200"
                >
                  <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                  <span>{showMobileFilters ? 'Tutup Filter' : 'Filter & Urutan'}</span>
                </button>
                <span className="text-xs text-slate-400 font-medium">
                  {results.length} referensi
                </span>
              </div>

              {/* Mobile Filter Drawer */}
              {showMobileFilters && (
                <div className="lg:hidden col-span-1 mb-4">
                  <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    onApplyFilters={() => {
                      setShowMobileFilters(false);
                      handlePerformSearch(searchQuery, searchMode, filters);
                    }}
                    onResetFilters={() => {
                      setFilters(DEFAULT_FILTERS);
                      setShowMobileFilters(false);
                      handlePerformSearch(searchQuery, searchMode, DEFAULT_FILTERS);
                    }}
                  />
                </div>
              )}

              {/* Main Results Column */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Results count & status bar */}
                {hasSearched && (
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400">
                    <div>
                      Menampilkan <strong className="text-white">{results.length}</strong> sumber referensi untuk: <span className="text-blue-400 font-semibold italic">"{searchQuery}"</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Semua data asli & resmi
                    </div>
                  </div>
                )}

                {/* Loading state */}
                {isLoading && (
                  <div className="p-16 text-center space-y-4 bg-[#0b1324]/50 rounded-2xl border border-slate-800">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
                    <h3 className="text-base font-bold text-white">
                      Mencari Sumber Referensi Ilmiah Asli...
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Mengumpulkan data dari OpenAlex, Crossref, Google Books, arXiv, dan memverifikasi ketersediaan dokumen teks lengkap / PDF.
                    </p>
                  </div>
                )}

                {/* Results Section (Categorized & Not Mixed) */}
                {!isLoading && results.length > 0 && (
                  <div className="space-y-6">
                    {/* Multi-Stage Search Pipeline Banner */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-[#0b1426] via-[#091122] to-slate-900 border border-slate-800 shadow-lg space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span className="font-bold text-white tracking-wide">PENCARIAN BERTINGKAT TERINTEGRASI</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {searchStats?.isBookPriority ? '📚 Prioritas Ebook Aktif' : '🌐 Penelusuran Komprehensif'}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          Total {results.length} publikasi terverifikasi
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-950/70 border border-amber-500/20 flex flex-col justify-between">
                          <div className="flex items-center space-x-1.5 text-amber-300 font-semibold text-[11px]">
                            <Book className="w-3.5 h-3.5" />
                            <span>Tahap 1: Ebook & Buku</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            DOAB, OAPEN, Google Books, IA, Open Library
                          </div>
                          <div className="mt-1 text-xs font-bold text-slate-200">
                            {searchStats?.books || 0} Ebook Ditemukan
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-950/70 border border-blue-500/20 flex flex-col justify-between">
                          <div className="flex items-center space-x-1.5 text-blue-300 font-semibold text-[11px]">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Tahap 2: Jurnal & Riset</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            DOAJ, OpenAlex, Crossref, arXiv
                          </div>
                          <div className="mt-1 text-xs font-bold text-slate-200">
                            {searchStats?.journals || 0} Jurnal Ditemukan
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-950/70 border border-purple-500/20 flex flex-col justify-between">
                          <div className="flex items-center space-x-1.5 text-purple-300 font-semibold text-[11px]">
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>Repositori Kampus</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            UI, UGM, UNDIP, UNAIR, UB, dll
                          </div>
                          <div className="mt-1 text-xs font-bold text-slate-200">
                            {searchStats?.repositories || 0} Skripsi/Tesis
                          </div>
                        </div>
                      </div>

                      {Boolean(searchStats?.islamic && searchStats.islamic > 0) && (
                        <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-600/30 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2 text-emerald-300 font-medium text-[11px]">
                            <span>🕌 Koleksi Khusus Referensi Keislaman (Kitab & Pustaka Islam):</span>
                            <span className="font-bold text-white">{searchStats.islamic} referensi</span>
                          </div>
                          <button 
                            onClick={() => setSelectedCategoryTab('islamic')}
                            className="text-[11px] text-emerald-300 hover:underline font-semibold"
                          >
                            Buka Kategori &rarr;
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Category Tabs & Ordering Legend */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <button
                          onClick={() => setSelectedCategoryTab('all')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                            selectedCategoryTab === 'all'
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                              : 'bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700'
                          }`}
                        >
                          <span>Semua Kategori</span>
                          <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-[10px]">{results.length}</span>
                        </button>

                        {categoryGroups.map(group => (
                          <button
                            key={group.id}
                            onClick={() => setSelectedCategoryTab(group.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                              selectedCategoryTab === group.id
                                ? 'bg-slate-800 text-white border border-slate-600 shadow'
                                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800/80'
                            }`}
                          >
                            <span>{group.title.split(' ')[0]} {group.title.split(' ')[1]}</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${group.badgeClass}`}>
                              {group.items.length}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 self-start sm:self-auto">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Urutan: Ebook/Buku PDF &rarr; Jurnal Ilmiah &rarr; Skripsi</span>
                      </div>
                    </div>

                    {/* Render Category Groups sequentially */}
                    {displayedGroups.map(group => (
                      <div key={group.id} className="space-y-4">
                        {/* Distinct Category Section Header */}
                        <div className={`p-4 rounded-xl border ${group.headerBorder} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-lg`}>
                          <div className="flex items-center space-x-3">
                            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shrink-0">
                              {group.icon}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                                  {group.title}
                                </h3>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${group.badgeClass}`}>
                                  {group.badge}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 mt-0.5">
                                {group.subtitle}
                              </p>
                            </div>
                          </div>
                          <div className="shrink-0 flex items-center space-x-2 self-start sm:self-auto">
                            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-950/90 border border-slate-800 text-slate-200">
                              {group.items.length} Referensi
                            </span>
                          </div>
                        </div>

                        {/* Cards Grid for this category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          {group.items.map(source => (
                            <SearchCard
                              key={source.id}
                              source={source}
                              isSaved={savedSources.some(s => s.id === source.id)}
                              onSave={handleToggleSave}
                              onOpenCitation={(s) => setSelectedSourceForCitation(s)}
                              onOpenDetail={(s) => setSelectedSourceForDetail(s)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && hasSearched && results.length === 0 && (
                  <div className="p-16 text-center bg-[#0b1324] rounded-2xl border border-slate-800 space-y-4">
                    <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
                    <h3 className="text-base font-bold text-slate-200">
                      Tidak Ada Referensi yang Sesuai
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      Tidak ditemukan publikasi ilmiah yang cocok dengan kombinasi kata kunci dan filter saat ini.
                      Cobalah menggunakan istilah yang lebih umum, periksa ejaan, atau pilih rentang tahun yang lebih luas.
                    </p>
                  </div>
                )}

                {/* Initial Welcome State (Before search) */}
                {!hasSearched && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div 
                      onClick={() => setActiveTab('sintesis')}
                      className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all space-y-2.5 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300">
                        📚 Sintesis Pustaka (Bab II)
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Susun narasi komparasi penelitian terdahulu, bedah research gap, dan rancang hipotesis lengkap dengan ekspor Word (.docx).
                      </p>
                    </div>

                    <div 
                      onClick={() => setActiveTab('metodologi')}
                      className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all space-y-2.5 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Layers className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300">
                        📊 Metodologi & Uji Statistik (Bab III)
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Rekomendasi rumus sampel (Slovin/Roscoe), definisi operasional, uji asumsi klasik, dan solusi jika tidak lolos uji.
                      </p>
                    </div>

                    <div 
                      onClick={() => setActiveTab('parafrase')}
                      className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 hover:border-violet-500/50 cursor-pointer transition-all space-y-2.5 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-violet-300">
                        ✍️ Parafrase Anti-Plagiasi
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Tulis ulang kutipan dan ringkasan teori menjadi kalimat baku akademik tingkat tinggi agar aman dari cek Turnitin (&lt; 10%).
                      </p>
                    </div>

                    <div 
                      onClick={() => setActiveTab('empiris')}
                      className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all space-y-2.5 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <Layers className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300">
                        🔬 Matrik Penelitian Terdahulu
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Tabel komparasi artikel empiris lengkap dengan metode, variabel, sampel, dan temuan utama siap ekspor ke Word & Excel.
                      </p>
                    </div>

                    <div 
                      onClick={() => setActiveTab('judul')}
                      className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all space-y-2.5 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-purple-300">
                        🧠 Bedah Judul Skripsi
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Masukkan rencana judul Anda. AI membedah Variabel X, Y, Grand Theory, dan mencarikan buku referensinya.
                      </p>
                    </div>

                    <div 
                      onClick={() => setActiveTab('skripsi')}
                      className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all space-y-2.5 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-300">
                        🎓 Referensi Skripsi per Bab
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Cari pustaka ilmiah yang langsung dipetakan ke Bab I, Bab II Landasan Teori, atau Bab III Metodologi.
                      </p>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: REFERENSI SKRIPSI MODE */}
        {activeTab === 'skripsi' && (
          <ThesisReferenceMode
            onSearchThesis={({ topic, field, method, yearRange }) => {
              handlePerformSearch(`${topic} ${field} ${method}`, 'skripsi');
            }}
            isLoading={isLoading}
            results={results}
            savedSources={savedSources}
            onSave={handleToggleSave}
            onOpenCitation={(s) => setSelectedSourceForCitation(s)}
            onOpenDetail={(s) => setSelectedSourceForDetail(s)}
          />
        )}

        {/* VIEW 3: BEDAH JUDUL SKRIPSI */}
        {activeTab === 'judul' && (
          <ThesisTitleAnalyzer
            savedSources={savedSources}
            onSave={handleToggleSave}
            onOpenCitation={(s) => setSelectedSourceForCitation(s)}
            onOpenDetail={(s) => setSelectedSourceForDetail(s)}
          />
        )}

        {/* VIEW 4: BAB II & BAB III FINDER */}
        {activeTab === 'bab' && (
          <ChapterFinderModal
            savedSources={savedSources}
            onSave={handleToggleSave}
            onOpenCitation={(s) => setSelectedSourceForCitation(s)}
            onOpenDetail={(s) => setSelectedSourceForDetail(s)}
          />
        )}

        {/* VIEW 5: MATRIK PENELITIAN TERDAHULU */}
        {activeTab === 'empiris' && (
          <EmpiricalMatrixView />
        )}

        {/* VIEW: SINTESIS TINJAUAN PUSTAKA (BAB II) */}
        {activeTab === 'sintesis' && (
          <LiteratureSynthesisView
            availableSources={results}
            savedSources={savedSources}
            currentQuery={searchQuery}
          />
        )}

        {/* VIEW: PANDUAN METODOLOGI & UJI STATISTIK (BAB III) */}
        {activeTab === 'metodologi' && (
          <MethodologyGuideView
            currentTitle={searchQuery}
          />
        )}

        {/* VIEW: PARAFRASE AKADEMIK (TURNITIN-SAFE) */}
        {activeTab === 'parafrase' && (
          <AcademicParaphraseView
            availableSources={results}
          />
        )}

        {/* VIEW 6: REFERENSI SAYA (SAVED & EXPORT) */}
        {activeTab === 'saved' && (
          <SavedReferencesView
            savedSources={savedSources}
            onRemove={handleRemoveSaved}
            onUpdateCategory={handleUpdateCategory}
            onUpdateNotes={handleUpdateNotes}
            onOpenCitation={(s) => setSelectedSourceForCitation(s)}
            onOpenDetail={(s) => setSelectedSourceForDetail(s)}
          />
        )}

        {/* VIEW 7: RIWAYAT PENCARIAN */}
        {activeTab === 'riwayat' && (
          <SearchHistoryView
            history={searchHistory}
            onSelectQuery={(q, m) => {
              setSearchQuery(q);
              setSearchMode(m);
              handlePerformSearch(q, m);
            }}
            onRemoveItem={handleRemoveHistoryItem}
            onClearAll={handleClearHistory}
          />
        )}

      </main>

      {/* DETAIL MODAL */}
      <DetailModal
        source={selectedSourceForDetail}
        isOpen={Boolean(selectedSourceForDetail)}
        onClose={() => setSelectedSourceForDetail(null)}
        isSaved={Boolean(selectedSourceForDetail && savedSources.some(s => s.id === selectedSourceForDetail.id))}
        onSave={handleToggleSave}
        onOpenCitation={(s) => setSelectedSourceForCitation(s)}
      />

      {/* CITATION MODAL */}
      <CitationModal
        source={selectedSourceForCitation}
        isOpen={Boolean(selectedSourceForCitation)}
        onClose={() => setSelectedSourceForCitation(null)}
      />

      {/* Global Footer with Brand Requirements */}
      <Footer />
    </div>
  );
}
