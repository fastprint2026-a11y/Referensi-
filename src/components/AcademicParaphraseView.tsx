import React, { useState } from 'react';
import { 
  SpellCheck, 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  ShieldCheck, 
  RefreshCw, 
  BookOpen, 
  ArrowRight,
  Quote,
  CheckCircle2
} from 'lucide-react';
import { AcademicParaphraseResult, AcademicSource } from '../types';

interface AcademicParaphraseViewProps {
  initialText?: string;
  initialSource?: string;
  availableSources?: AcademicSource[];
}

export const AcademicParaphraseView: React.FC<AcademicParaphraseViewProps> = ({
  initialText = '',
  initialSource = '',
  availableSources = [],
}) => {
  const [text, setText] = useState(initialText);
  const [authorSource, setAuthorSource] = useState(initialSource);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AcademicParaphraseResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const sampleTexts = [
    {
      label: 'Contoh Teori Manajemen',
      text: 'Kompensasi finansial dan lingkungan kerja yang kondusif memiliki dampak signifikan terhadap produktivitas kerja pegawai di instansi pemerintahan.',
      author: 'Hasibuan (2020)',
    },
    {
      label: 'Contoh Metodologi',
      text: 'Penelitian ini menggunakan pendekatan kuantitatif dengan menyebarkan kuesioner kepada 120 responden yang dipilih menggunakan teknik purposive sampling.',
      author: 'Sugiyono (2021)',
    },
    {
      label: 'Contoh Analisis Data',
      text: 'Berdasarkan hasil uji t parsial, diperoleh nilai signifikansi sebesar 0.002 yang lebih kecil dari 0.05, sehingga hipotesis pertama dapat diterima.',
      author: 'Ghozali (2021)',
    }
  ];

  const handleParaphrase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), authorSource: authorSource.trim() || undefined }),
      });
      const data = await res.json();
      if (data.success && data.paraphrase) {
        setResult(data.paraphrase);
      }
    } catch (err) {
      console.error('Error paraphrasing text:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyResult = (paraphrasedText: string, index: number) => {
    navigator.clipboard.writeText(paraphrasedText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative rounded-2xl bg-gradient-to-br from-violet-950/70 via-[#0b1324] to-slate-900 border border-violet-500/30 p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-2 text-violet-400 font-bold text-xs uppercase tracking-wider">
            <SpellCheck className="w-4 h-4" />
            <span>Parafrase Akademik Anti-Plagiasi</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ✍️ Parafrase Akademik Bebas Plagiasi (Turnitin-Safe)
          </h2>

          <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
            Menulis ulang kutipan literatur dan ringkasan teori menjadi kalimat baku akademik tingkat tinggi. 
            Mengubah struktur kalimat dan leksikon ke istilah KBBI ilmiah guna meminimalkan indeks kesamaan (Turnitin similarity &lt; 10%) tanpa mengaburkan esensi fakta penelitian.
          </p>

          {/* Quick Presets */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Coba contoh teks:</span>
            {sampleTexts.map((st, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setText(st.text);
                  setAuthorSource(st.author);
                }}
                className="text-xs px-2.5 py-1 rounded-md bg-violet-950/40 hover:bg-violet-900/50 text-violet-300 border border-violet-500/30 transition-colors"
              >
                {st.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleParaphrase} className="pt-2 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Teks Asli yang Ingin Diparafrasekan (Kutipan / Paragraf / Abstrak):
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                placeholder="Tempel kalimat atau kutipan jurnal di sini untuk diubah susunan tata bahasanya..."
                className="w-full bg-slate-900/90 border border-slate-700 focus:border-violet-500 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-violet-500 font-sans"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="w-full sm:w-1/2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Penulis & Tahun Sumber (Opsional):
                </label>
                <input
                  type="text"
                  value={authorSource}
                  onChange={(e) => setAuthorSource(e.target.value)}
                  placeholder="Misal: Raharjo & Santoso (2023)"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-violet-500 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden"
                />
              </div>

              <div className="w-full sm:w-auto self-end pt-2 sm:pt-0">
                <button
                  type="submit"
                  disabled={isLoading || !text.trim()}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-600/30"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memproses Parafrase Ilmiah...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Parafrase Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Paraphrase Results */}
      {result && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>3 Variasi Parafrase Akademik</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Turnitin-Safe
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Pilih gaya penulisan yang paling selaras dengan gaya penulisan skripsi Anda
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {result.options.map((opt, idx) => (
              <div 
                key={idx}
                className="rounded-xl border border-slate-800 bg-[#0b1324] p-5 shadow-xl hover:border-violet-500/50 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-violet-950/60 text-violet-300 border border-violet-500/30">
                      Gaya {idx + 1}: {opt.style}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30 flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Turnitin Risk: {opt.turnitinRiskLevel}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => copyResult(opt.text, idx)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === idx ? 'Tersalin' : 'Salin Kalimat'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800/80">
                  <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-serif">
                    "{opt.text}"
                  </p>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <div>
                    <strong className="text-slate-300">Struktur yang diubah:</strong> {opt.keyChanges}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Academic vocabulary and in-text citation example */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <span className="text-xs font-bold text-violet-300">Kosakata Akademik Pengganti yang Diterapkan:</span>
              <div className="flex flex-wrap gap-1.5">
                {result.academicVocabularyUsed.map((v, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded bg-violet-950/50 text-violet-300 border border-violet-500/30">
                    {v}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <span className="text-xs font-bold text-emerald-300">Contoh In-Text Citation (APA 7th):</span>
              <p className="text-xs text-slate-200 font-mono bg-slate-950 p-2 rounded border border-slate-800">
                {result.inTextCitationExample}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
