// src/entity/userEvent.entity.ts
"use strict";
import { EntitySchema } from "typeorm";

const UserEventSchema = new EntitySchema({
  name: "UserEvent",
  tableName: "eventos_usuario",
  columns: {
    id_evento: {
      type: "int",
      primary: true,
      generated: true,
    },
    tipo_evento: {
      type: "varchar",
      length: 50, // Ej: PRODUCT_VIEW, PRODUCT_BUY
    },
    fecha: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    metadata: {
      type: "jsonb",
      nullable: true, // puedes guardar info como cantidad, desde qué página, etc.
    },
  },
  relations: {
    usuario: {
      type: "many-to-one",
      target: "Usuario",
      joinColumn: { name: "id_usuario" },
    },
    producto: {
      type: "many-to-one",
      target: "Producto",
      joinColumn: { name: "id_producto" },
      nullable: true,
    },
  },
});

export default UserEventSchema;
