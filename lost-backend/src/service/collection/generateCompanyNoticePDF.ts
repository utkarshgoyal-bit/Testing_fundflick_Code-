import path from 'path';
import createReport from 'docx-templates';
import fs from 'fs';
import libre from 'libreoffice-convert';
const generateCompanyNoticePDF = async (data: {
  caseNo: string;
  customer: string;
  address: string;
  loanType: string;
  dueEmiAmount: string;
  financeAmount: string;
  tenure: string;
  dueEmi: string;
  emiAmt: string;
  caseDate: string;
}) => {
  const ext = '.pdf';
  const filePath = path.join(__dirname, '../collection/word-files', 'DEFAULTNOTICE.docx');

  if (!fs.existsSync(filePath)) {
    throw new Error('Word file not found.');
  }

  const today = new Date();
  const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
  const template = fs.readFileSync(filePath);
  const buffer = await createReport({
    template,
    data: {
      ...data,
      todayDate: formattedDate,
    },
    cmdDelimiter: ['{', '}'],
  });
  const docxBuffer = Buffer.from(buffer);
  const pdfBuf = await new Promise<Buffer>((resolve, reject) => {
    libre.convert(docxBuffer, ext, undefined, (err: any, done: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(done);
      }
    });
  });

  return pdfBuf;
};

export default generateCompanyNoticePDF;
