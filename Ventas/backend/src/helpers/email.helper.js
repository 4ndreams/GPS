import jwt from "jsonwebtoken";
import transporter from "../config/mailer.config.js";
import { HOST, PORT, ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

export async function sendLoginAlertEmail(email) {
  const token = jwt.sign({ email }, ACCESS_TOKEN_SECRET, { expiresIn: "2m" });

  const resetLink = `http://${process.env.HOST}:${process.env.PORT}/api/recover-password?token=${token}`;
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

  await transporter.sendMail({
    to: email,
    subject: "🔒 Alerta de seguridad: Múltiples intentos fallidos de inicio de sesión",
    html: htmlContent,
  });
}

export async function sendVerificationEmail(to, token) {
  const verificationLink = `http://${process.env.HOST}:${process.env.PORT}/api/verify-email?token=${token}`;
  
  await transporter.sendMail({
    to,
    subject: "Verifica tu cuenta en TERPLAC",
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; background: #fff; padding: 0; margin: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #fff; padding: 0; margin: 0;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; margin: 2rem auto; background: #111; border-radius: 12px; box-shadow: 0 4px 24px rgba(236,34,31,0.08); overflow: hidden;">
                <tr>
                  <td style="background: #EC221F; padding: 2rem 0;">
                    <h1 style="color: #fff; font-size: 2.2rem; margin: 0; font-weight: 700; letter-spacing: 1px; text-align: center;">TERPLAC</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 2rem 2.5rem 1rem 2.5rem;">
                    <h2 style="color: #fff; font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 600; text-align: center;">¡Bienvenido!</h2>
                    <p style="color: #fff; font-size: 1.1rem; margin-bottom: 1.5rem; text-align: center;">
                      Gracias por registrarte. Para completar tu registro, por favor verifica tu dirección de correo electrónico haciendo clic en el botón de abajo:
                    </p>
                    <div style="text-align: center; margin: 2rem 0;">
                      <a href="${verificationLink}" style="display:inline-block; padding: 14px 32px; background: #EC221F; color: #fff; font-size: 1.1rem; font-weight: 600; border-radius: 6px; text-decoration: none; box-shadow: 0 2px 8px rgba(236,34,31,0.10); transition: background 0.2s;">Verificar correo</a>
                    </div>
                    <p style="color: #ccc; font-size: 0.98rem; margin-bottom: 0.5rem; text-align: center;">
                      Este enlace expirará en 10 minutos.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background: #1a1a1a; padding: 1.2rem 2.5rem; border-top: 1px solid #222; color: #ccc; font-size: 0.95rem; text-align: center;">
                    Si no creaste una cuenta, puedes ignorar este correo.
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding: 1rem 0 0.5rem 0;">
                    <span style="color: #EC221F; font-size: 1.2rem; font-weight: bold;">TERPLAC</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `
  });
}
