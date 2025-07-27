"use strict";
import ImagenSchema from "../entity/imagen.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getImagenesService() {
  try {
    const repo = AppDataSource.getRepository(ImagenSchema);
    const data = await repo.find();
    return [data, null];
  } catch (error) {
    console.error("Error al obtener imágenes:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getImagenByIdService(id) {
  try {
    const repo = AppDataSource.getRepository(ImagenSchema);
    const data = await repo.findOneBy({ id_img: parseInt(id) });
    if (!data) return [null, "Imagen no encontrada"];
    return [data, null];
  } catch (error) {
    console.error("Error al obtener imagen:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createImagenService(data) {
  try {
    const imagenesRepository = AppDataSource.getRepository(Imagenes);
    const newImagen = imagenesRepository.create({
      ruta_imagen: data.ruta_imagen, // usa la propiedad correcta
      id_producto: data.id_producto,
    });
    return await imagenesRepository.save(newImagen);
  } catch (error) {
    console.error("Error al crear la imagen:", error);
    return null;
  }
}


export async function updateImagenService(id, body) {
  try {
    const repo = AppDataSource.getRepository(ImagenSchema);
    const encontrada = await repo.findOneBy({id_img: parseInt(id) });
    if (!encontrada) return [null, "Imagen no encontrada"];
    await repo.update({ id_img: parseInt(id) }, body);
    const actualizada = await repo.findOneBy({ id_img: parseInt(id) });
    return [actualizada, null];
  } catch (error) {
    console.error("Error al actualizar imagen:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteImagenService(id) {
  try {
    const repo = AppDataSource.getRepository(ImagenSchema);
    const encontrada = await repo.findOneBy({ id_img: parseInt(id) });
    if (!encontrada) return [null, "Imagen no encontrada"];
    await repo.remove(encontrada);
    return [encontrada, null];
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    return [null, "Error interno del servidor"];
  }
}
