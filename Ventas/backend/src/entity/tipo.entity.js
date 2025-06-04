"use strict";
import { EntitySchema } from "typeorm";

const TipoSchema = new EntitySchema({
    name: "Tipo",
    tableName: "tipos",
    columns: {
        id_tipo: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre_tipo: {
            type: "varchar",
            length: 255,
            nullable: false,
        }
    },
});

export default TipoSchema;