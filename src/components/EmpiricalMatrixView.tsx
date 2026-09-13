import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Loader2, 
  FileSpreadsheet,
  AlertCircle,
  FileText
} from 'lucide-react';
import { EmpiricalStudyItem } from '../types';
import { getEmpiricalMatrix } from '../services/api';
import { exportMatrixToWord } from '../utils/exportDocx';

export const EmpiricalMatrixView: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [matrix, setMatrix] = useState<EmpiricalStudyItem[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedTable, setCopiedTable] = useState(false);
  const [searchedTopic, setSearchedTopic] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      const res = await getEmpiricalMatrix(topic.trim());
      setMatrix(res.matrix);
      setSearchedTopic(topic.trim());
    } catch (err) {
      console.error('Error generating empirical matrix:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyRow = (item: EmpiricalStudyItem, index: number) => {
    const rowText = `${item.title} | ${item.authors} (${item.year}) | Metode: ${item.methodology} | Variabel: ${item.variables} | Sampel: ${item.sampleOrObject} | Temuan: ${item.mainFindings}`;
    navigator.clipboard.writeText(rowText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyFullTable = () => {
    let tsv = 'No\tJudul & Penulis\tTahun\tMetode\tVariabel\tSampel/Objek\tTemuan Utama\tDOI/Tautan\n';
    matrix.forEach((m, idx) => {
      tsv += `${idx + 1}\t${m.title} (${m.authors})\t${m.year}\t${m.methodology}\t${m.variables}\t${m.sampleOrObject}\t${m.mainFindings}\t${m.doi || m.articleUrl}\n`;
    });
    navigator.clipboard.writeText(tsv);
    setCopiedTable(true);
    setTimeout(() => setCopiedTable(false), 2000);
  };

  const exportCsv = () => {
    const headers = ['No', 'Judul', 'Penulis', 'Tahun', 'Jurnal', 'Metode Penelitian', 'Variabel', 'Sampel/Objek', 'Temuan Utama', 'DOI/Link'];
    const rows = matrix.map((m, idx) => [
      idx + 1,
      `"${(m.title || '').replace(/"/g, '""')}"`,
      `"${(m.authors || '').replace(/"/g, '""')}"`,
      m.year || '',
      `"${(m.journalOrPublisher || '').replace(/"/g, '""')}"`,
      `"${(m.methodology || '').replace(/"/g, '""')}"`,
      `"${(m.variables || '').replace(/"/g, '""')}"`,
      `"${(m.sampleOrObject || '').replace(/"/g, '""')}"`,
      `"${(m.mainFindings || '').replace(/"/g, '""')}"`,
      m.doi || m.articleUrl || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `matrik-penelitian-terdahulu-${searchedTopic.slice(0, 20)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-br from-cyan-950/60 via-[#0b1324] to-slate-900 border border-cyan-500/30 p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Generator Matrik Penelitian Terdahulu</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            🔬 Matrik Penelitian Terdahulu (Tabel Review Empiris)
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Menyusun tabel komparasi penelitian terdahulu secara otomatis dari artikel jurnal ilmiah terverifikasi.
            Mengekstrak judul, penulis, tahun, metode, variabel, sampel, dan temuan utama langsung dari data abstrak asli.
          </p>

          {/* Search Form */}
          <form onSubmit={handleGenerate} className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Topik Penelitian yang Ingin Dibuatkan Matrik:
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Contoh: Digital Banking, Kepuasan Kerja, Stunting Balita, Machine Learning..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                  required
                />
                <Search className="w-5 h-5 text-cyan-400 absolute left-3.5 top-3.5" />
              </div>

              <button
                type="submit"
                disabled={isLoading || !topic.trim()}
                className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs sm:text-sm bg-cyan-600 hover:bg-cyan-500 text-slate-950 transition-all shadow-lg shadow-cyan-600/20 disabled:opacity-50 flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengekstrak Matrik...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Susun Matrik Empiris</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Table Section */}
      {matrix.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Tabel Matrik Penelitian Terdahulu: "{searchedTopic}"
              </h3>
              <p className="text-xs text-slate-400">
                {matrix.length} artikel ilmiah empiris dengan informasi metode & temuan terverifikasi
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={copyFullTable}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                {copiedTable ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTable ? 'Tabel Tersalin' : 'Salin Tabel (Word)'}</span>
              </button>

              <button
                onClick={() => exportMatrixToWord(matrix, searchedTopic)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/90 hover:bg-blue-500 text-white transition-colors shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ekspor Word (.docx)</span>
              </button>

              <button
                onClick={exportCsv}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-slate-950 transition-colors shadow-sm"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Ekspor CSV / Excel</span>
              </button>
            </div>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0b1324] shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-slate-300 font-semibold border-b border-slate-800">
                  <th className="p-3 w-10 text-center">No</th>
                  <th className="p-3 min-w-[220px]">Judul & Penulis (Tahun)</th>
                  <th className="p-3 min-w-[140px]">Metodologi</th>
                  <th className="p-3 min-w-[160px]">Variabel Diteliti</th>
                  <th className="p-3 min-w-[140px]">Sampel / Objek</th>
                  <th className="p-3 min-w-[240px]">Temuan Utama</th>
                  <th className="p-3 w-28 text-center">Akses & Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {matrix.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 text-center font-mono text-slate-500 font-bold">
                      {idx + 1}
                    </td>
                    <td className="p-3 space-y-1">
                      <p className="font-bold text-slate-100 leading-snug">{item.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {item.authors} ({item.year || 't.t.'})
                      </p>
                      {item.journalOrPublisher && (
                        <p className="text-[10px] text-cyan-400 truncate max-w-xs">
                          {item.journalOrPublisher}
                        </p>
                      )}
                    </td>
                    <td className="p-3 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 block mb-1">
                        {item.methodology}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] leading-relaxed">
                      {item.variables}
                    </td>
                    <td className="p-3 text-[11px] text-slate-300">
                      {item.sampleOrObject}
                    </td>
                    <td className="p-3 text-[11px] text-slate-300 leading-relaxed">
                      {item.mainFindings}
                    </td>
                    <td className="p-3 text-center space-y-1">
                      {item.pdfUrl ? (
                        <a
                          href={item.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center space-x-1 px-2 py-1 rounded bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 text-[10px] font-bold"
                        >
                          <span>PDF</span>
                        </a>
                      ) : (
                        <a
                          href={item.articleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center space-x-1 px-2 py-1 rounded bg-slate-800 text-blue-400 hover:text-blue-300 text-[10px] font-medium"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Sumber</span>
                        </a>
                      )}

                      <button
                        onClick={() => copyRow(item, idx)}
                        className="w-full inline-flex items-center justify-center space-x-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] transition-colors"
                        title="Salin ringkasan baris ini"
                      >
                        {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIndex === idx ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
