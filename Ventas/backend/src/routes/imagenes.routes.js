import { Router } from "express";
import multer from "multer"; // ⭐ para manejar archivos

import {
  getImagenController,
  getImagenesController,
  getImagenesByProductoController,
  deleteImagenController,
  updateImagenController,
  createImagenController,
} from "../controllers/imagenes.controller.js";

import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRoles } from "../middlewares/autorization.middleware.js";

const router = Router();

// ⭐ Configuración de multer (subida en memoria)
const upload = multer({ storage: multer.memoryStorage() });

router
  .get("/", getImagenesController) // Público - ver todas las imágenes
  .get("/:id_img", getImagenController) // Público - ver imagen específica
  .get("/producto/:id_producto", getImagenesByProductoController) // Público - ver imágenes de producto

  // ⭐ POST con imagen: se usa multer y middlewares de autenticación y rol
  .post(
    "/",
    authenticateJwt,
    authorizeRoles(["fabrica", "administrador"]),
    upload.single("file"),
    createImagenController
  )

  .put(
    "/:id_img",
    authenticateJwt,
    authorizeRoles(["fabrica", "administrador"]),
    updateImagenController
  )

  .delete(
    "/:id_img",
    authenticateJwt,
    authorizeRoles(["administrador"]),
    deleteImagenController
  );

export default router;
