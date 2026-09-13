import React, { useState } from 'react';
import { 
  Bookmark, 
  Trash2, 
  Download, 
  FolderPlus, 
  Folder, 
  Edit3, 
  ExternalLink, 
  Quote, 
  Check, 
  Search,
  BookOpen,
  FileText
} from 'lucide-react';
import { AcademicSource, ChapterCategory } from '../types';
import { generateAPA7, generateRIS, generateBibTeX } from '../utils/citation';
import { exportBibliographyToWord } from '../utils/exportDocx';

interface SavedReferencesViewProps {
  savedSources: AcademicSource[];
  onRemove: (id: string) => void;
  onUpdateCategory: (id: string, category: ChapterCategory) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onOpenCitation: (source: AcademicSource) => void;
  onOpenDetail: (source: AcademicSource) => void;
}

export const SavedReferencesView: React.FC<SavedReferencesViewProps> = ({
  savedSources,
  onRemove,
  onUpdateCategory,
  onUpdateNotes,
  onOpenCitation,
  onOpenDetail,
}) => {
  const [activeFolder, setActiveFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const folders: { id: ChapterCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Semua Referensi' },
    { id: 'BAB I', label: 'Bab I — Latar Belakang' },
    { id: 'BAB II', label: 'Bab II — Landasan Teori' },
    { id: 'BAB III', label: 'Bab III — Metodologi' },
    { id: 'BAB IV', label: 'Bab IV — Pembahasan' },
    { id: 'BAB V', label: 'Bab V — Kesimpulan' },
    { id: 'Favorit', label: '⭐ Favorit' },
  ];

  // Filtering
  const filteredSources = savedSources.filter(s => {
    const matchesFolder = activeFolder === 'all' || s.chapterCategory === activeFolder;
    const matchesQuery = !searchQuery.trim() || 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.notes && s.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesQuery;
  });

  const handleStartEditNote = (source: AcademicSource) => {
    setEditingNoteId(source.id);
    setNoteText(source.notes || '');
  };

  const handleSaveNote = (id: string) => {
    onUpdateNotes(id, noteText);
    setEditingNoteId(null);
  };

  // Export functions
  const exportBibliographyTxt = () => {
    const text = filteredSources.map((s, idx) => `${idx + 1}. ${generateAPA7(s)}`).join('\n\n');
    downloadFile(text, 'daftar-pustaka-zain-net.txt', 'text/plain');
  };

  const exportRis = () => {
    const risContent = filteredSources.map(generateRIS).join('\n\n');
    downloadFile(risContent, 'referensi-zotero-mendeley.ris', 'application/x-research-info-systems');
  };

  const exportBibTeX = () => {
    const bibContent = filteredSources.map(generateBibTeX).join('\n\n');
    downloadFile(bibContent, 'referensi-skripsi.bib', 'text/plain');
  };

  const exportCsv = () => {
    const headers = ['No', 'Kategori Bab', 'Judul', 'Penulis', 'Tahun', 'Penerbit/Jurnal', 'DOI', 'Tautan', 'Catatan'];
    const rows = filteredSources.map((s, idx) => [
      idx + 1,
      `"${s.chapterCategory || 'Umum'}"`,
      `"${s.title.replace(/"/g, '""')}"`,
      `"${s.authors.map(a => a.name).join(', ').replace(/"/g, '""')}"`,
      s.year || '',
      `"${(s.journal || s.publisher || '').replace(/"/g, '""')}"`,
      s.doi || '',
      s.pdfUrl || s.sourceUrl,
      `"${(s.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', 'daftar-referensi-tersimpan.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type: `${type};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-[#0b1324] border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Bookmark className="w-4 h-4" />
            <span>Koleksi Pribadi Mahasiswa</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            📚 Referensi Saya
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Kelola kumpulan rujukan skripsi per bab, tambahkan catatan operasional, dan ekspor ke format Mendeley / Zotero / Word.
          </p>
        </div>

        {/* Quick Export Actions */}
        {savedSources.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportBibliographyToWord(filteredSources, 'Daftar Pustaka Skripsi (Format APA 7th)')}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm"
              title="Ekspor daftar pustaka ke dokumen Microsoft Word (.docx)"
            >
              <FileText className="w-3.5 h-3.5 text-white" />
              <span>Daftar Pustaka Word (.docx)</span>
            </button>

            <button
              onClick={exportBibliographyTxt}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Ekspor daftar pustaka format APA 7"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Daftar Pustaka (TXT)</span>
            </button>

            <button
              onClick={exportRis}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Unduh file RIS untuk Mendeley / Zotero"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mendeley / Zotero (RIS)</span>
            </button>

            <button
              onClick={exportBibTeX}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Unduh format BibTeX"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>BibTeX</span>
            </button>

            <button
              onClick={exportCsv}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors shadow-sm"
              title="Ekspor tabel spreadsheet"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Excel / CSV</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Folder Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-[#0b1324] border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
              Kategori Bab Skripsi
            </span>

            {folders.map(f => {
              const count = f.id === 'all' 
                ? savedSources.length 
                : savedSources.filter(s => s.chapterCategory === f.id).length;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFolder(f.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeFolder === f.id
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <Folder className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{f.label}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right List Area */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Search within saved references */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari dalam referensi tersimpan atau catatan..."
              className="w-full bg-[#0b1324] border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>

          {/* List of Cards */}
          {filteredSources.length > 0 ? (
            <div className="space-y-4">
              {filteredSources.map((source, idx) => (
                <div 
                  key={source.id}
                  className="p-5 rounded-xl bg-[#0b1324] border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        {/* Folder selector */}
                        <select
                          value={source.chapterCategory || 'BAB II'}
                          onChange={(e) => onUpdateCategory(source.id, e.target.value as ChapterCategory)}
                          className="text-[10px] font-semibold bg-slate-900 border border-slate-800 rounded px-2 py-1 text-emerald-300 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="BAB I">📁 Bab I — Latar Belakang</option>
                          <option value="BAB II">📁 Bab II — Landasan Teori</option>
                          <option value="BAB III">📁 Bab III — Metodologi</option>
                          <option value="BAB IV">📁 Bab IV — Pembahasan</option>
                          <option value="BAB V">📁 Bab V — Kesimpulan</option>
                          <option value="Favorit">⭐ Favorit</option>
                        </select>

                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          {source.sourceType}
                        </span>

                        <span className="text-xs text-slate-400">
                          Tahun: {source.year || 't.t.'}
                        </span>
                      </div>

                      <h4 
                        onClick={() => onOpenDetail(source)}
                        className="text-base font-bold text-white hover:text-blue-300 cursor-pointer transition-colors leading-snug"
                      >
                        {source.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        {source.authors.map(a => a.name).join(', ')} {source.journal ? `• ${source.journal}` : (source.publisher ? `• ${source.publisher}` : '')}
                      </p>
                    </div>

                    <button
                      onClick={() => onRemove(source.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800/80 transition-colors"
                      title="Hapus dari referensi saya"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Catatan Mahasiswa */}
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs">
                    {editingNoteId === source.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Tulis catatan penggunaan (misal: Digunakan pada sub-bab 2.1.2 definisi operasional X)..."
                          rows={2}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-white"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => handleSaveNote(source.id)}
                            className="px-3 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-md"
                          >
                            Simpan Catatan
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-slate-300 italic text-[11px]">
                          {source.notes ? (
                            <span>Catatan: "{source.notes}"</span>
                          ) : (
                            <span className="text-slate-500 font-normal">Belum ada catatan untuk referensi ini.</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleStartEditNote(source)}
                          className="text-[10px] text-slate-400 hover:text-emerald-400 flex items-center space-x-1 shrink-0"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{source.notes ? 'Edit Catatan' : '+ Catatan'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Footer actions */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center space-x-3">
                      {source.pdfUrl ? (
                        <a
                          href={source.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline font-semibold flex items-center space-x-1"
                        >
                          <span>Buka PDF Resmi</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <a
                          href={source.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline flex items-center space-x-1"
                        >
                          <span>Buka Sumber</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <button
                        onClick={() => onOpenCitation(source)}
                        className="text-slate-400 hover:text-amber-300 flex items-center space-x-1"
                      >
                        <Quote className="w-3 h-3" />
                        <span>Sitasi</span>
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-500">
                      ID: {source.id.slice(0, 15)}...
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-[#0b1324] border border-slate-800 rounded-xl space-y-3">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-300">Belum ada referensi di folder ini</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Gunakan tombol bintang atau "Simpan Referensi" pada kartu pencarian untuk mengelompokkannya ke Bab I–V skripsi Anda.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
