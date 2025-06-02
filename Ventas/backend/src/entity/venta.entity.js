"use strict";
import { EntitySchema } from "typeorm";
import { ClienteSchema } from "./clientes.entity.js";


const VentaSchema = new EntitySchema({
    name: "Venta",
    tableName: "venta",
    columns: {
        id_venta: {
            type: "int",
            primary: true,
            generated: true,
        },
        fecha_solicitud: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
       estado_pago: {
            type: "varchar",
            length: 20,
            nullable: false,
        },
        fecha_pago: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
        id_usuario: {
            type: "int",
            nullable: false,
        },
    },
    relations: {
        usuario: {
            target: "Usuario",
            type: "many-to-one",
            joinColumn: { name: "id_usuario" },
            cascade: true,
        },
    },
    indices: [
        {
            name: "idx_venta_id",
            columns: ["id_venta"],
            unique: true,
        },
        {
            name: "idx_venta_id_usuario",
            columns: ["id_usuario"],
        },
    ],
});

export default VentaSchema;
