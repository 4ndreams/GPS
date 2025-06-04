import jwt from "jsonwebtoken";
import transporter from "../config/mailer.config.js";
import { RESET_PASSWORD_URL, ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

export async function sendLoginAlertEmail(email) {
  const token = jwt.sign({ email }, ACCESS_TOKEN_SECRET, { expiresIn: "2m" });

  const resetLink = `${RESET_PASSWORD_URL}?token=${token}`;

  // HTML de prueba
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Alerta de Seguridad</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f8f9fa;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 10px;
          border-bottom: 2px solid #007bff;
        }
        .header h1 {
          color: #007bff;
        }
        .content {
          padding: 20px 0;
        }
        .button {
          display: inline-block;
          background: #007bff;
          color: #fff;
          padding: 10px 20px;
          text-decoration: none;
          font-size: 16px;
          border-radius: 5px;
          text-align: center;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔒 Alerta de Seguridad</h1>
        </div>
        <div class="content">
          <p>Hemos detectado <strong>múltiples intentos fallidos de inicio de sesión</strong> en tu cuenta.</p>
          <p>Si no fuiste tú, por seguridad recomendamos cambiar tu contraseña ahora mismo.</p>
          <p style="text-align:center;">
            <a class="button" href="${resetLink}">Cambiar contraseña</a>
          </p>
          <p>Este enlace expirará en 2 minutos.</p>
        </div>
        <div class="footer">
          <p>Si no intentaste iniciar sesión, te recomendamos reforzar la seguridad de tu cuenta.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // 4. Enviar el correo
  await transporter.sendMail({
    to: email,
    subject: "🔒 Alerta de seguridad: Múltiples intentos fallidos de inicio de sesión",
    html: htmlContent,
  });
}