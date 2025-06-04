import { recoverPasswordService } from "../services/auth.service.js";

export async function recoverPasswordController(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token y nueva contraseña son requeridos" });
    }

    const [success, error] = await recoverPasswordService(token, newPassword);

    if (error) return res.status(400).json({ message: error });

    return res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
