"use strict";
import { EntitySchema } from "typeorm";
const MaterialSchema = new EntitySchema({
    name: "Material",
    tableName: "materiales",
    columns: {
        id_material: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_material: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        caracteristicas: {
            type: "text",
            nullable: true,
        }
    },
    indices: [
        {
            name: "idx_material_id",
            columns: ["id_material"],
            unique: true,
        },
    ],
    relations: {
        bodega: {
            type: "one-to-many",
            target: "Bodega",
            inverseSide: "material",
            cascade: true,
        },
        producto: {
            type: "one-to-many",
            target: "Producto",
            inverseSide: "material",
            cascade: true,
        },
    },
    });

    export default MaterialSchema;