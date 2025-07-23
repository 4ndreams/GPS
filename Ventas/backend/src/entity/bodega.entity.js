"use strict";
import { EntitySchema } from "typeorm";


const BodegaSchema = new EntitySchema({
  name: "Bodega",
  tableName: "bodega",
  columns: {
    id_bodega: {
      type: "int",
      primary: true,
      generated: true,
    },
    stock: {
      type: "int",
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
    producto: {
      type: "many-to-one",
      target: "Producto", // nombre del schema relacionado
      joinColumn: {
        name: "id_producto", // esta es la columna que actúa como FK en esta tabla
        referencedColumnName: "id_producto",
      },
      nullable: true, // ✅ esto permite que la relación sea opcional
      eager: false,
    },
    material: {
    type: "many-to-one",
    target: "Material",
    joinColumn: {
      name: "id_material",
      referencedColumnName: "id_material",
    },
    nullable: true,
  },
  relleno: {
    type: "many-to-one",
    target: "Relleno",
    joinColumn: {
      name: "id_relleno",
      referencedColumnName: "id_relleno",
    },
    nullable: true,
  },
  compra: {
      type: "one-to-many",
      target: "Compra",
      inverseSide: "bodega",
      cascade: true,
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

