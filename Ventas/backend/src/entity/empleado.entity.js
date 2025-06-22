"use strict";
import { EntitySchema } from "typeorm";

const EmpleadoSchema = new EntitySchema({
  name: "Empleado",
  tableName: "empleados",
  columns: {
    id_empleado: {
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
    rol: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
  },
  indices: [
    {
      name: "idx_empleado_id",
      columns: ["id_empleado"],
      unique: true,
    },
  ],
});

export default EmpleadoSchema;
