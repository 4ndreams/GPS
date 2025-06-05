import nodemailer from "nodemailer";
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } from "../config/configEnv.js";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error conectando al servidor SMTP:", error);
  } else {
    console.log("Conexión SMTP establecida correctamente.");
  }
});

export default transporter;