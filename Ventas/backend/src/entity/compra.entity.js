"use strict";
import { EntitySchema } from "typeorm";
import BodegaSchema from "./bodega.entity.js";

const CompraSchema = new EntitySchema({
  name: "Compra",
  tableName: "compras",
  columns: {
    id_compra: {
      type: "int",
      primary: true,
      generated: true,
    },
    id_bodega: {
      type: "int",
      nullable: true,
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
    costo_compra: {
      type: "numeric",
      nullable: false,
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
      name: "idx_compra_id",
      columns: ["id_compra"],
      unique: true,
    },
  ],
});

export default CompraSchema;
