"use strict";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const _filename = fileURLToPath(import.meta.url);

const _dirname = path.dirname(_filename);

const envFilePath = path.resolve(_dirname, "../../.env");

dotenv.config({ path: envFilePath });

export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const DB_USERNAME = process.env.DB_USERNAME;
export const PASSWORD = process.env.PASSWORD;
export const DATABASE = process.env.DATABASE;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const cookieKey = process.env.cookieKey;
export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
export const FACEBOOK_CALLBACK_URL = process.env.FACEBOOK_CALLBACK_URL;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;   
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;
export const SMTP_SECURE = process.env.SMTP_SECURE;
export const VITE_API_BASE_URL = process.env.VITE_API_BASE_URL;
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
export const FRONTEND_URL = process.env.FRONTEND_URL;

// MinIO Configuration
export const UPLOAD_DRIVER = process.env.UPLOAD_DRIVER || "local";
export const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT;
export const MINIO_PORT = process.env.MINIO_PORT;
export const MINIO_USE_SSL = process.env.MINIO_USE_SSL;
export const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
export const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;
export const MINIO_BUCKET = process.env.MINIO_BUCKET;
export const MINIO_PUBLIC_URL = process.env.MINIO_PUBLIC_URL;