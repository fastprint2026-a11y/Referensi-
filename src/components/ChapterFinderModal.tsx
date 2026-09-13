import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  Search, 
  BookOpen, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { AcademicSource } from '../types';
import { getChapterReferences } from '../services/api';
import { SearchCard } from './SearchCard';

interface ChapterFinderModalProps {
  savedSources: AcademicSource[];
  onSave: (source: AcademicSource) => void;
  onOpenCitation: (source: AcademicSource) => void;
  onOpenDetail: (source: AcademicSource) => void;
}

export const ChapterFinderModal: React.FC<ChapterFinderModalProps> = ({
  savedSources,
  onSave,
  onOpenCitation,
  onOpenDetail,
}) => {
  const [selectedChapter, setSelectedChapter] = useState<'BAB II' | 'BAB III'>('BAB II');
  const [topicInput, setTopicInput] = useState('');
  const [methodologyInput, setMethodologyInput] = useState('Kuantitatif SEM-PLS');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AcademicSource[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const bab2Categories = [
    'A. TEORI UTAMA (Grand Theory)',
    'B. TEORI PENDUKUNG (Middle Range Theory)',
    'C. VARIABEL PENELITIAN',
    'D. PENELITIAN TERDAHULU',
    'E. DEFINISI KONSEP & OPERASIONAL',
    'F. MODEL KONSEPTUAL & HIPOTESIS',
  ];

  const bab3Topics = [
    'Desain & Metode Penelitian',
    'Populasi & Teknik Sampling',
    'Pengembangan Instrumen & Kuesioner',
    'Uji Validitas & Reliabilitas',
    'Analisis Regresi Berganda',
    'Structural Equation Modeling (SEM-PLS)',
    'Wawancara & Triangulasi Data (Kualitatif)',
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await getChapterReferences(
        topicInput.trim(),
        selectedChapter,
        selectedChapter === 'BAB III' ? methodologyInput : undefined
      );
      setResults(res.sources);
    } catch (err) {
      console.error('Error fetching chapter references:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Selector & Header Card */}
      <div className="relative rounded-2xl bg-gradient-to-br from-amber-950/50 via-[#0b1324] to-slate-900 border border-amber-500/30 p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="relative z-10 space-y-6">
          
          {/* Chapter Selector Tabs */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => { setSelectedChapter('BAB II'); setResults([]); setHasSearched(false); }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 ${
                selectedChapter === 'BAB II'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>🔎 Cari Referensi BAB II (Landasan Teori)</span>
            </button>

            <button
              onClick={() => { setSelectedChapter('BAB III'); setResults([]); setHasSearched(false); }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 ${
                selectedChapter === 'BAB III'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>🔎 Cari Referensi BAB III (Metodologi)</span>
            </button>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              {selectedChapter === 'BAB II' 
                ? '📚 Spesialis Sumber BAB II: Landasan Teori & Tinjauan Pustaka' 
                : '📐 Spesialis Sumber BAB III: Metodologi & Teknik Analisis Data'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {selectedChapter === 'BAB II'
                ? 'Temukan buku teori utama, teori pendukung, rujukan variabel, dan sintesis konsep untuk menyusun Bab II yang kuat.'
                : 'Temukan buku metodologi penelitian resmi (Sugiyono, Creswell, Sekaran, Hair) dan rujukan teknik analisis statistik / kualitatif.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={selectedChapter === 'BAB III' ? 'sm:col-span-2' : 'sm:col-span-3'}>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5 uppercase tracking-wider">
                  Topik Skripsi / Fokus Kajian:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder={
                      selectedChapter === 'BAB II'
                        ? 'Contoh: Keputusan Pembelian, Loyalitas Pelanggan, E-Commerce, Stunting...'
                        : 'Contoh: Metode penelitian kuantitatif survei, Structural Equation Modeling, Studi Kasus...'
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
                    required
                  />
                  <Search className="w-5 h-5 text-amber-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {selectedChapter === 'BAB III' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5 uppercase tracking-wider">
                    Metode & Analisis:
                  </label>
                  <select
                    value={methodologyInput}
                    onChange={(e) => setMethodologyInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Kuantitatif Regresi">Kuantitatif — Regresi Linier Berganda</option>
                    <option value="Kuantitatif SEM-PLS">Kuantitatif — SEM-PLS (SmartPLS)</option>
                    <option value="Kuantitatif Uji t Uji F">Kuantitatif — Statistik Inferensial / SPSS</option>
                    <option value="Kualitatif Fenomenologi">Kualitatif — Fenomenologi & Wawancara</option>
                    <option value="Kualitatif Studi Kasus">Kualitatif — Studi Kasus & Triangulasi</option>
                    <option value="R&D Pengembangan">Pengembangan (R&D / ADDIE)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Sub-topics quick badges */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium">Kategori Rujukan yang Dicakup:</span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedChapter === 'BAB II' ? bab2Categories : bab3Topics).map((cat, i) => (
                  <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                    ✓ {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !topicInput.trim()}
                className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 transition-all shadow-lg flex items-center justify-center space-x-2 ${
                  selectedChapter === 'BAB II'
                    ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mencari Referensi {selectedChapter}...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Cari Sumber Khusus {selectedChapter}</span>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* Results View */}
      {hasSearched && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Rekomendasi Referensi Terpilih untuk {selectedChapter}
              </h3>
              <p className="text-xs text-slate-400">
                Menampilkan <strong className="text-amber-400">{results.length}</strong> buku teks teori dan jurnal rujukan
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {results.map(source => (
              <SearchCard
                key={source.id}
                source={source}
                isSaved={savedSources.some(s => s.id === source.id)}
                onSave={onSave}
                onOpenCitation={onOpenCitation}
                onOpenDetail={onOpenDetail}
              />
            ))}
          </div>

          {results.length === 0 && !isLoading && (
            <div className="p-8 text-center bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 text-xs">
              Belum ditemukan sumber yang cocok. Coba gunakan kata kunci yang lebih spesifik.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
