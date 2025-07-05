import { Router } from "express";
import { 
    getImagenController, 
    getImagenesController, 
    getImagenesByProductoController,
    deleteImagenController, 
    updateImagenController, 
    createImagenController 
} from "../controllers/imagenes.controller.js";

const router = Router();

router
    .get("/", getImagenesController)
    .get("/:id_img", getImagenController)
    .get("/producto/:id_producto", getImagenesByProductoController)
    .post("/", createImagenController)
    .put("/:id_img", updateImagenController)
    .delete("/:id_img", deleteImagenController);

export default router;