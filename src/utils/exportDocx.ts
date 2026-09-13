import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle, 
  AlignmentType 
} from 'docx';
import { AcademicSource, EmpiricalStudyItem, LiteratureSynthesis, MethodologyGuide } from '../types';

// Helper to trigger browser download of a Blob
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 1. Export Empirical Research Matrix to Word (.docx)
export async function exportMatrixToWord(matrix: EmpiricalStudyItem[], topic: string) {
  const tableRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({ width: { size: 6, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'No', bold: true })] })] }),
        new TableCell({ width: { size: 24, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'Peneliti & Judul', bold: true })] })] }),
        new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'Variabel Penelitian', bold: true })] })] }),
        new TableCell({ width: { size: 22, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'Metodologi & Sampel', bold: true })] })] }),
        new TableCell({ width: { size: 28, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'Hasil Utama & Temuan', bold: true })] })] }),
      ],
    }),
  ];

  matrix.forEach((item, idx) => {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(String(idx + 1))] }),
          new TableCell({
            children: [
              new Paragraph({ children: [new TextRun({ text: `${item.authors} (${item.year})`, bold: true })] }),
              new Paragraph({ children: [new TextRun({ text: item.title, italics: true })] }),
              new Paragraph({ children: [new TextRun({ text: item.journalOrPublisher || '', size: 18, color: '666666' })] }),
            ],
          }),
          new TableCell({ children: [new Paragraph(item.variables)] }),
          new TableCell({
            children: [
              new Paragraph({ children: [new TextRun({ text: `Metode: ${item.methodology}` })] }),
              new Paragraph({ children: [new TextRun({ text: `Sampel/Objek: ${item.sampleOrObject}` })] }),
            ],
          }),
          new TableCell({ children: [new Paragraph(item.mainFindings)] }),
        ],
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'MATRIK PENELITIAN EMPIRIS TERDAHULU (BAB II)',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Topik Kajian: ${topic}`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Diekspor otomatis oleh ZAIN.NET Research Assistant pada ${new Date().toLocaleDateString('id-ID')}`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '' }),
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `Matrik_Penelitian_Terdahulu_${topic.slice(0, 20).replace(/\s+/g, '_')}.docx`);
}

// 2. Export Literature Synthesis (Bab II) to Word (.docx)
export async function exportSynthesisToWord(synthesis: LiteratureSynthesis) {
  const comparisonRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'Peneliti & Tahun', bold: true })] })] }),
        new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'Fokus Kajian', bold: true })] })] }),
        new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'Metodologi', bold: true })] })] }),
        new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'Persamaan', bold: true })] })] }),
        new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'Perbedaan / Gap', bold: true })] })] }),
      ],
    }),
  ];

  synthesis.comparisonPoints.forEach(p => {
    comparisonRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: p.authorYear, bold: true })] })] }),
          new TableCell({ children: [new Paragraph(p.focus)] }),
          new TableCell({ children: [new Paragraph(p.method)] }),
          new TableCell({ children: [new Paragraph(p.similarity)] }),
          new TableCell({ children: [new Paragraph(p.differenceOrGap)] }),
        ],
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'BAB II TINJAUAN PUSTAKA & SINTESIS PENELITIAN',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Fokus Kajian: ${synthesis.topic}`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: '2.1 Narasi Sintesis Teori dan Empiris',
            heading: HeadingLevel.HEADING_2,
          }),
          ...synthesis.narrativeParagraphs.map(p => new Paragraph({
            text: p,
            spacing: { after: 180, line: 360 }, // 1.5 line spacing standard Indonesian thesis
          })),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: '2.2 Tabel Komparasi Penelitian Terdahulu',
            heading: HeadingLevel.HEADING_2,
          }),
          new Table({
            rows: comparisonRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: '2.3 Research Gap (Celah Penelitian)',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: synthesis.researchGapSummary,
            spacing: { after: 180, line: 360 },
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: '2.4 Kesimpulan Teoretis & Kerangka Pemikiran',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: synthesis.theoreticalConclusion,
            spacing: { after: 180, line: 360 },
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: '2.5 Pengembangan Hipotesis Penelitian',
            heading: HeadingLevel.HEADING_2,
          }),
          ...synthesis.suggestedHypotheses.map((h, i) => new Paragraph({
            text: `${i + 1}. ${h}`,
            spacing: { after: 120 },
          })),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Daftar Rujukan Terkait (APA 7th):',
            heading: HeadingLevel.HEADING_3,
          }),
          ...synthesis.inTextCitations.map(cit => new Paragraph({
            text: `• ${cit}`,
            spacing: { after: 80 },
          })),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `Bab_II_Sintesis_${synthesis.topic.slice(0, 20).replace(/\s+/g, '_')}.docx`);
}

// 3. Export Methodology Guide (Bab III) to Word (.docx)
export async function exportMethodologyToWord(guide: MethodologyGuide) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'BAB III METODOLOGI PENELITIAN & RANCANGAN UJI STATISTIK',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Judul Penelitian: "${guide.title}"`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: '3.1 Jenis Penelitian & Rasional Pendekatan',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: guide.researchType,
            children: [new TextRun({ text: `\n${guide.approachRationale}` })],
            spacing: { after: 180, line: 360 },
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: '3.2 Populasi, Sampel, dan Teknik Penarikan Sampel',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ text: `• Populasi Target: ${guide.populationAndSample.targetPopulation}`, spacing: { after: 80 } }),
          new Paragraph({ text: `• Teknik Sampling: ${guide.populationAndSample.samplingTechnique}`, spacing: { after: 80 } }),
          new Paragraph({ text: `• Rumus Penentuan Sampel: ${guide.populationAndSample.sampleFormula}`, spacing: { after: 80 } }),
          new Paragraph({ text: `• Rekomendasi Jumlah Sampel: ${guide.populationAndSample.recommendedSampleSize}`, spacing: { after: 180 } }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: '3.3 Definisi Operasional & Indikator Variabel',
            heading: HeadingLevel.HEADING_2,
          }),
          ...guide.operationalVariables.flatMap(v => [
            new Paragraph({ children: [new TextRun({ text: `${v.variableName} (${v.role})`, bold: true })] }),
            new Paragraph({ text: `Skala Pengukuran: ${v.measurementScale}` }),
            new Paragraph({ text: `Indikator Operasional: ${v.sampleIndicators.join(', ')}`, spacing: { after: 120 } }),
          ]),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: '3.4 Uji Kualitas Instrumen (Validitas & Reliabilitas)',
            heading: HeadingLevel.HEADING_2,
          }),
          ...guide.instrumentTests.flatMap(t => [
            new Paragraph({ children: [new TextRun({ text: `• ${t.testName}`, bold: true })] }),
            new Paragraph({ text: `  Kriteria Kelulusan: ${t.criteria}` }),
            new Paragraph({ text: `  Tindakan/Petunjuk: ${t.guidance}`, spacing: { after: 100 } }),
          ]),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: '3.5 Uji Asumsi Klasik',
            heading: HeadingLevel.HEADING_2,
          }),
          ...guide.classicalAssumptions.flatMap(a => [
            new Paragraph({ children: [new TextRun({ text: `• ${a.testName}`, bold: true })] }),
            new Paragraph({ text: `  Kriteria: ${a.criteria}` }),
            new Paragraph({ text: `  Solusi Jika Tidak Lolos: ${a.solutionIfFailed}`, spacing: { after: 100 } }),
          ]),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: '3.6 Analisis Data & Pengujian Hipotesis',
            heading: HeadingLevel.HEADING_2,
          }),
          ...guide.hypothesisTests.flatMap(h => [
            new Paragraph({ children: [new TextRun({ text: `• ${h.testName} (Alat: ${h.suggestedTool})`, bold: true })] }),
            new Paragraph({ text: `  Kaidah Keputusan: ${h.decisionRule}`, spacing: { after: 100 } }),
          ]),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `Bab_III_Metodologi_${guide.title.slice(0, 20).replace(/\s+/g, '_')}.docx`);
}

// 4. Export Saved Bibliography to Word (.docx) with APA 7th formatting
export async function exportBibliographyToWord(sources: AcademicSource[], title = 'DAFTAR PUSTAKA') {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
    }),
    new Paragraph({
      text: `Dihasilkan oleh ZAIN.NET Research Assistant pada ${new Date().toLocaleDateString('id-ID')}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
    }),
  ];

  // Sort sources alphabetically by primary author last name
  const sorted = [...sources].sort((a, b) => {
    const nameA = a.authors[0]?.name || a.title;
    const nameB = b.authors[0]?.name || b.title;
    return nameA.localeCompare(nameB);
  });

  sorted.forEach(s => {
    const authorsStr = s.authors.map(a => a.name).join(', ') || 'Penulis Tidak Diketahui';
    const yearStr = s.year ? `(${s.year}).` : '(n.d.).';
    const titleStr = s.title ? `${s.title}.` : '';
    const journalStr = s.journal || s.publisher || '';
    const doiOrUrl = s.doi ? `https://doi.org/${s.doi}` : (s.sourceUrl || '');

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${authorsStr} ${yearStr} ` }),
          new TextRun({ text: `${titleStr} `, italics: s.sourceType === 'ebook' }),
          new TextRun({ text: journalStr ? `${journalStr}. ` : '', italics: s.sourceType !== 'ebook' }),
          new TextRun({ text: doiOrUrl, color: '0055AA' }),
        ],
        spacing: { after: 180, line: 360 },
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `Daftar_Pustaka_Skripsi_${new Date().toISOString().slice(0, 10)}.docx`);
}

// 5. Export References to CSV (Excel-ready)
export function exportSourcesToCSV(sources: AcademicSource[], filename = 'daftar_referensi.csv') {
  const headers = ['No', 'Judul', 'Penulis', 'Tahun', 'Jenis', 'Jurnal/Penerbit', 'SINTA/Reputasi', 'DOI', 'Status Akses', 'URL Sumber', 'URL PDF'];
  const rows = sources.map((s, idx) => [
    idx + 1,
    `"${(s.title || '').replace(/"/g, '""')}"`,
    `"${s.authors.map(a => a.name).join('; ').replace(/"/g, '""')}"`,
    s.year,
    s.sourceType,
    `"${(s.journal || s.publisher || '').replace(/"/g, '""')}"`,
    s.sintaRank || '-',
    s.doi || '-',
    s.accessStatus,
    `"${s.sourceUrl || ''}"`,
    `"${s.pdfUrl || ''}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
}
