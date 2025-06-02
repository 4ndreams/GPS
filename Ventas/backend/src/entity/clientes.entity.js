"use strict";
import { EntitySchema } from "typeorm";

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
        id_venta: {
            type: "int",
            nullable: false,
        },

    },

       relations: {
        usuario: {
            target: "Usuario",
            type: "one-to-one",
            joinColumn: { name: "id_empleado" },
            cascade: true,
        },
        venta: {
            target: "Venta",
            type: "one-to-many",
            joinColumn: { name: "id_venta" },
            cascade: true,
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