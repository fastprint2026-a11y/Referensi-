import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  FileText, 
  BarChart3, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { MethodologyGuide } from '../types';
import { exportMethodologyToWord } from '../utils/exportDocx';

interface MethodologyGuideViewProps {
  currentTitle?: string;
  detectedVariables?: { X?: string[]; Y?: string[]; Z?: string[] };
}

export const MethodologyGuideView: React.FC<MethodologyGuideViewProps> = ({
  currentTitle = '',
  detectedVariables,
}) => {
  const [title, setTitle] = useState(currentTitle || 'Pengaruh Kepemimpinan Transformasional dan Budaya Kerja terhadap Kinerja Pegawai');
  const [varX, setVarX] = useState(detectedVariables?.X?.join(', ') || 'Kepemimpinan Transformasional, Budaya Kerja');
  const [varY, setVarY] = useState(detectedVariables?.Y?.join(', ') || 'Kinerja Pegawai');
  const [varZ, setVarZ] = useState(detectedVariables?.Z?.join(', ') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [guide, setGuide] = useState<MethodologyGuide | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      const payload = {
        title: title.trim(),
        variables: {
          X: varX.split(',').map(s => s.trim()).filter(Boolean),
          Y: varY.split(',').map(s => s.trim()).filter(Boolean),
          Z: varZ ? varZ.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        },
      };
      const res = await fetch('/api/methodology-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.guide) {
        setGuide(data.guide);
      }
    } catch (err) {
      console.error('Error generating methodology guide:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyGuide = () => {
    if (!guide) return;
    const text = `BAB III METODOLOGI PENELITIAN & RANCANGAN UJI STATISTIK\nJudul: "${guide.title}"\n\n` +
      `3.1 Jenis & Pendekatan: ${guide.researchType}\n${guide.approachRationale}\n\n` +
      `3.2 Populasi & Sampel:\n` +
      `- Populasi: ${guide.populationAndSample.targetPopulation}\n` +
      `- Teknik: ${guide.populationAndSample.samplingTechnique}\n` +
      `- Rumus: ${guide.populationAndSample.sampleFormula}\n` +
      `- Rekomendasi Ukuran: ${guide.populationAndSample.recommendedSampleSize}\n\n` +
      `3.3 Indikator Operasional Variabel:\n` +
      guide.operationalVariables.map(v => `- ${v.variableName} (${v.role}): ${v.sampleIndicators.join(', ')} [${v.measurementScale}]`).join('\n') +
      `\n\n3.4 Uji Asumsi Klasik:\n` +
      guide.classicalAssumptions.map(a => `- ${a.testName}: Kriteria (${a.criteria}), Solusi (${a.solutionIfFailed})`).join('\n') +
      `\n\n3.5 Pengujian Hipotesis:\n` +
      guide.hypothesisTests.map(h => `- ${h.testName} [${h.suggestedTool}]: ${h.decisionRule}`).join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative rounded-2xl bg-gradient-to-br from-emerald-950/70 via-[#0b1324] to-slate-900 border border-emerald-500/30 p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>Bab III Metodologi & Rancangan Uji Statistik</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            📊 Panduan Metodologi & Uji Statistik (Bab III)
          </h2>

          <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
            Menentukan jenis penelitian, teknik sampling (rumus Slovin/Roscoe), definisi operasional variabel, 
            kriteria kelulusan uji instrumen (validitas & reliabilitas), uji asumsi klasik serta solusi jika tidak lolos, 
            hingga kaidah uji hipotesis (t-hitung, F-hitung, SmartPLS/SPSS).
          </p>

          <form onSubmit={handleGenerate} className="pt-2 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Judul Skripsi / Tesis:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul skripsi lengkap..."
                className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Variabel Independen (X):
                </label>
                <input
                  type="text"
                  value={varX}
                  onChange={(e) => setVarX(e.target.value)}
                  placeholder="Misal: Kepemimpinan, Motivasi"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Variabel Dependen (Y):
                </label>
                <input
                  type="text"
                  value={varY}
                  onChange={(e) => setVarY(e.target.value)}
                  placeholder="Misal: Kinerja Karyawan"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Variabel Moderasi/Mediasi (Z) (Opsional):
                </label>
                <input
                  type="text"
                  value={varZ}
                  onChange={(e) => setVarZ(e.target.value)}
                  placeholder="Misal: Kepuasan Kerja"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !title.trim()}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-slate-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/30"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menganalisis Metodologi Bab III...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Rancang Metodologi & Uji Statistik Bab III</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Guide Result */}
      {guide && (
        <div className="space-y-6">
          {/* Header Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Rancangan Metodologi Penelitian & Uji Statistik</span>
              </h3>
              <p className="text-xs text-slate-400">
                Judul: "{guide.title}"
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={copyGuide}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin Semua'}</span>
              </button>

              <button
                onClick={() => exportMethodologyToWord(guide)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ekspor Word (.docx)</span>
              </button>
            </div>
          </div>

          {/* 1. Research Approach & Rationale */}
          <div className="rounded-xl border border-slate-800 bg-[#0b1324] p-6 shadow-xl space-y-3">
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wide flex items-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>3.1 Jenis & Desain Penelitian</span>
            </h4>
            <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
              <strong className="text-white text-sm block mb-1">{guide.researchType}</strong>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {guide.approachRationale}
              </p>
            </div>
          </div>

          {/* 2. Population & Sampling Formula */}
          <div className="rounded-xl border border-slate-800 bg-[#0b1324] p-6 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wide flex items-center space-x-2">
              <Cpu className="w-4 h-4" />
              <span>3.2 Populasi, Sampel, & Formula Ukuran Sampel</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Populasi Target:</span>
                <p className="text-xs font-medium text-slate-200">{guide.populationAndSample.targetPopulation}</p>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Teknik Sampling:</span>
                <p className="text-xs font-medium text-slate-200">{guide.populationAndSample.samplingTechnique}</p>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Rumus Penentuan:</span>
                <p className="text-xs font-medium text-cyan-300">{guide.populationAndSample.sampleFormula}</p>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Ukuran Sampel Disarankan:</span>
                <p className="text-xs font-bold text-emerald-400">{guide.populationAndSample.recommendedSampleSize}</p>
              </div>
            </div>
          </div>

          {/* 3. Operational Variables & Indicators */}
          <div className="rounded-xl border border-slate-800 bg-[#0b1324] p-6 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wide flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>3.3 Definisi Operasional & Indikator Variabel</span>
            </h4>
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-300 font-semibold border-b border-slate-800">
                    <th className="p-3">Nama Variabel</th>
                    <th className="p-3">Peran Variabel</th>
                    <th className="p-3">Skala Pengukuran</th>
                    <th className="p-3 min-w-[200px]">Indikator Operasional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {guide.operationalVariables.map((v, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="p-3 font-semibold text-white">{v.variableName}</td>
                      <td className="p-3 text-slate-300">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-medium">
                          {v.role}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{v.measurementScale}</td>
                      <td className="p-3 text-slate-200">
                        <div className="flex flex-wrap gap-1">
                          {v.sampleIndicators.map((ind, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-blue-950/40 text-blue-300 border border-blue-500/30 text-[11px]">
                              {ind}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Instrument & Classical Assumptions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Instrument Tests */}
            <div className="rounded-xl border border-slate-800 bg-[#0b1324] p-6 shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wide flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>3.4 Uji Kualitas Instrumen (Kuesioner)</span>
              </h4>
              <div className="space-y-3">
                {guide.instrumentTests.map((t, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="text-xs font-bold text-amber-300">{t.testName}</span>
                    <div className="text-[11px] text-slate-300">
                      <strong className="text-slate-400">Kriteria:</strong> {t.criteria}
                    </div>
                    <div className="text-[11px] text-slate-400 italic">
                      <strong className="text-slate-500">Petunjuk:</strong> {t.guidance}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Classical Assumptions */}
            <div className="rounded-xl border border-slate-800 bg-[#0b1324] p-6 shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-rose-300 uppercase tracking-wide flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>3.5 Uji Asumsi Klasik & Solusi Penyelamatan</span>
              </h4>
              <div className="space-y-3">
                {guide.classicalAssumptions.map((a, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="text-xs font-bold text-slate-200">{a.testName}</span>
                    <div className="text-[11px] text-slate-300">
                      <strong className="text-slate-400">Kriteria:</strong> {a.criteria}
                    </div>
                    <div className="text-[11px] text-rose-300/90 bg-rose-950/20 p-1.5 rounded border border-rose-500/20">
                      <strong>Jika Gagal:</strong> {a.solutionIfFailed}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Hypothesis Testing */}
          <div className="rounded-xl border border-slate-800 bg-[#0b1324] p-6 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wide flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>3.6 Analisis Data & Kaidah Keputusan Uji Hipotesis</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {guide.hypothesisTests.map((h, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-purple-950/20 border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300">{h.testName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 font-semibold">
                      {h.suggestedTool}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {h.decisionRule}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
