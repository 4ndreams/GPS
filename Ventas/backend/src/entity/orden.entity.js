"use strict";
import { EntitySchema } from "typeorm";
import Producto from "./producto.entity.js";
import Usuario from "./user.entity.js";


const OrdenSchema = new EntitySchema({
    name: "Orden",
    tableName: "ordenes",
    columns: {
        id_orden: {
            type: "int",
            primary: true,
            generated: true,
        },
        cantidad: {
            type: "int",
            nullable: false,
        },
        origen: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        destino: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        fecha_envio: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
        estado: {
            type: "varchar",
            length: 50,
            default: "Pendiente",
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
        usuario: {
            type: "many-to-one",
            target: "Usuario",
            joinColumn: {
                name: "id_usuario",
            },
            nullable: false,
        },
    },
    indices: [
        {
            name: "idx_orden_id",
            columns: ["id_orden"],
            unique: true,
        },
        {
            name: "idx_orden_producto",
            columns: ["id_producto"],
        },
        {
            name: "idx_orden_usuario",
            columns: ["id_usuario"],
        },
    ],
});

export default OrdenSchema;