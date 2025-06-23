"use strict";
import { AppDataSource } from "../config/configDb.js";

export const getMateriales = async (req, res) => {
  try {
    const materialRepo = AppDataSource.getRepository("Material");
    const materiales = await materialRepo.find();
    res.json({ success: true, data: materiales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener materiales" });
  }
};
