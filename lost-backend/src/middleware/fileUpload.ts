import fs from 'fs';
import multer from 'multer';
import path from 'path';
import logger from '../lib/logger';

// Ensure the tmp folder exists in the project root
const tmpDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpDir); // Set the destination to the 'tmp' folder in project root
  },
  filename: (req, file, cb) => {
    logger.info(`Saving file with original name: ${file.originalname + new Date().getTime()}`); // Log the filename being use
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`); // Use a unique filename with timestamp
  },
});

const upload = multer({
  storage,
});

export { upload };
