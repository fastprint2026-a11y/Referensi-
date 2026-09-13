import React from 'react';
import { BookOpen, ShieldCheck, CheckCircle2, Lock, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#050811] text-slate-400 text-xs py-10 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Brand Col */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-lg font-black tracking-tight text-white font-['Cinzel',serif]">
              ZAIN<span className="text-blue-400">.NET</span>
            </span>
          </div>
          
          <p className="text-slate-300 font-semibold text-sm">
            CREATE BY ZAIN.NET — Pusat Modul Akademik Premium
          </p>
          <p className="text-slate-400 max-w-md leading-relaxed text-xs">
            "Mempermudah mahasiswa menemukan sumber referensi akademik yang terpercaya."
          </p>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Platform mesin pencari referensi ilmiah berbasis data nyata (real data only). 
            Mengintegrasikan jutaan publikasi akademik dari OpenAlex, Crossref, Google Books, arXiv, 
            dan direktori jurnal terindeks secara bertanggung jawab.
          </p>
        </div>

        {/* Prinsip Keaslian Data */}
        <div className="space-y-2.5">
          <h4 className="text-slate-200 font-semibold tracking-wider text-xs uppercase flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Standar Integritas</span>
          </h4>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li className="flex items-start space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              <span>100% Real Data & Official DOI</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              <span>Tanpa URL atau PDF Palsu</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              <span>Dukungan Sitasi Standar APA 7, MLA, IEEE</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              <span>Verifikasi Akses Open Access Legal</span>
            </li>
          </ul>
        </div>

        {/* Sumber Terhubung */}
        <div className="space-y-2.5">
          <h4 className="text-slate-200 font-semibold tracking-wider text-xs uppercase flex items-center space-x-1.5">
            <ExternalLink className="w-4 h-4 text-blue-400" />
            <span>Database Terhubung</span>
          </h4>
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            {['OpenAlex', 'Crossref', 'Google Books', 'arXiv', 'DOAJ', 'Perpustakaan Digital'].map((item) => (
              <span key={item} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                {item}
              </span>
            ))}
          </div>
          <div className="pt-2 text-[11px] text-slate-500">
            Akses aman & legal. Mematuhi hak cipta dan lisensi penerbit resmi.
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
        <div>
          &copy; {new Date().getFullYear()} <strong className="text-slate-400">ZAIN.NET</strong> — Pusat Modul Akademik Premium. Seluruh hak cipta dilindungi.
        </div>
        <div className="flex items-center space-x-4">
          <span>Mesin Pencari Ebook, Jurnal & Skripsi</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">Bebas Plagiarisme & Tautan Terverifikasi</span>
        </div>
      </div>
    </footer>
  );
};
