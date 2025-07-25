import jwt from "jsonwebtoken";
import transporter from "../config/mailer.config.js";
import { ACCESS_TOKEN_SECRET, HOST, PORT, FRONTEND_URL } from "../config/configEnv.js";

// Función auxiliar para mostrar el tipo de puerta de forma legible
function formatTipoPuerta(tipo_puerta) {
  switch (tipo_puerta) {
    case 'puertaPaso':
      return 'Puerta de paso';
    case 'puertaCloset':
      return 'Puerta de closet';
    default:
      return 'No especificado';
  }
}

export async function sendLoginAlertEmail(email) {
  const token = jwt.sign({ email }, ACCESS_TOKEN_SECRET, { expiresIn: "2m" });

  const resetLink = `${process.env.VITE_API_BASE_URL}/recover-password?token=${token}`;
  const htmlContent = `
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
                  <h2 style="color: #fff; font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 600; text-align: center;">Alerta de Seguridad</h2>
                  <p style="color: #fff; font-size: 1.1rem; margin-bottom: 1.5rem; text-align: center;">
                    Hemos detectado <strong>múltiples intentos fallidos de inicio de sesión</strong> en tu cuenta.<br/>
                    Por seguridad, te recomendamos cambiar tu contraseña ahora mismo.
                  </p>
                  <div style="text-align: center; margin: 2rem 0;">
                    <a href="${resetLink}" style="display:inline-block; padding: 14px 32px; background: #EC221F; color: #fff; font-size: 1.1rem; font-weight: 600; border-radius: 6px; text-decoration: none; box-shadow: 0 2px 8px rgba(236,34,31,0.10); transition: background 0.2s;">Cambiar contraseña</a>
                  </div>
                  <p style="color: #ccc; font-size: 0.98rem; margin-bottom: 0.5rem; text-align: center;">
                    Si no solicitaste este cambio, puedes ignorar este correo.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background: #1a1a1a; padding: 1.2rem 2.5rem; border-top: 1px solid #222; color: #ccc; font-size: 0.95rem; text-align: center;">
                  El enlace expirará en 2 minutos por seguridad.
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

export async function sendCotizacionConfirmationEmail(cotizacion) {
  const { 
    id_producto_personalizado, 
    nombre_apellido_contacto, 
    email_contacto, 
    telefono_contacto,
    medida_ancho, 
    medida_alto, 
    medida_largo,
    tipo_puerta,
    mensaje,
    estado,
    material, 
    relleno,
    usuario
  } = cotizacion;

  // Determinar el email y nombre del destinatario
  const destinatarioEmail = email_contacto || usuario?.email;
  const destinatarioNombre = nombre_apellido_contacto || `${usuario?.nombre} ${usuario?.apellido}`;
  
  if (!destinatarioEmail) {
    throw new Error('No se pudo determinar el email del destinatario');
  }

  await transporter.sendMail({
    to: destinatarioEmail,
    subject: `Confirmación de Cotización #${id_producto_personalizado} - TERPLAC`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; background: #fff; padding: 0; margin: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #fff; padding: 0; margin: 0;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 2rem auto; background: #111; border-radius: 12px; box-shadow: 0 4px 24px rgba(236,34,31,0.08); overflow: hidden;">
                <tr>
                  <td style="background: #EC221F; padding: 2rem 0;">
                    <h1 style="color: #fff; font-size: 2.2rem; margin: 0; font-weight: 700; letter-spacing: 1px; text-align: center;">TERPLAC</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 2rem 2.5rem 1rem 2.5rem;">
                    <h2 style="color: #fff; font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 600; text-align: center;">¡Cotización Recibida!</h2>
                    <p style="color: #fff; font-size: 1.1rem; margin-bottom: 1.5rem; text-align: center;">
                      Hola ${destinatarioNombre}, hemos recibido tu solicitud de cotización y la estamos procesando.
                    </p>
                    
                    <div style="background: #1a1a1a; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0;">
                      <h3 style="color: #EC221F; font-size: 1.2rem; margin: 0 0 1rem 0; font-weight: 600;">Detalles de tu Cotización #${id_producto_personalizado}</h3>
                      
                      <table style="width: 100%; color: #ccc; font-size: 0.95rem;">
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Tipo de puerta:</td>
                          <td style="padding: 0.3rem 0;">${formatTipoPuerta(tipo_puerta)}</td>
                        </tr>
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Material:</td>
                          <td style="padding: 0.3rem 0;">${material?.nombre_material || 'No especificado'}</td>
                        </tr>
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Relleno:</td>
                          <td style="padding: 0.3rem 0;">${relleno?.nombre_relleno || 'No especificado'}</td>
                        </tr>
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Dimensiones:</td>
                          <td style="padding: 0.3rem 0;">${medida_ancho}cm × ${medida_alto}cm × ${medida_largo}mm</td>
                        </tr>
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Estado:</td>
                          <td style="padding: 0.3rem 0; color: #EC221F; font-weight: 600;">${estado}</td>
                        </tr>
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Teléfono:</td>
                          <td style="padding: 0.3rem 0;">${telefono_contacto}</td>
                        </tr>
                        ${mensaje ? `
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff; vertical-align: top;">Mensaje:</td>
                          <td style="padding: 0.3rem 0;">${mensaje}</td>
                        </tr>
                        ` : ''}
                      </table>
                    </div>
                    
                    <p style="color: #ccc; font-size: 0.98rem; margin-bottom: 0.5rem; text-align: center;">
                      Te contactaremos pronto para proporcionarte más detalles sobre tu cotización.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background: #1a1a1a; padding: 1.2rem 2.5rem; border-top: 1px solid #222; color: #ccc; font-size: 0.95rem; text-align: center;">
                    Si tienes alguna consulta, no dudes en contactarnos.
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

export async function sendCotizacionStatusChangeEmail(cotizacion, estadoAnterior) {
  const { 
    id_producto_personalizado, 
    nombre_apellido_contacto, 
    email_contacto, 
    telefono_contacto,
    medida_ancho, 
    medida_alto, 
    medida_largo,
    tipo_puerta,
    estado,
    precio,
    material, 
    relleno,
    usuario
  } = cotizacion;

  // Determinar el email y nombre del destinatario
  const destinatarioEmail = email_contacto || usuario?.email;
  const destinatarioNombre = nombre_apellido_contacto || `${usuario?.nombre} ${usuario?.apellido}`;
  
  if (!destinatarioEmail) {
    throw new Error('No se pudo determinar el email del destinatario');
  }

  // Configurar el mensaje según el nuevo estado
  let statusMessage = '';
  let statusColor = '#EC221F';
  let actionMessage = '';

  switch (estado) {
    case 'En Proceso':
      statusMessage = 'Tu cotización está ahora en proceso';
      actionMessage = 'Nuestro equipo está trabajando en los detalles de tu solicitud.';
      statusColor = '#FFA500';
      break;
    case 'Lista para retirar':
      statusMessage = 'Tu cotización está lista';
      actionMessage = 'Puedes contactarnos para coordinar la entrega o más información.';
      statusColor = '#28a745';
      break;
    default:
      statusMessage = `El estado de tu cotización ha cambiado a: ${estado}`;
      actionMessage = 'Te mantendremos informado sobre cualquier actualización.';
  }

  await transporter.sendMail({
    to: destinatarioEmail,
    subject: `Actualización de Cotización #${id_producto_personalizado} - ${estado} - TERPLAC`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; background: #fff; padding: 0; margin: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #fff; padding: 0; margin: 0;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 2rem auto; background: #111; border-radius: 12px; box-shadow: 0 4px 24px rgba(236,34,31,0.08); overflow: hidden;">
                <tr>
                  <td style="background: #EC221F; padding: 2rem 0;">
                    <h1 style="color: #fff; font-size: 2.2rem; margin: 0; font-weight: 700; letter-spacing: 1px; text-align: center;">TERPLAC</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 2rem 2.5rem 1rem 2.5rem;">
                    <h2 style="color: #fff; font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 600; text-align: center;">¡Actualización de Cotización!</h2>
                    <p style="color: #fff; font-size: 1.1rem; margin-bottom: 1.5rem; text-align: center;">
                      Hola ${destinatarioNombre}, ${statusMessage}.
                    </p>
                    
                    <div style="background: #1a1a1a; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0;">
                      <h3 style="color: #EC221F; font-size: 1.2rem; margin: 0 0 1rem 0; font-weight: 600;">Cotización #${id_producto_personalizado}</h3>
                      
                      <div style="background: #222; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; border-left: 4px solid ${statusColor};">
                        <p style="color: #fff; margin: 0; font-weight: 600; font-size: 1rem;">
                          Estado: <span style="color: ${statusColor};">${estado}</span>
                        </p>
                        ${estadoAnterior ? `<p style="color: #999; margin: 0.5rem 0 0 0; font-size: 0.9rem;">Estado anterior: ${estadoAnterior}</p>` : ''}
                      </div>
                      
                      <table style="width: 100%; color: #ccc; font-size: 0.95rem;">
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Tipo de puerta:</td>
                          <td style="padding: 0.3rem 0;">${formatTipoPuerta(tipo_puerta)}</td>
                        </tr>
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Material:</td>
                          <td style="padding: 0.3rem 0;">${material?.nombre_material || 'No especificado'}</td>
                        </tr>
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Relleno:</td>
                          <td style="padding: 0.3rem 0;">${relleno?.nombre_relleno || 'No especificado'}</td>
                        </tr>
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Dimensiones:</td>
                          <td style="padding: 0.3rem 0;">${medida_ancho}cm × ${medida_alto}cm × ${medida_largo}mm</td>
                        </tr>
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Precio:</td>
                          <td style="padding: 0.3rem 0; color: #28a745; font-weight: 700;">${precio ? `$${Number(precio).toLocaleString('es-CL')}` : 'Por confirmar'}</td>
                        </tr>
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Teléfono:</td>
                          <td style="padding: 0.3rem 0;">${telefono_contacto}</td>
                        </tr>
                      </table>
                    </div>
                    
                    <p style="color: #ccc; font-size: 0.98rem; margin-bottom: 0.5rem; text-align: center;">
                      ${actionMessage}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background: #1a1a1a; padding: 1.2rem 2.5rem; border-top: 1px solid #222; color: #ccc; font-size: 0.95rem; text-align: center;">
                    Si tienes alguna consulta sobre tu cotización, no dudes en contactarnos.
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

// Nueva función para enviar alertas de despacho al administrador
export async function sendDespachoAlertEmail({ to, notificacion }) {
  const {
    tipo,
    mensaje,
    ordenId,
    productos_faltantes = [],
    productos_defectuosos = [],
    observaciones,
    prioridad,
    fecha_creacion
  } = notificacion;

  // Configurar el color y mensaje según el tipo de alerta
  let alertColor = "#EC221F";
  let alertIcon = "🚨";
  let alertTitle = "Alerta de Despacho";

  switch (tipo) {
    case "alerta_faltante":
      alertColor = "#FFA500";
      alertIcon = "📦";
      alertTitle = "Productos Faltantes";
      break;
    case "defecto_calidad":
      alertColor = "#DC3545";
      alertIcon = "⚠️";
      alertTitle = "Defectos de Calidad";
      break;
  }

  // Generar lista de productos afectados
  let productosAfectados = "";
  if (productos_faltantes.length > 0) {
    productosAfectados += `
      <h4 style="color: #FFA500; margin: 1rem 0 0.5rem 0;">Productos Faltantes:</h4>
      <ul style="color: #ccc; margin: 0;">
        ${productos_faltantes.map(p => `<li>${p.tipo} - ${p.modelo} (Cantidad: ${p.cantidad})</li>`).join("")}
      </ul>
    `;
  }

  if (productos_defectuosos.length > 0) {
    productosAfectados += `
      <h4 style="color: #DC3545; margin: 1rem 0 0.5rem 0;">Productos con Defectos:</h4>
      <ul style="color: #ccc; margin: 0;">
        ${productos_defectuosos.map(p => `<li>${p.tipo} - ${p.modelo} (Cantidad: ${p.cantidad}) - ${p.motivo || "Defecto no especificado"}</li>`).join("")}
      </ul>
    `;
  }

  await transporter.sendMail({
    to,
    subject: `${alertIcon} TERPLAC - ${alertTitle} - Orden ${ordenId}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; background: #fff; padding: 0; margin: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #fff; padding: 0; margin: 0;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 2rem auto; background: #111; border-radius: 12px; box-shadow: 0 4px 24px rgba(236,34,31,0.08); overflow: hidden;">
                <tr>
                  <td style="background: ${alertColor}; padding: 2rem 0;">
                    <h1 style="color: #fff; font-size: 2.2rem; margin: 0; font-weight: 700; letter-spacing: 1px; text-align: center;">
                      ${alertIcon} TERPLAC
                    </h1>
                    <p style="color: #fff; font-size: 1.1rem; margin: 0.5rem 0 0 0; text-align: center; font-weight: 600;">
                      ${alertTitle}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 2rem 2.5rem 1rem 2.5rem;">
                    <h2 style="color: ${alertColor}; font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 600; text-align: center;">
                      Alerta en Orden ${ordenId}
                    </h2>
                    <p style="color: #fff; font-size: 1.1rem; margin-bottom: 1.5rem; text-align: center;">
                      ${mensaje}
                    </p>
                    
                    <div style="background: #1a1a1a; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; border-left: 4px solid ${alertColor};">
                      <h3 style="color: ${alertColor}; font-size: 1.2rem; margin: 0 0 1rem 0; font-weight: 600;">
                        Detalles de la Alerta
                      </h3>
                      
                      <table style="width: 100%; color: #ccc; font-size: 0.95rem;">
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Orden ID:</td>
                          <td style="padding: 0.3rem 0; color: ${alertColor}; font-weight: 600;">${ordenId}</td>
                        </tr>
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Tipo de Alerta:</td>
                          <td style="padding: 0.3rem 0;">${alertTitle}</td>
                        </tr>
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Prioridad:</td>
                          <td style="padding: 0.3rem 0; color: ${prioridad === "crítica" ? "#DC3545" : "#FFA500"}; font-weight: 600; text-transform: uppercase;">
                            ${prioridad}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Fecha:</td>
                          <td style="padding: 0.3rem 0;">${new Date(fecha_creacion).toLocaleString("es-ES")}</td>
                        </tr>
                        ${observaciones ? `
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff; vertical-align: top;">Observaciones:</td>
                          <td style="padding: 0.3rem 0;">${observaciones}</td>
                        </tr>
                        ` : ""}
                      </table>

                      ${productosAfectados}
                    </div>
                    
                    <div style="text-align: center; margin: 2rem 0;">
                      <a href="http://localhost:3000/dashboard" style="display:inline-block; padding: 14px 32px; background: ${alertColor}; color: #fff; font-size: 1.1rem; font-weight: 600; border-radius: 6px; text-decoration: none; box-shadow: 0 2px 8px rgba(236,34,31,0.10);">
                        Ver Dashboard
                      </a>
                    </div>
                    
                    <p style="color: #ccc; font-size: 0.98rem; margin-bottom: 0.5rem; text-align: center;">
                      Revisa el dashboard para más detalles y tomar las acciones necesarias.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background: #1a1a1a; padding: 1.2rem 2.5rem; border-top: 1px solid #222; color: #ccc; font-size: 0.95rem; text-align: center;">
                    Esta es una alerta automática del sistema de gestión TERPLAC.
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

// Nueva función para notificar recepción exitosa de despacho
export async function sendDespachoRecepcionExitosaEmail({ to, notificacion }) {
  const {
    ordenId,
    productos_recibidos = [],
    observaciones,
    fecha_creacion,
    tienda,
    vendedora
  } = notificacion;

  await transporter.sendMail({
    to,
    subject: `✅ TERPLAC - Recepción Exitosa - Orden ${ordenId}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; background: #fff; padding: 0; margin: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #fff; padding: 0; margin: 0;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 2rem auto; background: #111; border-radius: 12px; box-shadow: 0 4px 24px rgba(40,167,69,0.08); overflow: hidden;">
                <tr>
                  <td style="background: #28a745; padding: 2rem 0;">
                    <h1 style="color: #fff; font-size: 2.2rem; margin: 0; font-weight: 700; letter-spacing: 1px; text-align: center;">
                      ✅ TERPLAC
                    </h1>
                    <p style="color: #fff; font-size: 1.1rem; margin: 0.5rem 0 0 0; text-align: center; font-weight: 600;">
                      Recepción Exitosa
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 2rem 2.5rem 1rem 2.5rem;">
                    <h2 style="color: #28a745; font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 600; text-align: center;">
                      Orden ${ordenId} Recibida Correctamente
                    </h2>
                    <p style="color: #fff; font-size: 1.1rem; margin-bottom: 1.5rem; text-align: center;">
                      Todos los productos han sido recibidos sin inconvenientes en la tienda.
                    </p>
                    
                    <div style="background: #1a1a1a; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; border-left: 4px solid #28a745;">
                      <h3 style="color: #28a745; font-size: 1.2rem; margin: 0 0 1rem 0; font-weight: 600;">
                        Detalles de la Recepción
                      </h3>
                      
                      <table style="width: 100%; color: #ccc; font-size: 0.95rem;">
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Orden ID:</td>
                          <td style="padding: 0.3rem 0; color: #28a745; font-weight: 600;">${ordenId}</td>
                        </tr>
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Estado:</td>
                          <td style="padding: 0.3rem 0; color: #28a745; font-weight: 600;">RECIBIDO CORRECTAMENTE</td>
                        </tr>
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Tienda:</td>
                          <td style="padding: 0.3rem 0;">${tienda || 'No especificada'}</td>
                        </tr>
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Recibido por:</td>
                          <td style="padding: 0.3rem 0;">${vendedora || 'No especificado'}</td>
                        </tr>
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff;">Fecha de Recepción:</td>
                          <td style="padding: 0.3rem 0;">${new Date(fecha_creacion).toLocaleString("es-ES")}</td>
                        </tr>
                        ${observaciones ? `
                        <tr>
                          <td style="padding: 0.3rem 0; font-weight: 600; color: #fff; vertical-align: top;">Observaciones:</td>
                          <td style="padding: 0.3rem 0;">${observaciones}</td>
                        </tr>
                        ` : ""}
                      </table>

                      ${productos_recibidos.length > 0 ? `
                        <h4 style="color: #28a745; margin: 1rem 0 0.5rem 0;">Productos Recibidos:</h4>
                        <ul style="color: #ccc; margin: 0;">
                          ${productos_recibidos.map(p => `<li>${p.tipo} - ${p.modelo} (Cantidad: ${p.cantidad})</li>`).join("")}
                        </ul>
                      ` : ""}
                    </div>
                    
                    <div style="text-align: center; margin: 2rem 0;">
                      <a href="http://localhost:3000/dashboard" style="display:inline-block; padding: 14px 32px; background: #28a745; color: #fff; font-size: 1.1rem; font-weight: 600; border-radius: 6px; text-decoration: none; box-shadow: 0 2px 8px rgba(40,167,69,0.10);">
                        Ver Dashboard
                      </a>
                    </div>
                    
                    <p style="color: #ccc; font-size: 0.98rem; margin-bottom: 0.5rem; text-align: center;">
                      El despacho se ha completado exitosamente sin inconvenientes.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background: #1a1a1a; padding: 1.2rem 2.5rem; border-top: 1px solid #222; color: #ccc; font-size: 0.95rem; text-align: center;">
                    Esta es una confirmación automática del sistema de gestión TERPLAC.
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

export async function sendForgotPasswordEmail(email, token) {
  const resetLink = `${process.env.VITE_API_BASE_URL}/recover-password?token=${token}`;
  await transporter.sendMail({
    to: email,
    subject: "Recupera tu contraseña en TERPLAC",
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
                    <h2 style="color: #fff; font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 600; text-align: center;">Recupera tu contraseña</h2>
                    <p style="color: #fff; font-size: 1.1rem; margin-bottom: 1.5rem; text-align: center;">
                      Se ha solicitado reestablecer la contraseña de tu cuenta. Haz clic en el botón de abajo para crear una nueva contraseña:
                    </p>
                    <div style="text-align: center; margin: 2rem 0;">
                      <a href="${resetLink}" style="display:inline-block; padding: 14px 32px; background: #EC221F; color: #fff; font-size: 1.1rem; font-weight: 600; border-radius: 6px; text-decoration: none; box-shadow: 0 2px 8px rgba(236,34,31,0.10); transition: background 0.2s;">Reestablecer contraseña</a>
                    </div>
                    <p style="color: #ccc; font-size: 0.98rem; margin-bottom: 0.5rem; text-align: center;">
                      Si no solicitaste este cambio, puedes ignorar este correo.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background: #1a1a1a; padding: 1.2rem 2.5rem; border-top: 1px solid #222; color: #ccc; font-size: 0.95rem; text-align: center;">
                    El enlace expirará en 10 minutos por seguridad.
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
