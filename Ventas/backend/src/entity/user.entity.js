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
             default: "", // Agregado para evitar errores de null
        },
        rut: {
            type: "varchar",
            length: 12,
            nullable: true,
            unique: true,
        },
        email: {
            type: "varchar",
            length: 255,
            nullable: false,
            unique: true,
        },
        password: {
            type: "varchar",
            length: 255,
            nullable: true, //Por mientras, cuando se haga el front se cambiará a false
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
        intentosFallidos: {
            type: "int",
            default: 0,
            nullable: false,
        },
        fechaBloqueo: {
            type: "timestamp with time zone",
            nullable: true,
        },
        correoVerificado: {
            type: "boolean",
            default: false,
            nullable: false,
        },
        tokenVerificacion: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        verificacionTokenExpiracion: {
            type: "timestamp with time zone",
            nullable: true,
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
            name: "idx_usuario_email",
            columns: ["email"],
            unique: true,
        },
    ],
});

export default UsuarioSchema;
