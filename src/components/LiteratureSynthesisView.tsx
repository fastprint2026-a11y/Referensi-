import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  FileText, 
  Table, 
  Lightbulb, 
  GitCompare, 
  HelpCircle,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { AcademicSource, LiteratureSynthesis } from '../types';
import { exportSynthesisToWord } from '../utils/exportDocx';

interface LiteratureSynthesisViewProps {
  availableSources: AcademicSource[];
  savedSources: AcademicSource[];
  currentQuery?: string;
}

export const LiteratureSynthesisView: React.FC<LiteratureSynthesisViewProps> = ({
  availableSources,
  savedSources,
  currentQuery = '',
}) => {
  const [topic, setTopic] = useState(currentQuery || 'Kajian Teori dan Empiris Skripsi');
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [synthesis, setSynthesis] = useState<LiteratureSynthesis | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Pool of sources: saved first, then search results
  const allCandidateSources = React.useMemo(() => {
    const map = new Map<string, AcademicSource>();
    savedSources.forEach(s => map.set(s.id, s));
    availableSources.forEach(s => {
      if (!map.has(s.id)) map.set(s.id, s);
    });
    return Array.from(map.values());
  }, [availableSources, savedSources]);

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedSourceIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAllCandidates = () => {
    if (selectedSourceIds.length === allCandidateSources.length) {
      setSelectedSourceIds([]);
    } else {
      setSelectedSourceIds(allCandidateSources.map(s => s.id));
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    // Filter chosen sources, or fallback to first 5 candidate sources
    let chosen = allCandidateSources.filter(s => selectedSourceIds.includes(s.id));
    if (chosen.length === 0) {
      chosen = allCandidateSources.slice(0, 6);
    }

    if (chosen.length === 0) {
      // Mock minimal academic source context for topic if none searched yet
      chosen = [
        {
          id: 'ref-1',
          title: `Kajian Teoretis dan Empiris Mengenai ${topic}`,
          authors: [{ name: 'Peneliti Utama' }],
          year: '2023',
          sourceType: 'jurnal',
          abstract: `Penelitian ini mengkaji pengaruh dan hubungan variabel kunci dalam konteks ${topic}.`,
          databaseSource: 'OpenAlex',
          sourceDomain: 'jurnal.ac.id',
          accessStatus: 'open_access',
          suitableForChapters: ['BAB II'],
        }
      ];
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/literature-synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources: chosen, topic: topic.trim() }),
      });
      const data = await res.json();
      if (data.success && data.synthesis) {
        setSynthesis(data.synthesis);
      }
    } catch (err) {
      console.error('Error generating literature review synthesis:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const copyFullSynthesis = () => {
    if (!synthesis) return;
    const full = `BAB II TINJAUAN PUSTAKA\nFokus: ${synthesis.topic}\n\n` +
      `2.1 Narasi Sintesis Penelitian Terdahulu:\n` +
      synthesis.narrativeParagraphs.join('\n\n') +
      `\n\n2.2 Celah Penelitian (Research Gap):\n` +
      synthesis.researchGapSummary +
      `\n\n2.3 Kesimpulan Teoretis:\n` +
      synthesis.theoreticalConclusion +
      `\n\n2.4 Usulan Hipotesis:\n` +
      synthesis.suggestedHypotheses.map((h, i) => `${i + 1}. ${h}`).join('\n') +
      `\n\nDaftar In-text Citation:\n` +
      synthesis.inTextCitations.join('; ');
    copyText(full, 'full');
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative rounded-2xl bg-gradient-to-br from-indigo-950/70 via-[#0b1324] to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Bab II Tinjauan Pustaka & Sintesis Otomatis</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            📚 Sintesis Tinjauan Pustaka (Literature Review Bab II)
          </h2>

          <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
            Menghubungkan artikel jurnal dan buku menjadi <strong>narasi ilmiah komprehensif</strong>, 
            membandingkan persamaan & perbedaan temuan antar peneliti, memetakan <em>research gap</em> (celah penelitian), 
            serta merumuskan hipotesis yang siap disisipkan ke dalam Bab II Skripsi Anda.
          </p>

          <form onSubmit={handleGenerate} className="pt-2 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Topik / Variabel Utama Kajian Bab II:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Contoh: Pengaruh Transformasi Digital dan Beban Kerja terhadap Kinerja Karyawan..."
                  className="flex-1 bg-slate-900/90 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={isLoading || !topic.trim()}
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mensintesis...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Sintesis Bab II</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Source selector picker */}
            {allCandidateSources.length > 0 && (
              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold">
                    Pilih Sumber Referensi ({selectedSourceIds.length > 0 ? selectedSourceIds.length : `Semua (${allCandidateSources.length})`}):
                  </span>
                  <button
                    type="button"
                    onClick={selectAllCandidates}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                  >
                    {selectedSourceIds.length === allCandidateSources.length ? 'Batal Pilih' : 'Pilih Semua'}
                  </button>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {allCandidateSources.map(s => {
                    const isChecked = selectedSourceIds.includes(s.id);
                    return (
                      <label 
                        key={s.id} 
                        className={`flex items-start space-x-2 p-1.5 rounded-lg cursor-pointer transition-colors ${
                          isChecked ? 'bg-indigo-950/40 border border-indigo-500/40 text-slate-100' : 'hover:bg-slate-800/50 text-slate-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(s.id)}
                          className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="truncate flex-1">
                          <strong className="text-slate-200">{s.authors[0]?.name || 'Penulis'} ({s.year})</strong>: {s.title}
                        </span>
                        {s.sintaRank && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            {s.sintaRank}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Synthesis Result */}
      {synthesis && (
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Hasil Sintesis Literatur Bab II</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  APA 7th Format
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Topik: "{synthesis.topic}"
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={copyFullSynthesis}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                {copiedSection === 'full' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'full' ? 'Tersalin' : 'Salin Semua'}</span>
              </button>

              <button
                onClick={() => exportSynthesisToWord(synthesis)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ekspor Word (.docx)</span>
              </button>
            </div>
          </div>

          {/* 1. Narrative Review */}
          <div className="rounded-xl border border-slate-800 bg-[#0b1324] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wide flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>2.1 Narasi Sintesis Penelitian Terdahulu (Tinjauan Pustaka)</span>
              </h4>
              <button
                onClick={() => copyText(synthesis.narrativeParagraphs.join('\n\n'), 'narrative')}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1"
              >
                {copiedSection === 'narrative' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Salin Narasi</span>
              </button>
            </div>
            
            <div className="space-y-4 text-sm text-slate-200 leading-relaxed font-serif">
              {synthesis.narrativeParagraphs.map((para, idx) => (
                <p key={idx} className="indent-8 text-justify bg-slate-900/40 p-3 rounded-lg border border-slate-800/60">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* 2. Comparative Matrix Table */}
          <div className="rounded-xl border border-slate-800 bg-[#0b1324] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wide flex items-center space-x-2">
                <Table className="w-4 h-4" />
                <span>2.2 Matrik Komparasi Penelitian Terdahulu</span>
              </h4>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-300 font-semibold border-b border-slate-800">
                    <th className="p-3 min-w-[140px]">Peneliti & Tahun</th>
                    <th className="p-3 min-w-[180px]">Fokus Kajian</th>
                    <th className="p-3 min-w-[120px]">Metode</th>
                    <th className="p-3 min-w-[160px]">Persamaan</th>
                    <th className="p-3 min-w-[160px]">Perbedaan / Gap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {synthesis.comparisonPoints.map((pt, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-semibold text-slate-200">{pt.authorYear}</td>
                      <td className="p-3 text-slate-300">{pt.focus}</td>
                      <td className="p-3 text-slate-400">{pt.method}</td>
                      <td className="p-3 text-slate-300">{pt.similarity}</td>
                      <td className="p-3 text-amber-300/90">{pt.differenceOrGap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Research Gap & Theoretical Framework */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Research Gap */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-5 space-y-3">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                <HelpCircle className="w-4 h-4" />
                <span>2.3 Celah Penelitian (Research Gap)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {synthesis.researchGapSummary}
              </p>
            </div>

            {/* Theoretical Conclusion */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-5 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <Lightbulb className="w-4 h-4" />
                <span>2.4 Kerangka Pemikiran & Usulan Hipotesis</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {synthesis.theoreticalConclusion}
              </p>
              <div className="pt-2 border-t border-emerald-500/20 space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-300">Rekomendasi Rumusan Hipotesis:</span>
                {synthesis.suggestedHypotheses.map((h, i) => (
                  <div key={i} className="text-xs text-slate-200 flex items-start space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* In-Text Citations */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs space-y-2">
            <span className="font-semibold text-slate-400">Sitasi In-Text yang Digunakan (APA 7th):</span>
            <div className="flex flex-wrap gap-2">
              {synthesis.inTextCitations.map((cit, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
                  {cit}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
