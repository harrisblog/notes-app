import { Note } from "../types";

export function importCSV(csvContent: string): Note[] {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  const result: Note[] = [];

  for (let i = 1; i < lines.length; i++) {
    const obj: any = {};
    const currentLine = lines[i].split(',');

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentLine[j] ? JSON.parse(currentLine[j]) : '';
    }

    result.push({
      id: Number(obj.id) || new Date().getTime(),
      title: obj.title,
      body: obj.body,
      updated: obj.updated || new Date().toISOString()
    });
  }

  return result;
}

export function importXML(xmlContent: string): Note[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
  const items = xmlDoc.getElementsByTagName('item');
  const result: Note[] = [];

  Array.from(items).forEach(item => {
    const obj: any = {};
    Array.from(item.children).forEach(child => {
      obj[child.tagName] = child.textContent;
    });

    result.push({
      id: Number(obj.id) || new Date().getTime(),
      title: obj.title,
      body: obj.body,
      updated: obj.updated || new Date().toISOString()
    });
  });

  return result;
}
