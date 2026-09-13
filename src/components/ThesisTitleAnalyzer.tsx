import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  BrainCircuit, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  Loader2,
  Bookmark,
  ExternalLink,
  Quote
} from 'lucide-react';
import { AcademicSource, ThesisTitleDeconstruction } from '../types';
import { analyzeThesisTitle } from '../services/api';
import { SearchCard } from './SearchCard';

interface ThesisTitleAnalyzerProps {
  savedSources: AcademicSource[];
  onSave: (source: AcademicSource) => void;
  onOpenCitation: (source: AcademicSource) => void;
  onOpenDetail: (source: AcademicSource) => void;
}

export const ThesisTitleAnalyzer: React.FC<ThesisTitleAnalyzerProps> = ({
  savedSources,
  onSave,
  onOpenCitation,
  onOpenDetail,
}) => {
  const [titleInput, setTitleInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deconstruction, setDeconstruction] = useState<ThesisTitleDeconstruction | null>(null);
  const [matchedSources, setMatchedSources] = useState<AcademicSource[]>([]);

  const exampleTitles = [
    'Pengaruh Media Sosial TikTok terhadap Minat Beli Konsumen Generasi Z di Surabaya',
    'Analisis Kinerja Keuangan dengan Metode CAMEL terhadap Profitabilitas Bank Syariah',
    'Penerapan Algoritma Naive Bayes untuk Analisis Sentimen Pengguna Aplikasi E-Commerce',
    'Pengaruh Kompensasi dan Lingkungan Kerja terhadap Kepuasan Kerja Guru Sekolah Dasar',
  ];

  const handleAnalyze = async (titleToAnalyze: string) => {
    if (!titleToAnalyze.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await analyzeThesisTitle(titleToAnalyze.trim());
      setDeconstruction(res.deconstruction);
      setMatchedSources(res.sources);
    } catch (err: any) {
      setError(err.message || 'Gagal membedah judul skripsi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner / Form */}
      <div className="relative rounded-2xl bg-gradient-to-br from-purple-950/70 via-[#0b1324] to-slate-900 border border-purple-500/30 p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">
            <BrainCircuit className="w-4 h-4" />
            <span>AI Academic Title Deconstructor</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            🧠 Cari Referensi dari Judul Skripsi
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed mb-6">
            Masukkan judul lengkap rencana skripsi Anda. Sistem secara otomatis akan membedah <strong className="text-purple-300">Variabel Bebas (X)</strong>, <strong className="text-purple-300">Variabel Terikat (Y)</strong>, <strong className="text-purple-300">Grand Theory</strong>, dan mencarikan referensi buku serta jurnal empiris yang tepat.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(titleInput); }} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5 uppercase tracking-wider">
                Tulis / Tempel Judul Skripsi Lengkap:
              </label>
              <textarea
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="Contoh: Pengaruh Penggunaan Media Sosial terhadap Minat Beli Mahasiswa di Kota Surabaya"
                rows={3}
                className="w-full bg-slate-950/90 border border-slate-700 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                required
              />
            </div>

            {/* Example pills */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Contoh judul mahasiswa:</span>
              <div className="flex flex-wrap gap-1.5">
                {exampleTitles.map((ex, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTitleInput(ex);
                      handleAnalyze(ex);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-900 hover:bg-purple-950/60 text-slate-300 hover:text-purple-200 border border-slate-800 transition-colors text-left"
                  >
                    "{ex}"
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !titleInput.trim()}
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Membedah Variabel & Mengumpulkan Referensi...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Bedah Judul & Cari Referensi</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Deconstruction Analysis View */}
      {deconstruction && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0b1324] border border-purple-500/20 shadow-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <BrainCircuit className="w-5 h-5 text-purple-400" />
                <span>Hasil Bedah Struktur Akademis Judul</span>
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
                Bidang: {deconstruction.fieldOfStudy}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Variabel X */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  Variabel Bebas / Independen (X):
                </span>
                <ul className="space-y-1 text-slate-200 font-medium">
                  {deconstruction.independentVariables.map((x, i) => (
                    <li key={i} className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Variabel Y */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Variabel Terikat / Dependen (Y):
                </span>
                <ul className="space-y-1 text-slate-200 font-medium">
                  {deconstruction.dependentVariables.map((y, i) => (
                    <li key={i} className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{y}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Grand Theory */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Rekomendasi Grand Theory:
                </span>
                <ul className="space-y-1 text-slate-200 font-medium">
                  {deconstruction.recommendedGrandTheories.map((th, i) => (
                    <li key={i} className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>{th}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                <strong className="text-slate-400 text-[11px] block mb-1">Target Populasi / Konteks:</strong>
                {deconstruction.targetPopulation}
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                <strong className="text-slate-400 text-[11px] block mb-1">Rekomendasi Metodologi:</strong>
                {deconstruction.methodologySuggestions.join(', ')}
              </div>
            </div>
          </div>

          {/* Matched References List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h4 className="text-base font-bold text-white">
                  Daftar Referensi yang Ditemukan untuk Judul Ini
                </h4>
                <p className="text-xs text-slate-400">
                  {matchedSources.length} publikasi buku teori & jurnal empiris terkait variabel X dan Y
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {matchedSources.map(source => (
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
          </div>
        </div>
      )}
    </div>
  );
};
