import cloudinary from "cloudinary"; // assuming using cloudinary for image upload
import { rmSync } from "fs";
import path from "path";



export const UploadToCloudinary = async (imageUrl: string, folder?: string) => {
    try {
        cloudinary.v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });
        const response = await cloudinary.v2.uploader.upload(imageUrl, {
            folder: folder,
        });

        const filePath = path.join(__dirname, "/tmp", path.basename(imageUrl));
        await rmSync(filePath, { force: true });
        return response;
    } catch (error) {
        throw error
    }
}