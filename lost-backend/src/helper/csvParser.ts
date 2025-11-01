import csvParser from 'csv-parser';
import fs from 'fs';
export default function parseCSV(filePath: string): Promise<Record<string, any>[]> {
  return new Promise((resolve, reject) => {
    const results: Record<string, any>[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data: Record<string, any>) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err: Error) => reject(err));
  });
}
