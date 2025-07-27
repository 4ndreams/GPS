"use strict";
import { Client } from "minio";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import PhotoSchema from "../entity/photo.entity.js";
import { AppDataSource } from "../config/configDb.js";

const uploadDriver = process.env.UPLOAD_DRIVER || "local";

// Función para subir imagen a MinIO/Local y guardar en base de datos
export async function createPhotoService(file, id_orden) {
  try {
    let ruta_imagen;

    if (uploadDriver === "minio") {
      const minioClient = new Client({
        endPoint: process.env.MINIO_ENDPOINT,
        port: parseInt(process.env.MINIO_PORT, 10),
        useSSL: process.env.MINIO_USE_SSL === "true",
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
      });

      const bucket = process.env.MINIO_BUCKET;
      const fileName = `photo-${uuidv4()}_${file.originalname}`;

      await minioClient.putObject(bucket, fileName, file.buffer, {
        "Content-Type": file.mimetype,
      });

      const base =
        process.env.MINIO_PUBLIC_URL ||
        `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`;

      ruta_imagen = `${base}/${bucket}/${fileName}`;
    } else {
      // LOCAL
      const fileName = `photo-${uuidv4()}_${file.originalname}`;
      const filePath = path.resolve(process.cwd(), "uploads", fileName);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, file.buffer);

      // Ajusta el host/puerto según tu backend local
      ruta_imagen = `http://${process.env.HOST}:${process.env.PORT}/uploads/${fileName}`;
    }

    // Guardar en base de datos
    const repo = AppDataSource.getRepository(PhotoSchema);
    const nuevaPhoto = repo.create({
      ruta_imagen,
      id_orden: parseInt(id_orden)
    });
    await repo.save(nuevaPhoto);

    return [nuevaPhoto, null];
  } catch (error) {
    console.error("Error al crear photo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getPhotosService() {
  try {
    const repo = AppDataSource.getRepository(PhotoSchema);
    const data = await repo.find();
    return [data, null];
  } catch (error) {
    console.error("Error al obtener photos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getPhotoByIdService(id) {
  try {
    const repo = AppDataSource.getRepository(PhotoSchema);
    const data = await repo.findOneBy({ id_pht: parseInt(id) });
    if (!data) return [null, "Photo no encontrada"];
    return [data, null];
  } catch (error) {
    console.error("Error al obtener photo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updatePhotoService(id, body) {
  try {
    const repo = AppDataSource.getRepository(PhotoSchema);
    const encontrada = await repo.findOneBy({id_pht: parseInt(id) });
    if (!encontrada) return [null, "Photo no encontrada"];
    await repo.update({ id_pht: parseInt(id) }, body);
    const actualizada = await repo.findOneBy({ id_pht: parseInt(id) });
    return [actualizada, null];
  } catch (error) {
    console.error("Error al actualizar photo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deletePhotoService(id) {
  try {
    const repo = AppDataSource.getRepository(PhotoSchema);
    const encontrada = await repo.findOneBy({ id_pht: parseInt(id) });
    if (!encontrada) return [null, "Photo no encontrada"];
    await repo.remove(encontrada);
    return [encontrada, null];
  } catch (error) {
    console.error("Error al eliminar photo:", error);
    return [null, "Error interno del servidor"];
  }
}
