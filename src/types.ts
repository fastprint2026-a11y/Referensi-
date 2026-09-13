export type SourceType = 
  | 'ebook' 
  | 'jurnal' 
  | 'skripsi' 
  | 'tesis' 
  | 'disertasi' 
  | 'artikel' 
  | 'esai' 
  | 'prosiding' 
  | 'laporan' 
  | 'dataset';

export type AccessStatus = 'pdf_available' | 'open_access' | 'preview_only' | 'paywalled';

export type SintaRank = 'SINTA 1' | 'SINTA 2' | 'SINTA 3' | 'SINTA 4' | 'SINTA 5' | 'SINTA 6' | 'Scopus' | 'DOAJ' | 'Nasional';

export interface Author {
  name: string;
  affiliation?: string;
  orcid?: string;
}

export type ChapterCategory = 
  | 'BAB I' 
  | 'BAB II' 
  | 'BAB III' 
  | 'BAB IV' 
  | 'BAB V' 
  | 'Favorit' 
  | 'Skripsi Saya' 
  | 'Penelitian 1' 
  | 'Penelitian 2';

export type DatabaseSource = 
  | 'DOAB'
  | 'OAPEN'
  | 'Internet Archive'
  | 'Open Library'
  | 'Project Gutenberg'
  | 'Google Books'
  | 'OpenStax'
  | 'DOAJ'
  | 'CORE'
  | 'OpenAlex'
  | 'arXiv'
  | 'Crossref'
  | 'Indonesia OneSearch'
  | 'GARUDA'
  | 'SINTA'
  | 'Neliti'
  | 'Moraref'
  | 'Repository Kampus'
  | 'Referensi Keislaman'
  | 'Perpusnas / iPusnas'
  | 'National Library of Australia'
  | 'Repository Institusi';

export interface AcademicSource {
  id: string;
  title: string;
  authors: Author[];
  year: number | string;
  publisher?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  isbn?: string;
  issn?: string;
  language: 'id' | 'en' | 'other';
  sourceType: SourceType;
  abstract?: string;
  keywords?: string[];
  databaseSource: DatabaseSource;
  sourceDomain: string;
  sourceUrl: string;
  pdfUrl?: string | null;
  accessStatus: AccessStatus;
  accessNote?: string;
  relevanceLabel: 'Sangat relevan' | 'Relevan' | 'Cukup relevan';
  relevanceScore?: number; // 0 - 100
  suitableForChapters?: ('BAB I' | 'BAB II' | 'BAB III' | 'BAB IV' | 'BAB V' | 'Metodologi' | 'Landasan Teori')[];
  previewUrl?: string;
  citationCount?: number;
  openAccessLicense?: string;
  chapterCategory?: ChapterCategory;
  notes?: string;
  sintaRank?: SintaRank;
  isIslamicReference?: boolean;
  searchStage?: 'tahap_1_buku' | 'tahap_2_jurnal' | 'repository' | 'keislaman';
}

export interface SearchFilters {
  sourceTypes: SourceType[];
  yearRange: 'all' | '2024-2026' | '2020-2023' | '2015-2019' | 'pre-2015';
  accessType: 'all' | 'pdf_only' | 'open_access';
  language: 'all' | 'id' | 'en';
  sortBy: 'relevance' | 'year_desc' | 'year_asc' | 'citations';
  sintaFilter?: 'all' | 'sinta1_2' | 'sinta3_6' | 'international';
  databaseCategory?: 'all' | 'books_only' | 'journals_only' | 'islamic_only' | 'indonesia_only';
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  mode: string;
  timestamp: number | string;
  resultCount: number;
}

export interface SavedReference extends AcademicSource {
  savedAt: string;
  category: 'BAB I' | 'BAB II' | 'BAB III' | 'BAB IV' | 'BAB V' | 'Favorit' | 'Skripsi Saya' | 'Penelitian 1' | 'Penelitian 2';
  userNotes?: string;
}

export interface SearchIntentAnalysis {
  originalQuery: string;
  intentSummary: string;
  primarySubject: string;
  suggestedTerms: string[];
  englishTerms: string[];
  recommendedChapters: string[];
  methodologyFocus?: string;
  isCopyrightNoticeNeeded?: boolean;
}

export interface ThesisTitleDeconstruction {
  title: string;
  fieldOfStudy: string;
  independentVariables: string[]; // Variabel X
  dependentVariables: string[]; // Variabel Y
  moderatingVariables?: string[];
  targetPopulation: string;
  recommendedGrandTheories: string[];
  methodologySuggestions: string[];
  keywordsIndonesian: string[];
  keywordsEnglish: string[];
}

export interface EmpiricalStudyItem {
  id: string;
  title: string;
  authors: string;
  year: number | string;
  methodology: string;
  variables: string;
  sampleOrObject: string;
  mainFindings: string;
  doi?: string;
  articleUrl: string;
  pdfUrl?: string | null;
  journalOrPublisher?: string;
  sintaRank?: SintaRank;
}

// Synthesis Review for Chapter II
export interface LiteratureSynthesis {
  topic: string;
  narrativeParagraphs: string[];
  comparisonPoints: {
    authorYear: string;
    focus: string;
    method: string;
    similarity: string;
    differenceOrGap: string;
  }[];
  researchGapSummary: string;
  theoreticalConclusion: string;
  suggestedHypotheses: string[];
  inTextCitations: string[];
}

// Methodology and Statistical Tests for Chapter III
export interface MethodologyGuide {
  title: string;
  researchType: string;
  approachRationale: string;
  populationAndSample: {
    targetPopulation: string;
    samplingTechnique: string;
    sampleFormula: string;
    recommendedSampleSize: string;
  };
  operationalVariables: {
    variableName: string;
    role: 'Variabel Bebas (X)' | 'Variabel Terikat (Y)' | 'Variabel Moderasi / Mediasi (Z)';
    measurementScale: string;
    sampleIndicators: string[];
  }[];
  instrumentTests: {
    testName: string;
    criteria: string;
    guidance: string;
  }[];
  classicalAssumptions: {
    testName: string;
    criteria: string;
    solutionIfFailed: string;
  }[];
  hypothesisTests: {
    testName: string;
    suggestedTool: string;
    decisionRule: string;
  }[];
}

// Academic Paraphrasing for Plagiarism Reduction
export interface AcademicParaphraseResult {
  originalText: string;
  options: {
    style: 'Formal Akademis' | 'Sintesis Kritis Komparatif' | 'Ringkas & Lugas';
    text: string;
    keyChanges: string;
    turnitinRiskLevel: 'Sangat Rendah (< 5%)' | 'Rendah (5-10%)' | 'Sedang';
  }[];
  academicVocabularyUsed: string[];
  inTextCitationExample: string;
}
