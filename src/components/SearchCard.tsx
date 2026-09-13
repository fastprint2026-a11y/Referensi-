import React from 'react';
import { 
  Book, 
  FileText, 
  GraduationCap, 
  FileCode, 
  Newspaper, 
  Database, 
  ExternalLink, 
  Download, 
  Bookmark, 
  BookmarkCheck, 
  Quote, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  ShieldCheck,
  Building,
  Calendar,
  Globe
} from 'lucide-react';
import { AcademicSource, SourceType } from '../types';

interface SearchCardProps {
  source: AcademicSource;
  isSaved: boolean;
  onSave: (source: AcademicSource) => void;
  onOpenCitation: (source: AcademicSource) => void;
  onOpenDetail: (source: AcademicSource) => void;
}

export const SearchCard: React.FC<SearchCardProps> = ({
  source,
  isSaved,
  onSave,
  onOpenCitation,
  onOpenDetail,
}) => {
  // Source Type Icon and Label
  const getTypeInfo = (type: SourceType) => {
    switch (type) {
      case 'ebook':
        return { icon: <Book className="w-4 h-4 text-amber-400" />, label: 'Ebook / Buku', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' };
      case 'jurnal':
        return { icon: <FileText className="w-4 h-4 text-blue-400" />, label: 'Jurnal Ilmiah', color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' };
      case 'skripsi':
      case 'tesis':
      case 'disertasi':
        return { icon: <GraduationCap className="w-4 h-4 text-purple-400" />, label: 'Karya Ilmiah / Skripsi', color: 'bg-purple-500/10 text-purple-300 border-purple-500/20' };
      case 'prosiding':
        return { icon: <FileCode className="w-4 h-4 text-cyan-400" />, label: 'Prosiding Konferensi', color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' };
      case 'dataset':
        return { icon: <Database className="w-4 h-4 text-emerald-400" />, label: 'Dataset Akademik', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' };
      default:
        return { icon: <Newspaper className="w-4 h-4 text-slate-300" />, label: 'Artikel Ilmiah', color: 'bg-slate-700/30 text-slate-300 border-slate-700' };
    }
  };

  const typeInfo = getTypeInfo(source.sourceType);
  const authorNames = source.authors && source.authors.length > 0 
    ? source.authors.map(a => a.name).join(', ') 
    : (source.publisher || 'Penulis Tidak Disebutkan');

  const relevancePct = source.relevanceScore || 88;

  return (
    <div 
      className="group relative rounded-xl bg-[#0b1324]/80 border border-slate-800/90 hover:border-blue-500/50 transition-all duration-200 p-5 sm:p-6 shadow-md hover:shadow-xl hover:shadow-blue-950/20 flex flex-col justify-between"
    >
      <div>
        {/* Top Badges & Type */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${typeInfo.color}`}>
              {typeInfo.icon}
              <span>{typeInfo.label}</span>
            </span>

            <span className="inline-flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              <Globe className="w-3 h-3 text-slate-400" />
              <span>{source.language === 'id' ? 'Bahasa Indonesia' : 'English'}</span>
            </span>

            {/* Database Source Badge */}
            {source.databaseSource && (
              <span className={`inline-flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${
                source.databaseSource === 'DOAB' || source.databaseSource === 'OAPEN'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : source.databaseSource === 'DOAJ'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : source.databaseSource === 'Repository Kampus'
                  ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                  : source.databaseSource === 'Internet Archive' || source.databaseSource === 'Open Library' || source.databaseSource === 'Project Gutenberg'
                  ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700'
              }`}>
                <span>{source.databaseSource}</span>
              </span>
            )}

            {/* Islamic Reference Label */}
            {source.isIslamicReference && (
              <span className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-600/40">
                <span>🕌 Referensi Keislaman</span>
              </span>
            )}
          </div>

          {/* Access Status Badge */}
          <div>
            {source.accessStatus === 'pdf_available' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>PDF TERSEDIA</span>
              </span>
            )}
            {source.accessStatus === 'open_access' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                <span>OPEN ACCESS</span>
              </span>
            )}
            {source.accessStatus === 'preview_only' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <span>PREVIEW TERSEDIA</span>
              </span>
            )}
            {source.accessStatus === 'paywalled' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                <span>AKSES PENERBIT</span>
              </span>
            )}

            {/* SINTA & International Reputation Badge */}
            {source.sintaRank && (
              <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-xs ${
                source.sintaRank === 'SINTA 1' || source.sintaRank === 'SINTA 2' 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : source.sintaRank === 'Scopus' 
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                  : source.sintaRank === 'DOAJ'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
              }`}>
                <span>★ {source.sintaRank}</span>
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onOpenDetail(source)}
          className="text-base sm:text-lg font-bold text-slate-100 hover:text-blue-300 cursor-pointer transition-colors leading-snug line-clamp-2 mb-2"
        >
          {source.title}
        </h3>

        {/* Metadata grid */}
        <div className="text-xs text-slate-300 space-y-1 mb-3">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <span className="text-slate-500">Penulis:</span>
            <span className="font-medium text-slate-200 truncate max-w-sm" title={authorNames}>
              {authorNames}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-[11px]">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Tahun: <strong className="text-slate-300">{source.year || 't.t.'}</strong></span>
            </div>

            {(source.journal || source.publisher) && (
              <div className="flex items-center space-x-1 truncate max-w-xs">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">
                  {source.journal ? `Jurnal: ${source.journal}` : `Penerbit: ${source.publisher}`}
                </span>
              </div>
            )}
          </div>

          {(source.volume || source.issue || source.pages) && (
            <div className="text-[11px] text-slate-400">
              {source.volume && <span>Vol. {source.volume}</span>}
              {source.issue && <span>, No. {source.issue}</span>}
              {source.pages && <span>, Hal. {source.pages}</span>}
            </div>
          )}
        </div>

        {/* Relevansi Bar & Suitable Chapters */}
        <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800/80 mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px] flex items-center space-x-1">
              <span>Relevansi:</span>
              <span className="text-blue-400 font-semibold">{source.relevanceLabel}</span>
            </span>
            <span className="font-mono text-xs font-bold text-slate-200">{relevancePct}%</span>
          </div>
          
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${relevancePct}%` }}
            />
          </div>

          {source.suitableForChapters && source.suitableForChapters.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500">Cocok untuk:</span>
              {source.suitableForChapters.map((c, i) => (
                <span key={i} className="inline-flex items-center space-x-0.5 text-[10px] font-medium px-1.5 py-0.2 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                  <CheckCircle className="w-2.5 h-2.5 text-indigo-400" />
                  <span>{c}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Abstract snippet if available */}
        {source.abstract && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed italic">
            "{source.abstract}"
          </p>
        )}

        {/* Identifiers (DOI / ISBN) */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mb-4">
          {source.doi && (
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-300">
              DOI: {source.doi.replace(/^https?:\/\/doi\.org\//, '')}
            </span>
          )}
          {source.isbn && (
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-300">
              ISBN: {source.isbn}
            </span>
          )}
          <span className="text-slate-500 text-[10px]">
            Sumber: <strong className="text-slate-400">{source.sourceDomain}</strong>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          {/* VERIFIED PDF BUTTON */}
          {source.pdfUrl ? (
            <a
              href={source.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-all shadow-sm"
              title="Buka PDF resmi di tab baru"
            >
              <Download className="w-3.5 h-3.5" />
              <span>BUKA PDF</span>
            </a>
          ) : (
            <a
              href={source.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700"
              title={`Buka situs resmi di ${source.sourceDomain}`}
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span>SUMBER RESMI</span>
            </a>
          )}

          {/* Quick Citation Button */}
          <button
            onClick={() => onOpenCitation(source)}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
            title="Salin Sitasi APA/IEEE/MLA"
          >
            <Quote className="w-3.5 h-3.5 text-amber-400" />
            <span>Sitasi</span>
          </button>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Detail modal button */}
          <button
            onClick={() => onOpenDetail(source)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Lihat Rincian Sumber"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => onSave(source)}
            className={`p-1.5 rounded-lg transition-colors ${
              isSaved 
                ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/60' 
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800 border border-transparent'
            }`}
            title={isSaved ? 'Tersimpan di Referensi Saya' : 'Simpan Referensi'}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
