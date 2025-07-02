"use strict"
import { EntitySchema } from "typeorm";
const RellenoSchema = new EntitySchema({
    name: "Relleno",
    tableName: "rellenos",
    columns: {
        id_relleno: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_relleno: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        caracteristicas: {
            type: "text",
            nullable: true,
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
});

export default RellenoSchema;