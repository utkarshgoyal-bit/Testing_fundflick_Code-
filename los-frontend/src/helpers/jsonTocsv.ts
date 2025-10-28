export function jsonToCsv(jsonData: any[]): string {
  console.log('exporting to csv');
  const header = Object.keys(jsonData[0]);
  const rows = jsonData.map((item) => header.map((key) => `"${item[key]}"`).join(','));
  return [header.join(','), ...rows].join('\n');
}
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function exportCasesToExcel(flattenedData: any[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(flattenedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Cases');

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  saveAs(blob, filename + '.xlsx');
}
