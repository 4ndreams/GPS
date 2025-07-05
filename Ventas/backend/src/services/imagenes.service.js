"use strict";
import Imagenes from "../entity/imagenes.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getImagenesService() {
  try {
    const imagenesRepository = AppDataSource.getRepository(Imagenes);
    const imagenes = await imagenesRepository.find({
      relations: ["producto"],
    });
    return imagenes;
  } catch (error) {
    console.error("Error al obtener las imágenes:", error);
    return null;
  }
}

export async function getImagenByIdService(id) {
  try {
    const imagenesRepository = AppDataSource.getRepository(Imagenes);
    const imagen = await imagenesRepository.findOne({
      where: { id_img: id },
      relations: ["producto"],
    });
    return imagen;
  } catch (error) {
    console.error("Error al obtener la imagen:", error);
    return null;
  }
}

export async function getImagenesByProductoService(id_producto) {
  try {
    const imagenesRepository = AppDataSource.getRepository(Imagenes);
    const imagenes = await imagenesRepository.find({
      where: { id_producto: id_producto },
      relations: ["producto"],
    });
    return imagenes;
  } catch (error) {
    console.error("Error al obtener las imágenes del producto:", error);
    return null;
  }
}

export async function createImagenService(data) {
  try {
    const imagenesRepository = AppDataSource.getRepository(Imagenes);
    const newImagen = imagenesRepository.create(data);
    const savedImagen = await imagenesRepository.save(newImagen);
    return savedImagen;
  } catch (error) {
    console.error("Error al crear la imagen:", error);
    return null;
  }
}

export async function updateImagenService(id, data) {
  try {
    const imagenesRepository = AppDataSource.getRepository(Imagenes);
    const imagen = await imagenesRepository.findOne({
      where: { id_img: id },
    });
    if (!imagen) return null;

    imagenesRepository.merge(imagen, data);
    const updatedImagen = await imagenesRepository.save(imagen);
    return updatedImagen;
  } catch (error) {
    console.error("Error al actualizar la imagen:", error);
    return null;
  }
}

export async function deleteImagenService(id) {
  try {
    const imagenesRepository = AppDataSource.getRepository(Imagenes);
    const imagen = await imagenesRepository.findOne({
      where: { id_img: id },
    });
    if (!imagen) return null;

    await imagenesRepository.remove(imagen);
    return imagen;
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
    return null;
  }
}