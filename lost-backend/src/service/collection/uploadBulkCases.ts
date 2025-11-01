import fs from 'fs';
import { Employee, coApplicantsData } from '../../interfaces';
import xlsx from 'xlsx';
import { parseCSV } from '../../helper';
import uploadCasesCollection from './case/uploadCasesCollection';
import uploadCaseCoApplicant from './case/uploadCaseCoApplicant';
const uploadBulkCases = async ({
  filePath,
  fileExtension,
  fileType,
  employee,
  loginUser,
}: {
  filePath: string;
  fileExtension: string;
  fileType: number;
  employee?: Employee;
  loginUser: any;
}) => {
  let newData: any = [];
  if (!filePath || !fileExtension) throw new Error('File and extension required.');
  if (fileExtension === '.xlsx' || fileExtension === '.xls') {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    newData = xlsx.utils.sheet_to_json(sheet);
  } else if (fileExtension === '.csv') {
    newData = await parseCSV(filePath);
  } else {
    throw new Error('Unsupported file format. Use .xlsx or .csv.');
  }
  if (+fileType === 0) {
    await uploadCasesCollection({ newData, employee, loginUser });
  } else if (+fileType === 1) {
    await uploadCaseCoApplicant(newData as coApplicantsData, loginUser);
  }
  fs.unlink(filePath, err => {
    if (err) console.error(`Error deleting file: ${filePath}`, err);
  });
  return { success: true, message: 'File processed successfully.' };
};

export default uploadBulkCases;
