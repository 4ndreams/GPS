import { EntitySchema } from "typeorm";

const MensajeContactoSchema = new EntitySchema({
    
  name: "MensajeContacto",
  tableName: "mensajes_contacto",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 150,
      nullable: false,
    },
    telefono: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    mensaje: {
      type: "text",
      nullable: false,
    },
    creadoEn: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});

export default MensajeContactoSchema;