import { AcademicSource, EmpiricalStudyItem, SearchFilters, SearchIntentAnalysis, ThesisTitleDeconstruction } from '../types';

export interface SearchResponse {
  success: boolean;
  query: string;
  mode: string;
  intentAnalysis: SearchIntentAnalysis;
  isBookPriority?: boolean;
  isIslamicQuery?: boolean;
  stats?: {
    books: number;
    journals: number;
    repositories: number;
    islamic: number;
  };
  totalFound: number;
  sources: AcademicSource[];
  error?: string;
}

export interface AnalyzeTitleResponse {
  success: boolean;
  deconstruction: ThesisTitleDeconstruction;
  totalFound: number;
  sources: AcademicSource[];
  error?: string;
}

export interface EmpiricalMatrixResponse {
  success: boolean;
  topic: string;
  total: number;
  matrix: EmpiricalStudyItem[];
  error?: string;
}

export interface ChapterFinderResponse {
  success: boolean;
  topic: string;
  chapter: string;
  sources: AcademicSource[];
  error?: string;
}

export async function executeSearch(
  query: string,
  mode: string = 'general',
  filters?: SearchFilters
): Promise<SearchResponse> {
  const res = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, mode, filters }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Gagal melakukan pencarian' }));
    throw new Error(err.error || 'Terjadi kesalahan saat memproses pencarian');
  }

  return res.json();
}

export async function analyzeThesisTitle(title: string): Promise<AnalyzeTitleResponse> {
  const res = await fetch('/api/analyze-title', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Gagal membedah judul' }));
    throw new Error(err.error || 'Terjadi kesalahan saat membedah judul skripsi');
  }

  return res.json();
}

export async function getEmpiricalMatrix(topic: string): Promise<EmpiricalMatrixResponse> {
  const res = await fetch('/api/empirical-matrix', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Gagal menyusun matrik' }));
    throw new Error(err.error || 'Terjadi kesalahan saat menyusun matrik penelitian terdahulu');
  }

  return res.json();
}

export async function getChapterReferences(
  topic: string,
  chapter: 'BAB II' | 'BAB III',
  methodology?: string
): Promise<ChapterFinderResponse> {
  const res = await fetch('/api/thesis-chapter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, chapter, methodology }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Gagal mencari bab referensi' }));
    throw new Error(err.error || 'Terjadi kesalahan');
  }

  return res.json();
}
