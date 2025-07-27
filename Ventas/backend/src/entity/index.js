// Archivo para importar explícitamente las entidades principales
import { OrderEntity } from "./order.entity.js";
import OrdenSchema from "./orden.entity.js";
import UsuarioSchema from "./user.entity.js";
import ProductoSchema from "./producto.entity.js";

export const AllEntities = [
  OrderEntity,        // Para ventas online (tabla: orders)
  OrdenSchema,        // Para gestión de órdenes/inventario (tabla: ordenes)
  UsuarioSchema,
  ProductoSchema,
];
