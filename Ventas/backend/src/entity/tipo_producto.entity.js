"use strict";
import { EntitySchema } from "typeorm";

const TipoProductoSchema = new EntitySchema({
  name: "TipoProducto",
  tableName: "tipo_producto",
  columns: {
    id_tipo_producto: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre_tipo: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
  },
  indices: [
    {
      name: "idx_tipo_producto_id",
      columns: ["id_tipo_producto"],
      unique: true,
    },
  ],
});

export default TipoProductoSchema;
