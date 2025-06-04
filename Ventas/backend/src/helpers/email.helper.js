import transporter from "../config/mailer.config.js";
import { RESET_PASSWORD_URL } from "../config/configEnv.js";

export async function sendLoginAlertEmail(to) {
  const resetLink = `${RESET_PASSWORD_URL}?email=${encodeURIComponent(to)}`;
  
  await transporter.sendMail({
    to,
    subject: "Alerta de seguridad: Múltiples intentos fallidos",
    html: `
      <p>Detectamos múltiples intentos fallidos de inicio de sesión en tu cuenta.</p>
      <p>Si no fuiste tú, por favor cambia tu contraseña de inmediato.</p>
      <p><a href="${resetLink}">Cambiar contraseña</a></p>
    `,
  });
}
