import { EntitySchema } from "typeorm";

export const TestEntity = new EntitySchema({
  name: "Test",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
      length: 100,
    },
    description: {
      type: String,
      length: 255,
    },
  },
});
export default TestEntity;
export const TestEntitySchema = {
  name: "Test",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
      length: 100,
    },
    description: {
      type: String,
      length: 255,
    },
  },
};