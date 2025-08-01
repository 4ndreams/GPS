"use strict";
import { EntitySchema } from "typeorm";
import MaterialSchema from "./material.entity.js";
import TipoSchema from "./tipo.entity.js";
import RellenoSchema from "./relleno.entity.js";
import ImagenesSchema from "./imagenes.entity.js";
const ProductoSchema = new EntitySchema({
    name: "Producto",
    tableName: "productos",
    columns: {
        id_producto: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_producto: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        precio: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
        },
        stock: {
            type: "int",
            default: 0,
            nullable: false,
        },
        descripcion: {
            type: "text",
            nullable: true,
        },
        medida_ancho: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: true,
        },
        medida_largo: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: true,
        },
        medida_alto: {
            type: "decimal",
            precision: 10,
            scale: 2,
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
    relations: {
        material: {
            type: "many-to-one",
            target: MaterialSchema,
            joinColumn: {
                name: "id_material",
            },
            inverseSide: "materiales",
            nullable: false
        },
        relleno: {
            type: "many-to-one",
            target: RellenoSchema, 
            joinColumn: {
                name: "id_relleno",
            },
            inverseSide: "rellenos",
            nullable: false
        },
        tipo: {
            type: "many-to-one",
            target: TipoSchema,
            joinColumn: {
                name: "id_tipo",
            },
            inverseSide: "productos",
            nullable: false
        },
        imagenes: {
            type: "one-to-many",
            target: ImagenesSchema,
            inverseSide: "producto",
            cascade: true,
        },
    },
});
export default ProductoSchema;