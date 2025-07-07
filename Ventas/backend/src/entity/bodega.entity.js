"use strict";
import { EntitySchema } from "typeorm";
import ImagenSchema from "./imagen.entity.js"; // Asegúrate de que esta ruta sea correcta

const BodegaSchema = new EntitySchema({
  name: "Bodega",
  tableName: "bodegas",
  columns: {
    id_bodega: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre_producto: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    stock: {
      type: "int",
      nullable: false,
    },
    costo_total: {
      type: "numeric",
      nullable: false,
    },
    tipo_producto: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    medida_ancho: {
      type: "numeric",
      nullable: true,
    },
    medida_alto: {
      type: "numeric",
      nullable: true,
    },
    medida_espesor: {
      type: "numeric",
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
  },

  relations: {
    imagen: {
      type: "many-to-one",
      target: "Imagen", // nombre del schema relacionado
      joinColumn: {
        name: "id_img", // esta es la columna que actúa como FK en esta tabla
        referencedColumnName: "id_img",
      },
      nullable: true, // ✅ esto permite que la relación sea opcional
      eager: false,
    },
  },

  indices: [
    {
      name: "idx_bodega_id",
      columns: ["id_bodega"],
      unique: true,
    },
  ],
});

export default BodegaSchema;

