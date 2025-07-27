import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/configDb.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productoRoutes from "./routes/producto.routes.js";
import productoPersonalizadoRoutes from "./routes/producto_personalizado.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import fileUploadRoutes from "./routes/fileUpload.routes.js";
import productoDestacadoRoutes from "./routes/producto_destacado.routes.js";
import orderRoutes from "./routes/order.routes.js"; // Import order routes for Mercado Pago

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productoRoutes);
app.use("/api/productos-destacados", productoDestacadoRoutes);
app.use("/api/productos-personalizados", productoPersonalizadoRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", fileUploadRoutes);
app.use("/api/orders", orderRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API de Terplac" });
});

export default app;