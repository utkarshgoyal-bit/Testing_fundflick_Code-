import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `file-${timestamp}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.xlsx', '.csv', '.xls'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (!allowedTypes.includes(fileExt)) {
      return cb(new Error('Only .xlsx, .xls or .csv files are allowed'));
    }
    cb(null, true);
  },
});

export const uploadMiddleware = (req: any, res: any, next: any): void => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error('Error reading upload directory:', err);
      return res.status(500).json({ error: 'Internal server error.' });
    }

    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      fs.unlink(filePath, unlinkErr => {
        if (unlinkErr) {
          console.error('Error deleting file:', unlinkErr);
        }
      });
    }

    upload.single('excelFile')(req, res, uploadErr => {
      if (uploadErr) {
        console.error('Error uploading file:', uploadErr);
        return res.status(400).json({ error: uploadErr.message });
      }
      next();
    });
  });
};
