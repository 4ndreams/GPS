"use strict";
import { EntitySchema } from "typeorm";
import BodegaSchema from "./bodega.entity.js";
import UsuarioSchema from "./user.entity.js";

const OrdenSchema = new EntitySchema({
  name: "Orden",
  tableName: "ordenes",
  columns: {
    id_orden: {
      type: "int",
      primary: true,
      generated: true,
    },
    cantidad: {
      type: "int",
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
    estado: {
      type: "varchar",
      length: 50,
      default: "Pendiente",
      nullable: false,
    },
    observaciones: {
      type: "varchar",
      length: 500,
      nullable: true
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
      name: "idx_orden_usuario",
      columns: ["id_usuario"],
    },
  ],
});

export default OrdenSchema;
