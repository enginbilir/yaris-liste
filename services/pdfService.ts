import type { CompetitionEntry } from '../types';
export async function processPdf(file: File): Promise<CompetitionEntry[]> {
  const pdfjs = await import('../dist/vendor/pdf.mjs');
  const { linesFromItems, parsePages } = await import('../dist/parser.mjs');
  const { verticalGridLines } = await import('../dist/pdf-grid.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('../dist/vendor/pdf.worker.mjs', import.meta.url).href;
  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false });
  try {
    const document = await task.promise;
    const pages = [];
    for (let number = 1; number <= document.numPages; number++) {
      const page = await document.getPage(number);
      pages.push({ number, width: page.getViewport({scale:1}).width,
        lines: linesFromItems((await page.getTextContent()).items),
        verticals: verticalGridLines(await page.getOperatorList(), pdfjs.OPS) });
    }
    return parsePages(pages).rows;
  } finally { await task.destroy(); }
}
