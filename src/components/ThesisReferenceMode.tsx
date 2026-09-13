import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  BookOpen, 
  FileText, 
  Layers, 
  BarChart3, 
  Sparkles, 
  ChevronRight,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { AcademicSource } from '../types';
import { SearchCard } from './SearchCard';

interface ThesisReferenceModeProps {
  onSearchThesis: (params: { topic: string; field: string; method: string; yearRange: string }) => void;
  isLoading: boolean;
  results: AcademicSource[];
  savedSources: AcademicSource[];
  onSave: (source: AcademicSource) => void;
  onOpenCitation: (source: AcademicSource) => void;
  onOpenDetail: (source: AcademicSource) => void;
}

export const ThesisReferenceMode: React.FC<ThesisReferenceModeProps> = ({
  onSearchThesis,
  isLoading,
  results,
  savedSources,
  onSave,
  onOpenCitation,
  onOpenDetail,
}) => {
  const [topic, setTopic] = useState('');
  const [field, setField] = useState('Manajemen');
  const [method, setMethod] = useState<'Kuantitatif' | 'Kualitatif' | 'Mixed' | 'Tidak tahu'>('Kuantitatif');
  const [yearRange, setYearRange] = useState('2020-2026');
  const [activeSection, setActiveSection] = useState<'all' | 'teori' | 'empiris' | 'metode' | 'data'>('all');

  const fields = [
    'Manajemen & Bisnis',
    'Akuntansi & Keuangan',
    'Pendidikan & Keguruan',
    'Teknik Informatika & Sistem Informasi',
    'Ilmu Komunikasi & Media',
    'Ilmu Kesehatan & Kedokteran',
    'Psikologi',
    'Hukum',
    'Sosiologi & Ilmu Sosial',
    'Ilmu Pertanian & Peternakan',
    'Teknik Sipil / Mesin / Elektro',
    'Sastra & Bahasa',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onSearchThesis({ topic: topic.trim(), field, method, yearRange });
  };

  // Grouping results into 5 academic sections
  const groupResults = () => {
    const teori: AcademicSource[] = [];
    const empiris: AcademicSource[] = [];
    const metode: AcademicSource[] = [];
    const dataStatistik: AcademicSource[] = [];
    const pendukung: AcademicSource[] = [];

    results.forEach(s => {
      const text = `${s.title} ${s.abstract || ''} ${s.keywords?.join(' ') || ''}`.toLowerCase();
      
      if (s.sourceType === 'ebook' || text.includes('theory') || text.includes('teori') || text.includes('model')) {
        teori.push(s);
      } else if (text.includes('method') || text.includes('metode') || text.includes('sampling') || text.includes('uji') || text.includes('analisis regresi') || text.includes('sem')) {
        metode.push(s);
      } else if (s.sourceType === 'dataset' || s.sourceType === 'laporan' || text.includes('statistic') || text.includes('statistik') || text.includes('data')) {
        dataStatistik.push(s);
      } else if (s.sourceType === 'jurnal' || text.includes('pengaruh') || text.includes('hubungan') || text.includes('studi') || text.includes('impact') || text.includes('effect')) {
        empiris.push(s);
      } else {
        pendukung.push(s);
      }
    });

    return { teori, empiris, metode, dataStatistik, pendukung };
  };

  const groups = groupResults();

  const getFilteredList = () => {
    switch (activeSection) {
      case 'teori': return groups.teori;
      case 'empiris': return groups.empiris;
      case 'metode': return groups.metode;
      case 'data': return groups.dataStatistik;
      default: return results;
    }
  };

  const currentList = getFilteredList();

  return (
    <div className="space-y-8">
      {/* Banner / Form Card */}
      <div className="relative rounded-2xl bg-gradient-to-br from-indigo-950/70 via-[#0b1324] to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>Mode Khusus Penyusunan Tugas Akhir & Skripsi</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            🎓 Referensi Skripsi Terstruktur
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed mb-6">
            Dapatkan referensi yang langsung dikelompokkan ke dalam <strong className="text-indigo-300">Landasan Teori (BAB II)</strong>, <strong className="text-indigo-300">Penelitian Terdahulu</strong>, <strong className="text-indigo-300">Metodologi (BAB III)</strong>, dan <strong className="text-indigo-300">Data Statistik</strong>.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Topik */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5 uppercase tracking-wider">
                Topik / Judul Tentatif Penelitian:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Contoh: Pengaruh Brand Image dan Digital Marketing terhadap Keputusan Pembelian..."
                  className="w-full bg-slate-950/90 border border-slate-700 rounded-xl px-4 py-3.5 pl-11 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
                <Search className="w-5 h-5 text-indigo-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Grid Filters: Bidang, Metode, Tahun */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Bidang Ilmu:
                </label>
                <select
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {fields.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Pendekatan Metode:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Kuantitatif', 'Kualitatif', 'Mixed', 'Tidak tahu'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        method === m
                          ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Rentang Tahun Referensi:
                </label>
                <select
                  value={yearRange}
                  onChange={(e) => setYearRange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="2020-2026">5 Tahun Terakhir (2020–2026) — Standar Skripsi</option>
                  <option value="all">Semua Tahun (Termasuk Teori Klasik)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !topic.trim()}
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mencari & Mengelompokkan Referensi Skripsi...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Cari Referensi Skripsi</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Navigation Tabs (5 Kelompok Skripsi) */}
      {results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">
                Hasil Referensi Skripsi Terstruktur
              </h3>
              <p className="text-xs text-slate-400">
                Ditemukan <strong className="text-blue-400">{results.length}</strong> referensi resmi dan dapat diverifikasi
              </p>
            </div>

            {/* Section Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveSection('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeSection === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Semua ({results.length})
              </button>

              <button
                onClick={() => setActiveSection('teori')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                  activeSection === 'teori'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>1. Landasan Teori ({groups.teori.length})</span>
              </button>

              <button
                onClick={() => setActiveSection('empiris')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                  activeSection === 'empiris'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>2. Penelitian Terdahulu ({groups.empiris.length})</span>
              </button>

              <button
                onClick={() => setActiveSection('metode')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                  activeSection === 'metode'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. Metodologi ({groups.metode.length})</span>
              </button>

              <button
                onClick={() => setActiveSection('data')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                  activeSection === 'data'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                <span>4. Data & Statistik ({groups.dataStatistik.length})</span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {currentList.map(source => (
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

          {currentList.length === 0 && (
            <div className="p-8 text-center bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 text-xs">
              Tidak ada referensi di bagian ini. Coba pilih tab "Semua" atau perluas kata kunci pencarian Anda.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
