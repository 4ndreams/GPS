"use strict";
import { EntitySchema } from "typeorm";
import VentaSchema from "./venta.entity.js";

const ClienteSchema = new EntitySchema({
  name: "Cliente",
  tableName: "clientes",
  columns: {
    id_cliente: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    apellido: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    rut: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    correo: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    numero_contacto: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    id_venta: {
      type: "int",
      nullable: false,
    },
  },
  relations: {
    venta: {
      type: "many-to-one",
      target: VentaSchema,
      joinColumn: {
        name: "id_venta",
      },
      nullable: false,
    },
  },
  indices: [
    {
      name: "idx_cliente_id",
      columns: ["id_cliente"],
      unique: true,
    },
  ],
});

export default ClienteSchema;
