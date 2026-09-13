import React from 'react';
import { Filter, RotateCcw, Book, FileText, GraduationCap, FileCode, Database, Check } from 'lucide-react';
import { SearchFilters, SourceType } from '../types';

interface FilterSidebarProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  onApplyFilters,
  onResetFilters,
}) => {
  const allSourceTypes: { type: SourceType; label: string; icon?: React.ReactNode }[] = [
    { type: 'ebook', label: 'Ebook & Buku', icon: <Book className="w-3.5 h-3.5 text-amber-400" /> },
    { type: 'jurnal', label: 'Jurnal Ilmiah', icon: <FileText className="w-3.5 h-3.5 text-blue-400" /> },
    { type: 'skripsi', label: 'Skripsi / Tesis', icon: <GraduationCap className="w-3.5 h-3.5 text-purple-400" /> },
    { type: 'artikel', label: 'Artikel Ilmiah' },
    { type: 'prosiding', label: 'Prosiding Konferensi', icon: <FileCode className="w-3.5 h-3.5 text-cyan-400" /> },
    { type: 'laporan', label: 'Laporan Penelitian' },
    { type: 'dataset', label: 'Dataset Akademik', icon: <Database className="w-3.5 h-3.5 text-emerald-400" /> },
  ];

  const handleToggleSourceType = (type: SourceType) => {
    setFilters(prev => {
      const exists = prev.sourceTypes.includes(type);
      const updated = exists 
        ? prev.sourceTypes.filter(t => t !== type)
        : [...prev.sourceTypes, type];
      return { ...prev, sourceTypes: updated };
    });
  };

  const handleSelectAllTypes = () => {
    setFilters(prev => ({
      ...prev,
      sourceTypes: [],
    }));
  };

  return (
    <div className="bg-[#0b1324]/90 border border-slate-800 rounded-xl p-5 space-y-6 text-xs text-slate-300 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-sm text-white">Filter Pencarian</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-slate-400 hover:text-white flex items-center space-x-1 text-[11px] transition-colors"
          title="Reset semua filter"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 0. Prioritas Sumber & Pangkalan Data */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-slate-200 uppercase tracking-wider text-[10px]">
            Prioritas Pangkalan Data
          </label>
          <span className="text-[10px] text-emerald-400 font-medium">Tahap 1 & 2</span>
        </div>
        <div className="space-y-1">
          {[
            { id: 'all', label: '🌐 Semua Pangkalan Data' },
            { id: 'books_only', label: '📚 Ebook & Buku (DOAB, OAPEN, IA, OL)' },
            { id: 'journals_only', label: '📄 Jurnal Ilmiah (DOAJ, OpenAlex, Crossref)' },
            { id: 'indonesia_only', label: '🏛️ Repositori Kampus & SINTA' },
            { id: 'islamic_only', label: '🕌 Referensi Keislaman (Kitab & Hadits)' },
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, databaseCategory: cat.id as any }))}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all ${
                (filters.databaseCategory || 'all') === cat.id
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                  : 'hover:bg-slate-800/60 text-slate-400 border border-transparent'
              }`}
            >
              <span className="truncate">{cat.label}</span>
              {(filters.databaseCategory || 'all') === cat.id && (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Jenis Sumber */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-slate-200 uppercase tracking-wider text-[10px]">
            Jenis Sumber Referensi
          </label>
          {filters.sourceTypes.length > 0 && (
            <button
              onClick={handleSelectAllTypes}
              className="text-[10px] text-blue-400 hover:underline"
            >
              Semua Jenis
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          {allSourceTypes.map(({ type, label, icon }) => {
            const isChecked = filters.sourceTypes.length === 0 || filters.sourceTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleToggleSourceType(type)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all ${
                  filters.sourceTypes.includes(type)
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {icon}
                  <span>{label}</span>
                </div>
                {filters.sourceTypes.includes(type) && (
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Rentang Tahun */}
      <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
        <label className="font-semibold text-slate-200 uppercase tracking-wider text-[10px]">
          Tahun Publikasi
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'all', label: 'Semua Tahun' },
            { id: '2024-2026', label: '2024–2026' },
            { id: '2020-2023', label: '2020–2023' },
            { id: '2015-2019', label: '2015–2019' },
            { id: 'pre-2015', label: 'Sebelum 2015' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilters(prev => ({ ...prev, yearRange: opt.id as any }))}
              className={`px-2.5 py-1.5 rounded-lg text-center font-medium transition-all ${
                filters.yearRange === opt.id
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-semibold'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Akses Dokumen */}
      <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
        <label className="font-semibold text-slate-200 uppercase tracking-wider text-[10px]">
          Akses Dokumen
        </label>
        <div className="space-y-1">
          {[
            { id: 'all', label: 'Semua Akses' },
            { id: 'pdf_only', label: '🟢 PDF Tersedia Saja' },
            { id: 'open_access', label: '🔵 Open Access / Bebas' },
          ].map(acc => (
            <button
              key={acc.id}
              onClick={() => setFilters(prev => ({ ...prev, accessType: acc.id as any }))}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left transition-all ${
                filters.accessType === acc.id
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                  : 'hover:bg-slate-800 text-slate-400 border border-transparent'
              }`}
            >
              <span>{acc.label}</span>
              {filters.accessType === acc.id && (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Bahasa */}
      <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
        <label className="font-semibold text-slate-200 uppercase tracking-wider text-[10px]">
          Bahasa
        </label>
        <div className="grid grid-cols-3 gap-1">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'id', label: 'Indonesia' },
            { id: 'en', label: 'Inggris' },
          ].map(lang => (
            <button
              key={lang.id}
              onClick={() => setFilters(prev => ({ ...prev, language: lang.id as any }))}
              className={`py-1.5 rounded-lg text-center font-medium transition-all ${
                filters.language === lang.id
                  ? 'bg-blue-600/30 text-blue-200 border border-blue-500/40 font-semibold'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Indeks SINTA & Reputasi */}
      <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-slate-200 uppercase tracking-wider text-[10px]">
            Akreditasi SINTA & Reputasi
          </label>
          <span className="text-[10px] text-amber-400 font-bold">Kemenristek</span>
        </div>
        <div className="space-y-1">
          {[
            { id: 'all', label: 'Semua Akreditasi' },
            { id: 'sinta1_2', label: '⭐ SINTA 1 & 2 (Top Tier)' },
            { id: 'sinta3_6', label: '🏷️ SINTA 3 - 6 / Nasional' },
            { id: 'international', label: '🌐 Scopus / DOAJ Internasional' },
          ].map(sinta => (
            <button
              key={sinta.id}
              onClick={() => setFilters(prev => ({ ...prev, sintaFilter: sinta.id as any }))}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left transition-all ${
                (filters.sintaFilter || 'all') === sinta.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'hover:bg-slate-800 text-slate-400 border border-transparent'
              }`}
            >
              <span>{sinta.label}</span>
              {(filters.sintaFilter || 'all') === sinta.id && (
                <Check className="w-3.5 h-3.5 text-amber-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Urutkan Berdasarkan */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <label className="font-semibold text-slate-200 uppercase tracking-wider text-[10px]">
          Urutan Hasil
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
        >
          <option value="relevance">Paling Relevan</option>
          <option value="year_desc">Tahun Terbaru (2026 ke bawah)</option>
          <option value="year_asc">Tahun Terlama</option>
          <option value="citations">Sitasi Terbanyak</option>
        </select>
      </div>

      {/* Apply Button */}
      <button
        onClick={onApplyFilters}
        className="w-full py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white text-xs transition-all shadow-md shadow-blue-900/30"
      >
        Terapkan Filter
      </button>
    </div>
  );
};
