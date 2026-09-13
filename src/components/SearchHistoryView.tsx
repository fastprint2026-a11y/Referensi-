import React from 'react';
import { History, Search, Trash2, RotateCcw, Clock } from 'lucide-react';
import { SearchHistoryItem } from '../types';

interface SearchHistoryViewProps {
  history: SearchHistoryItem[];
  onSelectQuery: (query: string, mode: string) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export const SearchHistoryView: React.FC<SearchHistoryViewProps> = ({
  history,
  onSelectQuery,
  onRemoveItem,
  onClearAll,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl bg-[#0b1324] border border-slate-800 p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <History className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Riwayat Pencarian Referensi</h2>
            <p className="text-xs text-slate-400">
              Daftar kata kunci dan topik yang pernah Anda cari sebelumnya
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearAll}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Semua</span>
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="bg-[#0b1324] border border-slate-800 rounded-xl divide-y divide-slate-800/60 overflow-hidden">
          {history.map((item) => (
            <div 
              key={item.id}
              className="p-4 flex items-center justify-between hover:bg-slate-900/50 transition-colors"
            >
              <div className="flex items-center space-x-3 truncate">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="truncate">
                  <span className="font-semibold text-sm text-slate-200 block truncate">
                    {item.query}
                  </span>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="capitalize text-blue-400 font-medium">Mode: {item.mode}</span>
                    <span>•</span>
                    <span>{new Date(item.timestamp).toLocaleString('id-ID')}</span>
                    {item.resultCount !== undefined && (
                      <>
                        <span>•</span>
                        <span>{item.resultCount} referensi ditemukan</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => onSelectQuery(item.query, item.mode)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Cari Lagi</span>
                </button>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Hapus dari riwayat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#0b1324] border border-slate-800 rounded-xl space-y-3">
          <History className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-300">Belum ada riwayat pencarian</h4>
          <p className="text-xs text-slate-500">
            Kata kunci yang Anda cari akan otomatis tercatat di sini untuk memudahkan pencarian ulang.
          </p>
        </div>
      )}
    </div>
  );
};
