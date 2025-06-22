"use strict";
import { EntitySchema } from "typeorm";
import ProductoSchema from "./producto.entity.js";

const ImagenSchema = new EntitySchema({
  name: "Imagen",
  tableName: "imagenes",
  columns: {
    id_img: {
      type: "int",
      primary: true,
      generated: true,
    },
    ruta_imagen: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    id_producto: {
      type: "int",
      nullable: false,
    },
  },
  relations: {
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
      name: "idx_img_id",
      columns: ["id_img"],
      unique: true,
    },
  ],
});

export default ImagenSchema;
