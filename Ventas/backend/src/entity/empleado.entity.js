"use strict";
import { EntitySchema } from "typeorm";

const EmpleadoSchema = new EntitySchema({
    name: "Empleado",
    tableName: "empleado",
    columns: {
        id_empleado: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        apellido: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        rut: {
            type: "varchar",
            length: 12,
            nullable: false,
            unique: true,
        },
        email: {
            type: "varchar",
            length: 150,
            nullable: false,
        },
      rol: {
        type: "varchar",
        length: 20,
        nullable: false,
      }
    },
    relations: {
        usuario: {
            target: "Usuario",
            type: "one-to-one",
            joinColumn: { name: "id_empleado" },
            cascade: true,
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