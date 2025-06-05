import { AppDataSource } from "../config/configDb.js";
import MensajeContactoSchema from "../entity/mensaje_contacto.entity.js";

export async function enviarMensaje(req, res) {
  const { nombre, email, telefono, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ message: "Faltan campos obligatorios." });
  }

  try {
    const repo = AppDataSource.getRepository(MensajeContactoSchema);
    const nuevoMensaje = repo.create({ nombre, email, telefono, mensaje });
    await repo.save(nuevoMensaje);
    res.status(201).json({ message: "Mensaje enviado con éxito." });
  } catch (error) {
    console.error("Error al guardar mensaje:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
}
