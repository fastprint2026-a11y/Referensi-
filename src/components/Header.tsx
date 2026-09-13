import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  GraduationCap, 
  Layers, 
  Bookmark, 
  History, 
  FileText,
  Search,
  ShieldCheck,
  Calculator,
  SpellCheck
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedCount: number;
  onQuickSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onQuickSearchClick
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand & Logo */}
          <div 
            onClick={() => setActiveTab('beranda')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-amber-500 p-[1.5px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0b1120] rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 group-hover:scale-105 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Cinzel',serif]">
                  ZAIN<span className="text-blue-400">.NET</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  PREMIUM AKADEMIK
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 tracking-wide hidden sm:block">
                Pusat Modul & Referensi Ilmiah Mahasiswa
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('beranda')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-1.5 ${
                activeTab === 'beranda'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Beranda</span>
            </button>

            <button
              onClick={() => setActiveTab('sintesis')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-1.5 ${
                activeTab === 'sintesis'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Sintesis Bab II</span>
            </button>

            <button
              onClick={() => setActiveTab('metodologi')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-1.5 ${
                activeTab === 'metodologi'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Metodologi Bab III</span>
            </button>

            <button
              onClick={() => setActiveTab('parafrase')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-1.5 ${
                activeTab === 'parafrase'
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <SpellCheck className="w-4 h-4 text-violet-400" />
              <span>Parafrase</span>
            </button>

            <button
              onClick={() => setActiveTab('empiris')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-1.5 ${
                activeTab === 'empiris'
                  ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Matrik Empiris</span>
            </button>

            <button
              onClick={() => setActiveTab('skripsi')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-1.5 ${
                activeTab === 'skripsi'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>Referensi Skripsi</span>
            </button>

            <button
              onClick={() => setActiveTab('judul')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-1.5 ${
                activeTab === 'judul'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Bedah Judul</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`relative px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-1.5 ${
                activeTab === 'saved'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Bookmark className="w-4 h-4 text-emerald-400" />
              <span>Referensi Saya</span>
              {savedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('riwayat')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-1.5 ${
                activeTab === 'riwayat'
                  ? 'bg-slate-700/60 text-white border border-slate-600 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Riwayat</span>
            </button>
          </nav>

          {/* Quick status pill & Verified badge */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Data Asli & Valid</span>
            </div>

            {/* Mobile Saved Button */}
            <button
              onClick={() => setActiveTab('saved')}
              className="lg:hidden relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
              title="Referensi Tersimpan"
            >
              <Bookmark className="w-5 h-5 text-emerald-400" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500 text-slate-950">
                  {savedCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center space-x-1 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-800/50">
          <button
            onClick={() => setActiveTab('beranda')}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
              activeTab === 'beranda' ? 'bg-blue-600 text-white' : 'text-slate-400 bg-slate-900/60'
            }`}
          >
            🔍 Beranda
          </button>
          <button
            onClick={() => setActiveTab('sintesis')}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
              activeTab === 'sintesis' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900/60'
            }`}
          >
            📚 Sintesis Bab II
          </button>
          <button
            onClick={() => setActiveTab('metodologi')}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
              activeTab === 'metodologi' ? 'bg-emerald-600 text-white' : 'text-slate-400 bg-slate-900/60'
            }`}
          >
            📊 Metodologi Bab III
          </button>
          <button
            onClick={() => setActiveTab('parafrase')}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
              activeTab === 'parafrase' ? 'bg-violet-600 text-white' : 'text-slate-400 bg-slate-900/60'
            }`}
          >
            ✍️ Parafrase
          </button>
          <button
            onClick={() => setActiveTab('empiris')}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
              activeTab === 'empiris' ? 'bg-cyan-600 text-white' : 'text-slate-400 bg-slate-900/60'
            }`}
          >
            🔬 Matrik Empiris
          </button>
          <button
            onClick={() => setActiveTab('skripsi')}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
              activeTab === 'skripsi' ? 'bg-blue-600 text-white' : 'text-slate-400 bg-slate-900/60'
            }`}
          >
            🎓 Referensi Skripsi
          </button>
          <button
            onClick={() => setActiveTab('judul')}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
              activeTab === 'judul' ? 'bg-purple-600 text-white' : 'text-slate-400 bg-slate-900/60'
            }`}
          >
            🧠 Bedah Judul
          </button>
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
              activeTab === 'riwayat' ? 'bg-slate-700 text-white' : 'text-slate-400 bg-slate-900/60'
            }`}
          >
            🕘 Riwayat
          </button>
        </div>

      </div>
    </header>
  );
};
