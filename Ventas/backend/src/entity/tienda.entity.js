"use strict";
import { EntitySchema } from "typeorm";

const TiendaSchema = new EntitySchema({
  name: "Tienda",
  tableName: "tiendas",
  columns: {
    id_tienda: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre_tienda: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    medida_ancho: {
      type: "int",
      nullable: true,
    },
    medida_espesor: {
      type: "int",
      nullable: true,
    },
    medida_alto: {
      type: "int",
      nullable: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    descripcion: {
      type: "text",
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
  indices: [
    {
      name: "idx_tienda_id",
      columns: ["id_tienda"],
      unique: true,
    },
  ],
});

export default TiendaSchema;