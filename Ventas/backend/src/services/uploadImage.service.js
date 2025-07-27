import { Client } from "minio";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import {
  UPLOAD_DRIVER,
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_USE_SSL,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET,
  MINIO_PUBLIC_URL,
  HOST,
  PORT
} from "../config/configEnv.js";

export async function uploadImage(file) {
  if (UPLOAD_DRIVER === "minio") {
    const minioClient = new Client({
      endPoint: MINIO_ENDPOINT,
      port: parseInt(MINIO_PORT, 10),
      useSSL: MINIO_USE_SSL === "true",
      accessKey: MINIO_ACCESS_KEY,
      secretKey: MINIO_SECRET_KEY,
    });

    const fileName = `${uuidv4()}_${file.originalname}`;

    await minioClient.putObject(MINIO_BUCKET, fileName, file.buffer, {
      "Content-Type": file.mimetype,
    });

    const base = MINIO_PUBLIC_URL || `http://${MINIO_ENDPOINT}:${MINIO_PORT}`;

    return `${base}/${MINIO_BUCKET}/${fileName}`;
  } else {
    // LOCAL
    const fileName = `${uuidv4()}_${file.originalname}`;
    const filePath = path.resolve(__dirname, "../../uploads", fileName);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, file.buffer);

    // Ajusta el host/puerto según tu backend local
    return `http://${HOST}:${PORT}/uploads/${fileName}`;
  }
}
