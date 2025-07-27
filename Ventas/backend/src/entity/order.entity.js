import { EntitySchema } from "typeorm";

export const OrderEntity = new EntitySchema({
    name: "Order",
    tableName: "orders", // Tabla diferente para evitar conflicto con 'ordenes'
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        contactInfo: {
            type: "jsonb",
            nullable: false,
        },
        items: {
            type: "jsonb",
            nullable: false,
        },
        total: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
        },
        cantidad: {
            type: "int",
            nullable: false,
            default: 1,
        },
        status: {
            type: "enum",
            enum: ["pending", "paid", "failed", "cancelled"],
            default: "pending",
        },
        paymentId: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        preferenceId: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        createdAt: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
        },
        updatedAt: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
        },
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "Usuario",
            joinColumn: { name: "id_usuario" },
            nullable: true,
        },
    },
});
