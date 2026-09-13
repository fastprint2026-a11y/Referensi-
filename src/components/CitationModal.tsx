import React, { useState } from 'react';
import { X, Copy, Check, Download, Quote, FileCode } from 'lucide-react';
import { AcademicSource } from '../types';
import { 
  generateAPA7, 
  generateMLA, 
  generateIEEE, 
  generateHarvard, 
  generateChicago, 
  generateVancouver, 
  generateBibTeX, 
  generateRIS 
} from '../utils/citation';

interface CitationModalProps {
  source: AcademicSource | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CitationModal: React.FC<CitationModalProps> = ({ source, isOpen, onClose }) => {
  const [activeFormat, setActiveFormat] = useState<'APA' | 'IEEE' | 'MLA' | 'Harvard' | 'Chicago' | 'Vancouver' | 'BibTeX' | 'RIS'>('APA');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !source) return null;

  const getCitationText = () => {
    switch (activeFormat) {
      case 'APA': return generateAPA7(source);
      case 'MLA': return generateMLA(source);
      case 'IEEE': return generateIEEE(source);
      case 'Harvard': return generateHarvard(source);
      case 'Chicago': return generateChicago(source);
      case 'Vancouver': return generateVancouver(source);
      case 'BibTeX': return generateBibTeX(source);
      case 'RIS': return generateRIS(source);
      default: return generateAPA7(source);
    }
  };

  const currentText = getCitationText();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const ext = activeFormat === 'BibTeX' ? 'bib' : (activeFormat === 'RIS' ? 'ris' : 'txt');
    const blob = new Blob([currentText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sitasi-${activeFormat.toLowerCase()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-[#0b1324] border border-slate-700/80 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0e172a]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Quote className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Generator Sitasi Akademik</h3>
              <p className="text-[11px] text-slate-400 truncate max-w-sm">{source.title}</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formats Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-800/80 overflow-x-auto scrollbar-none flex space-x-1.5">
          {(['APA', 'IEEE', 'MLA', 'Harvard', 'Chicago', 'Vancouver', 'BibTeX', 'RIS'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => {
                setActiveFormat(fmt);
                setCopied(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeFormat === fmt
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {fmt === 'APA' ? 'APA 7' : fmt}
            </button>
          ))}
        </div>

        {/* Citation Box */}
        <div className="p-6 space-y-4">
          <div className="relative">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm font-serif leading-relaxed select-all max-h-56 overflow-y-auto whitespace-pre-wrap">
              {currentText}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            *Sitasi dihasilkan berdasarkan metadata resmi yang tersedia. Selalu periksa kembali sesuai pedoman penulisan skripsi institusi Anda.
          </p>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#0e172a] flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Format: <span className="text-amber-400 font-semibold">{activeFormat}</span>
          </div>

          <div className="flex items-center space-x-2">
            {(activeFormat === 'BibTeX' || activeFormat === 'RIS') && (
              <button
                onClick={handleDownloadFile}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                copied 
                  ? 'bg-emerald-500 text-slate-950' 
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin!' : 'Salin Sitasi'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
