"use strict";
import { EntitySchema } from "typeorm";

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
