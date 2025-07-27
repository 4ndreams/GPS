"use strict";
import { EntitySchema } from "typeorm";
import OrdenSchema from "./orden.entity.js";

const PhotoSchema = new EntitySchema({
  name: "Photo",
  tableName: "Photos",
  columns: {
    id_pht: {
      type: "int",
      primary: true,
      generated: true,
    },
    ruta_imagen: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    id_orden: {
      type: "int",
      nullable: false,
    },
  },
  relations: {
    orden: {
      type: "many-to-one",
      target: OrdenSchema,
      joinColumn: {
        name: "id_orden",
      },
      nullable: false,
    },
  },
});

export default PhotoSchema;
