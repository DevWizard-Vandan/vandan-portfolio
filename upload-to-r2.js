// upload-to-r2.js
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const fs = require("fs");
const path = require("path");

// ⬇️ PASTE YOUR CREDENTIALS HERE ⬇️
const ACCOUNT_ID = "82971e2801bedad45ac781470916343a"; // Found in your R2 dashboard URL
const ACCESS_KEY_ID = "038995d935f8ab7f7af4248fee182caa"; // From Step 1.3
const SECRET_ACCESS_KEY = "cc1eb5bdd76ccb2e836031a11c87a7db9ee210858ab3942f26043f86b5bc34d9"; // From Step 1.3
const BUCKET_NAME = "vandan-portfolio-assets"; // Your bucket name

// Initialize R2 Client
const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
});

// Path to your local video assets (matches your screenshot)
const LOCAL_ASSET_PATH = "./public/Video_assets";

async function uploadFile(filePath) {
    const fileContent = fs.readFileSync(filePath);
    // Create key like: "Video_1_Name_Fall/frame_0001.webp"
    // We explicitly replace Windows backslashes (\) with forward slashes (/)
    const relativePath = path.relative(LOCAL_ASSET_PATH, filePath);
    const key = relativePath.split(path.sep).join("/");

    try {
        const upload = new Upload({
            client: s3,
            params: {
                Bucket: BUCKET_NAME,
                Key: key, // This puts it at root of bucket, e.g. "Video_1.../frame.webp"
                Body: fileContent,
                ContentType: filePath.endsWith(".webp") ? "image/webp" : "image/jpeg",
            },
        });

        await upload.done();
        console.log(`✅ Uploaded: ${key}`);
    } catch (e) {
        console.error(`❌ Failed: ${key}`, e);
    }
}

async function walkAndUpload(dir) {
    const files = fs.readdirSync(dir);
    const queue = [];

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            await walkAndUpload(filePath);
        } else {
            // Only upload images
            if (!filePath.endsWith(".webp") && !filePath.endsWith(".jpg")) continue;

            queue.push(uploadFile(filePath));

            // Upload in batches of 20 to be safe
            if (queue.length >= 20) {
                await Promise.all(queue);
                queue.length = 0;
            }
        }
    }
    // Finish remaining
    await Promise.all(queue);
}

console.log("🚀 Starting Upload to R2...");
walkAndUpload(LOCAL_ASSET_PATH).then(() => console.log("🎉 All Done!"));