import ImageKit, { toFile } from "@imagekit/nodejs";
import { config } from "../config/config.js";

const imagekit = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    publicKey: config.IMAGEKIT_PUBLIC_KEY || "public_/5h7pJxTHhPUJ+6Fc3m8pA==",
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/snitch"
});


/**
 * Uploads a file buffer to ImageKit and returns { url } object.
 * Uses the v7 SDK API: imagekit.files.upload()
 * @param {{ buffer: Buffer, fileName: string }} param
 * @returns {Promise<{ url: string }>}
 */
export async function uploadFile({ buffer, fileName }) {
    try {
        if (!buffer) {
            throw new Error("No file buffer provided for upload");
        }

        // v7 SDK requires using toFile() to wrap the buffer
        const file = await toFile(buffer, fileName);

        // In v7, upload is on imagekit.files.upload()
        const result = await imagekit.files.upload({
            file,
            fileName,
            folder: "/products",
        });

        return { url: result.url };
    } catch (error) {
        console.error("ImageKit Upload Error:", error.message);
        throw error;
    }
}
