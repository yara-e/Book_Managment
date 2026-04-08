import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.S3_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
    },
});

export const uploadFileToR2 = async (file: Express.Multer.File): Promise<string> => {

    const fileExtension = file.originalname.split('.').pop();
    const fileName = `covers/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype, // Crucial so the browser knows it's an image
    });

    await s3Client.send(command);

    // Return the full public URL for the db
    return `${process.env.S3_PUBLIC_URL}/${fileName}`;
};