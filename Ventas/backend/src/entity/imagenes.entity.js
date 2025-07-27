"use strict";
import { EntitySchema } from "typeorm";

const ImagenesSchema = new EntitySchema({
  name: "Imagenes",
  tableName: "imagenes",
  columns: {
    id_img: {
      type: "int",
      primary: true,
      generated: true,
    },
    ruta_imagen: {
      type: "varchar",
      length: 500,
      nullable: true,
    },
    id_producto: {
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
      target: "Producto",
      joinColumn: {
        name: "id_producto",
      },
      nullable: false,
    },
  },
  indices: [
    {
      name: "idx_imagenes_id",
      columns: ["id_img"],
      unique: true,
    },
    {
      name: "idx_imagenes_producto",
      columns: ["id_producto"],
    },
  ],
});

export default ImagenesSchema;
