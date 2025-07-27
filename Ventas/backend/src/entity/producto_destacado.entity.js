import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "ProductoDestacado",
  tableName: "producto_destacado",
  columns: {
    id_destacado: {
      primary: true,
      type: "int",
      generated: true,
    },
    orden: {
      type: "int",
      nullable: false,
      default: 0,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    producto: {
      type: "many-to-one",
      target: "Producto",
      joinColumn: { name: "id_producto" },
      eager: true,
    },
  },
});
