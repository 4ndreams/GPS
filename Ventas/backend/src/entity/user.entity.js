"use strict";
import { EntitySchema } from "typeorm"
import ItemCarritoSchema from "./item_carrito.entity.js";
import VentaSchema from "./venta.entity.js";

const UsuarioSchema = new EntitySchema({
    name: "Usuario",
    tableName: "usuarios",
    columns: {
        id_usuario: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        apellidos: {
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
        correo: {
            type: "varchar",
            length: 255,
            nullable: false,
            unique: true,
        },
        password: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        flag_blacklist: {
            type: "boolean",
            default: false,
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
        rol: {
            type: "enum",
            enum: ["Cliente", "Empleado", "Administrador"],
            default: "Cliente",
            nullable: false,
        },
    },
    relations: {
        itemCarrito: {
            type: "one-to-many",
            target: ItemCarritoSchema,
            inverseSide: "venta",
        },
        venta: {
            type: "one-to-many",
            target: VentaSchema,
            joinColumn: {
                name: "id_usuario",
            },
            inverseSide: "usuario",
        },
    },
    indices: [
        {
            name: "idx_usuario_id",
            columns: ["id_usuario"],
            unique: true,
        },
        {
            name: "idx_usuario_rut",
            columns: ["rut"],
            unique: true,
        },
        {
            name: "idx_usuario_correo",
            columns: ["correo"],
            unique: true,
        },
    ],
});

export default UsuarioSchema;
