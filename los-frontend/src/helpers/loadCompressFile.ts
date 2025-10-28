import Compressor from "compressorjs";
const handleLoadLocalFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files[0]) {
        const fileType = files[0].type;
        if (fileType.startsWith("image")) {
            try {
                const compressedFile = await new Promise<Blob>((resolve, reject) => {
                    new Compressor(files[0], {
                        quality: 0.8,
                        success: (compressedResult) => resolve(compressedResult),
                        error: reject,
                    });

                });
                return compressedFile;
            } catch (error) {
                console.error("Compression failed:", error);
                return null;
            }
        } else {
            return files[0];
        }
    } else {
        return null;
    }
};

export default handleLoadLocalFile;

