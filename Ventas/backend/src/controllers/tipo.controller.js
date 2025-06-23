"use strict";
import { AppDataSource } from "../config/configDb.js";

export const getTipos = async (req, res) => {
  try {
    const tipoRepo = AppDataSource.getRepository("Tipo");
    const tipos = await tipoRepo.find();
    res.json({ success: true, data: tipos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener tipos" });
  }
};
