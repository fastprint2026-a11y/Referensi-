import React from 'react';
import { ShieldCheck, Info, CheckCircle2, Lock } from 'lucide-react';

export const ResponsibleSearchNotice: React.FC = () => {
  return (
    <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 text-xs text-slate-300 flex items-start space-x-3">
      <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
      <div className="space-y-1">
        <h4 className="font-bold text-slate-200 text-xs flex items-center space-x-2">
          <span>Integritas Akademik & Tautan Asli (Zero Fake URL Policy)</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-normal">
            Real Data Only
          </span>
        </h4>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          ZAIN.NET hanya menyajikan publikasi ilmiah dengan tautan resmi yang dapat diverifikasi (DOI, OpenAlex, Google Books, arXiv).
          Tombol <strong className="text-emerald-400">"Buka PDF"</strong> hanya muncul jika repositori resmi menyediakan berkas teks lengkap secara legal (Open Access / Lisensi Publik). Jika dilindungi langganan berbayar, gunakan tombol <strong className="text-blue-400">"Sumber Resmi"</strong> atau akses melalui perpustakaan digital kampus Anda.
        </p>
      </div>
    </div>
  );
};
