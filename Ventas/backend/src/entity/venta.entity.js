"use strict";
import { EntitySchema } from "typeorm";

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
            default: "Pendiente",
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
