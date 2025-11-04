import express, { Express } from 'express';
import getIFSCDetails from '../../controller/ifscDetails';
import ocrController from '../../controller/ocr';
import GetSignedUrl from '../../controller/signedUrl';
import { upload } from '../../middleware/fileUpload';
import morganMiddleware from '../../middleware/loggerMiddleware';
import { ROUTES } from '../../shared/enums';
import authRoutes from '../auth';
const app: Express = express();

app.use(ROUTES.SIGNED_URL, GetSignedUrl);
app.get(ROUTES.IFSC, morganMiddleware, getIFSCDetails);
app.post(ROUTES.OCR, upload.single('file'), morganMiddleware, ocrController);
app.use(ROUTES.AUTH, morganMiddleware, authRoutes);

export default app;
