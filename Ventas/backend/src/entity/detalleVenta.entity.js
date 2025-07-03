// src/entity/detalleVenta.entity.js
"use strict";
import { EntitySchema } from "typeorm";
import VentaSchema from "./venta.entity.js"; 
import ProductoSchema from "./producto.entity.js"; 

const DetalleVentaSchema = new EntitySchema({
  name: "DetalleVenta",
  tableName: "detalles_venta",
  columns: {
    id_detalle_venta: {
      type: "int",
      primary: true,
      generated: true,
    },
    cantidad: {
      type: "int",
      nullable: false,
    },
    precio_unitario: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    subtotal: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
      default: 0,
    },
  },
  relations: {
    venta: {
      type: "many-to-one",
      target: VentaSchema,
      joinColumn: { name: "id_venta" },
      inverseSide: "detalles",
      nullable: false,
    },
    producto: {
      type: "many-to-one",
      target: ProductoSchema,
      joinColumn: { name: "id_producto" },
      inverseSide: "detalles_venta",
      nullable: false,
    },
  },
});

export default DetalleVentaSchema;
