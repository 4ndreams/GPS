"use strtict";
import { EntitySchema } from "typeorm";
import VentaSchema from "./venta.entity.js";
import ProductoSchema from "./producto.entity.js";

const ItemCarritoSchema = new EntitySchema({

    name: "ItemCarrito",
    tableName: "item_carrito",
    columns: {
        id_item_carrito: {
            type: "int",
            primary: true,
            generated: true,
        },
        id_producto: {
            type: "int",
            nullable: false,
        },
        cantidad: {
            type: "int",
            nullable: false,
        },
        precio: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
        },
        id_venta: {
            type: "int",
            nullable: false,
        },
    },
    relations: {
        venta: {
            target: VentaSchema,
            type: "many-to-one",
            joinColumn: { name: "id_venta" },
            cascade: true,
        },
        producto: {
            target: ProductoSchema,
            type: "many-to-one",
            joinColumn: { name: "id_producto" },
            cascade: true,
        },
    },
    indices: [
        {
            name: "idx_item_carrito_id",
            columns: ["id_item_carrito"],
            unique: true,
        },
        {
            name: "idx_item_carrito_id_producto",
            columns: ["id_producto"],
        },
        {
            name: "idx_item_carrito_id_venta",
            columns: ["id_venta"],
        },
    ],
})

export default ItemCarritoSchema;