"use strict";
import { EntitySchema } from "typeorm";
import BodegaSchema from "./bodega.entity.js";
import UsuarioSchema from "./user.entity.js";
import ProductoSchema from "./producto.entity.js";

const OrdenSchema = new EntitySchema({
  name: "Orden",
  tableName: "ordenes",
  columns: {
    id_orden: {
      type: "int",
      primary: true,
      generated: true,
    },
    id: {
      type: "int",
      generated: true,
    },
    cantidad: {
      type: "int",
      nullable: false,
    },
    total: {
      type: "decimal",
      precision: 10,
      scale: 2,
      default: 0,
      nullable: false,
    },
    origen: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    destino: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    fecha_envio: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    fecha_entrega: {
      type: "timestamp with time zone",
      nullable: true,
    },
    estado: {
      type: "varchar",
      length: 50,
      default: "Pendiente",
      nullable: false,
    },
    status: {
      type: "varchar",
      length: 50,
      default: "pending",
      nullable: false,
    },
    paymentId: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    preferenceId: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    prioridad: {
      type: "varchar",
      length: 20,
      default: "Media",
      nullable: true,
    },
    transportista: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    tipo: {
      type: "varchar",
      length: 50,
      default: "normal",
      nullable: true,
    },
    observaciones: {
      type: "varchar",
      length: 500,
      nullable: true
    },
    foto_despacho: {
      type: "text",
      nullable: true
    },
    items: {
      type: "text",
      nullable: true,
    },
    contactInfo: {
      type: "varchar",
      length: 500,
      nullable: true,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
     id_usuario: {
      type: "int",
      nullable: false,
    },
    id_bodega: {
      type: "int",
      nullable: false,
    },
    id_producto: {
      type: "int",
      nullable: false,
    },
  },
  relations: {
    usuario: {
      type: "many-to-one",
      target: UsuarioSchema,
      joinColumn: {
        name: "id_usuario",
      },
      nullable: false,
    },
    bodega: {
      type: "many-to-one",
      target: BodegaSchema, 
      joinColumn: {
        name: "id_bodega",
      },
      nullable: false,
    },
    producto: {
      type: "many-to-one",
      target: ProductoSchema, 
      joinColumn: {
        name: "id_producto",
      },
      nullable: false,
    },
  },
  indices: [
    {
      name: "idx_orden_id",
      columns: ["id_orden"],
      unique: true,
    },
    {
      name: "idx_orden_bodega",
      columns: ["id_bodega"],
    },
    {
      name: "idx_orden_producto",
      columns: ["id_producto"],
    },
    {
      name: "idx_orden_usuario",
      columns: ["id_usuario"],
    },
  ],
});

export default OrdenSchema;
