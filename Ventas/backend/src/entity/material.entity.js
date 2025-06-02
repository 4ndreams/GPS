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
    });