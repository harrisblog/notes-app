function exportFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportCSV(data: any[], fileName: string) {
  const headers = Object.keys(data[0]);
  const rows = data.map(obj =>
    headers.map(header => JSON.stringify(obj[header])).join(',')
  );
  const csvContent = [headers.join(','), ...rows].join('\n');
  exportFile(csvContent, fileName, 'text/csv;charset=utf-8;');
}

export function exportXML(data: any[], fileName: string) {
  const xmlContent = `<root>
    ${data.map(item => `
      <item>
        ${Object.entries(item).map(([key, value]) => `
          <${key}>${value}</${key}>
        `).join('')}
      </item>
    `).join('')}
  </root>`;
  exportFile(xmlContent, fileName, 'application/xml;charset=utf-8;');
}
