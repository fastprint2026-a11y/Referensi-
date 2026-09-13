import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  Quote, 
  Bookmark, 
  BookmarkCheck,
  ShieldCheck, 
  Calendar, 
  Building, 
  BookOpen,
  Info
} from 'lucide-react';
import { AcademicSource } from '../types';
import { generateAPA7 } from '../utils/citation';

interface DetailModalProps {
  source: AcademicSource | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onSave: (source: AcademicSource) => void;
  onOpenCitation: (source: AcademicSource) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  source,
  isOpen,
  onClose,
  isSaved,
  onSave,
  onOpenCitation,
}) => {
  const [copiedDoi, setCopiedDoi] = useState(false);
  const [copiedApa, setCopiedApa] = useState(false);

  if (!isOpen || !source) return null;

  const handleCopyDoi = () => {
    if (source.doi) {
      navigator.clipboard.writeText(source.doi);
      setCopiedDoi(true);
      setTimeout(() => setCopiedDoi(false), 2000);
    }
  };

  const handleCopyApa = () => {
    const text = generateAPA7(source);
    navigator.clipboard.writeText(text);
    setCopiedApa(true);
    setTimeout(() => setCopiedApa(false), 2000);
  };

  const authorNames = source.authors && source.authors.length > 0 
    ? source.authors.map(a => a.name).join('; ') 
    : (source.publisher || 'Penulis');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-[#0b1324] border border-slate-700/80 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0e172a]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-blue-400">
                Informasi Detail Sumber Ilmiah
              </span>
              <p className="text-[11px] text-slate-400">
                Terverifikasi dari database {source.databaseSource}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Title & Type */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold uppercase bg-blue-500/10 text-blue-300 border border-blue-500/20">
                {source.sourceType}
              </span>
              
              {source.accessStatus === 'pdf_available' && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  🟢 PDF Tersedia
                </span>
              )}
              {source.accessStatus === 'open_access' && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  🟢 Open Access
                </span>
              )}
              {source.accessStatus === 'preview_only' && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  🟡 Preview Tersedia
                </span>
              )}
              {source.accessStatus === 'paywalled' && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  🔴 Akses Penerbit
                </span>
              )}

              <span className="text-xs text-slate-400">
                Bahasa: <strong className="text-slate-200">{source.language === 'id' ? 'Indonesia' : 'Inggris'}</strong>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {source.title}
            </h2>
          </div>

          {/* Access Notice Card */}
          <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <div className="text-slate-300">
              <p className="font-semibold text-slate-200 mb-0.5">Keterangan Akses:</p>
              <p className="text-slate-400 leading-relaxed">
                {source.accessNote || 'Dokumen referensi resmi. Akses bergantung pada lisensi institusi atau open access.'}
              </p>
            </div>
          </div>

          {/* Metadata Table */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-2.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Penulis</span>
              <span className="sm:col-span-2 text-slate-200 font-semibold">{authorNames}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Tahun Publikasi</span>
              <span className="sm:col-span-2 text-slate-200">{source.year || 'Tidak disebutkan'}</span>
            </div>

            {source.publisher && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-medium">Penerbit</span>
                <span className="sm:col-span-2 text-slate-200">{source.publisher}</span>
              </div>
            )}

            {source.journal && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-medium">Nama Jurnal</span>
                <span className="sm:col-span-2 text-blue-300 font-medium">{source.journal}</span>
              </div>
            )}

            {(source.volume || source.issue || source.pages) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-medium">Volume / No / Halaman</span>
                <span className="sm:col-span-2 text-slate-300">
                  Vol. {source.volume || '-'}, No. {source.issue || '-'}, Hal. {source.pages || '-'}
                </span>
              </div>
            )}

            {source.doi && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-medium">DOI</span>
                <div className="sm:col-span-2 flex items-center justify-between">
                  <span className="font-mono text-slate-300 truncate">{source.doi}</span>
                  <button
                    onClick={handleCopyDoi}
                    className="ml-2 text-[11px] text-blue-400 hover:text-blue-300 inline-flex items-center space-x-1"
                  >
                    {copiedDoi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedDoi ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>
            )}

            {source.isbn && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-medium">ISBN</span>
                <span className="sm:col-span-2 font-mono text-slate-300">{source.isbn}</span>
              </div>
            )}

            {source.issn && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-medium">ISSN</span>
                <span className="sm:col-span-2 font-mono text-slate-300">{source.issn}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1">
              <span className="text-slate-400 font-medium">Domain Sumber</span>
              <span className="sm:col-span-2 text-slate-300 font-mono text-[11px]">{source.sourceDomain}</span>
            </div>
          </div>

          {/* Abstract */}
          {source.abstract && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Abstrak / Ringkasan Isi
              </h4>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed max-h-56 overflow-y-auto">
                {source.abstract}
              </div>
            </div>
          )}

          {/* Keywords */}
          {source.keywords && source.keywords.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Kata Kunci / Topik Terkait
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {source.keywords.map((kw, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-300">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick APA Citation Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <Quote className="w-3.5 h-3.5 text-amber-400" />
                <span>Format Sitasi Standar (APA 7)</span>
              </h4>
              <button
                onClick={handleCopyApa}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center space-x-1"
              >
                {copiedApa ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedApa ? 'Tersalin' : 'Salin APA'}</span>
              </button>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 font-serif text-xs text-slate-300 italic select-all">
              {generateAPA7(source)}
            </div>
          </div>

        </div>

        {/* Modal Footer Buttons */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#0e172a] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            {source.pdfUrl && (
              <a
                href={source.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>BUKA PDF</span>
              </a>
            )}

            <a
              href={source.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md"
            >
              <ExternalLink className="w-4 h-4" />
              <span>BUKA SUMBER RESMI</span>
            </a>

            <button
              onClick={() => onOpenCitation(source)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Quote className="w-3.5 h-3.5 text-amber-400" />
              <span>Format Sitasi Lengkap</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSave(source)}
              className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isSaved 
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700' 
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-400" /> : <Bookmark className="w-4 h-4 text-amber-400" />}
              <span>{isSaved ? 'Tersimpan' : '+ Simpan Referensi'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
