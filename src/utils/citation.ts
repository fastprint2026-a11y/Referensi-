import { AcademicSource } from '../types';

export function formatAuthorsAPA(source: AcademicSource): string {
  if (!source.authors || source.authors.length === 0) {
    return source.publisher || 'Anonim';
  }
  if (source.authors.length === 1) {
    return source.authors[0].name;
  }
  if (source.authors.length === 2) {
    return `${source.authors[0].name} & ${source.authors[1].name}`;
  }
  return `${source.authors[0].name}, dkk.`;
}

export function generateAPA7(source: AcademicSource): string {
  const authorStr = formatAuthorsAPA(source);
  const yearStr = source.year ? `(${source.year})` : '(t.t.)';
  const titleStr = source.title ? `${source.title}.` : '';

  if (source.sourceType === 'jurnal' || source.journal) {
    const journalStr = source.journal ? `*${source.journal}*` : '';
    const volStr = source.volume ? `, ${source.volume}` : '';
    const issueStr = source.issue ? `(${source.issue})` : '';
    const pageStr = source.pages ? `, ${source.pages}` : '';
    const doiStr = source.doi ? ` https://doi.org/${source.doi.replace(/^https?:\/\/doi\.org\//, '')}` : (source.sourceUrl ? ` ${source.sourceUrl}` : '');
    return `${authorStr} ${yearStr}. ${titleStr} ${journalStr}${volStr}${issueStr}${pageStr}.${doiStr}`.trim();
  }

  // Ebook / Book
  const publisherStr = source.publisher ? ` ${source.publisher}.` : '';
  const doiOrUrl = source.doi ? ` https://doi.org/${source.doi.replace(/^https?:\/\/doi\.org\//, '')}` : (source.sourceUrl ? ` ${source.sourceUrl}` : '');
  return `${authorStr} ${yearStr}. *${source.title}*.${publisherStr}${doiOrUrl}`.trim();
}

export function generateMLA(source: AcademicSource): string {
  const firstAuthor = source.authors?.[0]?.name || source.publisher || 'Anonim';
  const authorStr = source.authors && source.authors.length > 1 ? `${firstAuthor}, et al.` : firstAuthor;
  const yearStr = source.year ? `${source.year}` : '';

  if (source.sourceType === 'jurnal' || source.journal) {
    const journal = source.journal || 'Jurnal Ilmiah';
    const vol = source.volume ? `vol. ${source.volume}, ` : '';
    const num = source.issue ? `no. ${source.issue}, ` : '';
    const pages = source.pages ? `pp. ${source.pages}.` : '';
    const doiStr = source.doi ? ` https://doi.org/${source.doi.replace(/^https?:\/\/doi\.org\//, '')}` : '';
    return `${authorStr}. "${source.title}." *${journal}*, ${vol}${num}${yearStr}, ${pages}${doiStr}`.trim();
  }

  const publisher = source.publisher ? `${source.publisher}, ` : '';
  return `${authorStr}. *${source.title}*. ${publisher}${yearStr}.`.trim();
}

export function generateIEEE(source: AcademicSource): string {
  const authorStr = source.authors?.map(a => a.name).join(', ') || 'Anon.';
  const yearStr = source.year ? `${source.year}` : '';

  if (source.journal) {
    const volStr = source.volume ? `, vol. ${source.volume}` : '';
    const issueStr = source.issue ? `, no. ${source.issue}` : '';
    const pagesStr = source.pages ? `, pp. ${source.pages}` : '';
    return `[1] ${authorStr}, "${source.title}," *${source.journal}*${volStr}${issueStr}${pagesStr}, ${yearStr}.`;
  }

  const pubStr = source.publisher ? `${source.publisher}, ` : '';
  return `[1] ${authorStr}, *${source.title}*. ${pubStr}${yearStr}.`;
}

export function generateHarvard(source: AcademicSource): string {
  const authorStr = formatAuthorsAPA(source);
  const yearStr = source.year ? `${source.year}` : 'n.d.';

  if (source.journal) {
    return `${authorStr}, ${yearStr}. ${source.title}. ${source.journal}, ${source.volume || ''}(${source.issue || ''}), pp.${source.pages || '-'}.`;
  }
  return `${authorStr}, ${yearStr}. *${source.title}*. ${source.publisher || 'Publisher'}.`;
}

export function generateChicago(source: AcademicSource): string {
  const authorStr = source.authors?.[0]?.name || source.publisher || 'Anonim';
  const yearStr = source.year ? `${source.year}` : '';

  if (source.journal) {
    return `${authorStr}. ${yearStr}. "${source.title}." *${source.journal}* ${source.volume || ''} (${source.issue || ''}): ${source.pages || ''}.`;
  }
  return `${authorStr}. ${yearStr}. *${source.title}*. ${source.publisher || ''}.`;
}

export function generateVancouver(source: AcademicSource): string {
  const authors = source.authors?.map(a => a.name).slice(0, 6).join(', ') || 'Anon';
  const etAl = source.authors && source.authors.length > 6 ? ', et al.' : '';
  const yearStr = source.year ? `${source.year}` : '';

  if (source.journal) {
    return `${authors}${etAl}. ${source.title}. ${source.journal}. ${yearStr};${source.volume || ''}(${source.issue || ''}):${source.pages || ''}.`;
  }
  return `${authors}${etAl}. ${source.title}. ${source.publisher || ''}; ${yearStr}.`;
}

export function generateBibTeX(source: AcademicSource): string {
  const citeKey = (source.authors?.[0]?.name.split(' ').pop() || 'ref') + (source.year || '2024');
  const safeKey = citeKey.toLowerCase().replace(/[^a-z0-9]/g, '');
  const type = source.sourceType === 'ebook' ? 'book' : 'article';
  const authors = source.authors?.map(a => a.name).join(' and ') || 'Unknown';

  let bib = `@${type}{${safeKey},\n`;
  bib += `  title = {${source.title}},\n`;
  bib += `  author = {${authors}},\n`;
  if (source.year) bib += `  year = {${source.year}},\n`;
  if (source.journal) bib += `  journal = {${source.journal}},\n`;
  if (source.volume) bib += `  volume = {${source.volume}},\n`;
  if (source.issue) bib += `  number = {${source.issue}},\n`;
  if (source.pages) bib += `  pages = {${source.pages}},\n`;
  if (source.publisher) bib += `  publisher = {${source.publisher}},\n`;
  if (source.doi) bib += `  doi = {${source.doi}},\n`;
  if (source.sourceUrl) bib += `  url = {${source.sourceUrl}},\n`;
  bib += `}`;
  return bib;
}

export function generateRIS(source: AcademicSource): string {
  const type = source.sourceType === 'ebook' ? 'BOOK' : 'JOUR';
  let ris = `TY  - ${type}\n`;
  ris += `TI  - ${source.title}\n`;
  if (source.authors) {
    source.authors.forEach(a => {
      ris += `AU  - ${a.name}\n`;
    });
  }
  if (source.year) ris += `PY  - ${source.year}\n`;
  if (source.journal) ris += `T2  - ${source.journal}\n`;
  if (source.volume) ris += `VL  - ${source.volume}\n`;
  if (source.issue) ris += `IS  - ${source.issue}\n`;
  if (source.pages) {
    const parts = source.pages.split('-');
    if (parts[0]) ris += `SP  - ${parts[0].trim()}\n`;
    if (parts[1]) ris += `EP  - ${parts[1].trim()}\n`;
  }
  if (source.publisher) ris += `PB  - ${source.publisher}\n`;
  if (source.doi) ris += `DO  - ${source.doi}\n`;
  if (source.sourceUrl) ris += `UR  - ${source.sourceUrl}\n`;
  if (source.abstract) ris += `AB  - ${source.abstract}\n`;
  ris += `ER  - \n`;
  return ris;
}
