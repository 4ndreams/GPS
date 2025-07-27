import { Client } from "minio";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";

const uploadDriver = process.env.UPLOAD_DRIVER || "local";

export async function uploadImage(file) {
  if (uploadDriver === "minio") {
    const minioClient = new Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: parseInt(process.env.MINIO_PORT, 10),
      useSSL: process.env.MINIO_USE_SSL === "true",
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });

    const bucket = process.env.MINIO_BUCKET;
    const fileName = `${uuidv4()}_${file.originalname}`;

    await minioClient.putObject(bucket, fileName, file.buffer, {
      "Content-Type": file.mimetype,
    });

    const base =
      process.env.MINIO_PUBLIC_URL ||
      `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`;

    return `${base}/${bucket}/${fileName}`;
  } else {
    // LOCAL
    const fileName = `${uuidv4()}_${file.originalname}`;
    const filePath = path.resolve(__dirname, "../../uploads", fileName);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, file.buffer);

    // Ajusta el host/puerto según tu backend local
    return `http://${process.env.HOST}:${process.env.PORT}/uploads/${fileName}`;
  }
}
