import Tesseract from 'tesseract.js';

export const loadOCR = async (imagePath: string) => {
  if (!imagePath) throw 'File not found';
  const worker = await Tesseract.createWorker('eng', 1);
  const {
    data: { text },
  } = await worker.recognize(imagePath);
  await worker.terminate();
  return text;
};
