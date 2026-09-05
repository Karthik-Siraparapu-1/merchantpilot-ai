/**
 * Export and Print Utility Functions
 * MerchantPilot AI - Professional CSV Exporter & Print Formatting
 */

/**
 * Downloads a structured CSV file from array data
 */
export function downloadCsvFile(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
): void {
  const sanitizeCell = (cell: string | number | boolean | null | undefined): string => {
    if (cell === null || cell === undefined) return '""';
    const str = String(cell).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerLine = headers.map(sanitizeCell).join(',');
  const rowLines = rows.map((row) => row.map(sanitizeCell).join(','));
  const csvContent = [headerLine, ...rowLines].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a raw CSV string (e.g. from AI reports engine)
 */
export function downloadRawCsvString(filename: string, csvContent: string): void {
  // Strip data URI prefix if present
  let cleanContent = csvContent;
  if (cleanContent.startsWith('data:text/csv')) {
    const commaIndex = cleanContent.indexOf(',');
    if (commaIndex !== -1) {
      cleanContent = decodeURIComponent(cleanContent.slice(commaIndex + 1));
    }
  }

  const blob = new Blob(['\uFEFF' + cleanContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers professional browser print dialog with optimal page settings
 */
export function triggerPrintView(title?: string): void {
  if (typeof window === 'undefined') return;
  const originalTitle = document.title;
  if (title) {
    document.title = title;
  }
  window.print();
  if (title) {
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  }
}
