import TestEntity from "../entity/test.entity.js";
import { AppDataSource } from "./configDb.js";

async function testConnection() {
  try {
    const testRepository = AppDataSource.getRepository(TestEntity);
    const count = await testRepository.count();
    if (count === 0) {
      const testData = [
        { name: "Test 1", description: "Description for Test 1" },
        { name: "Test 2", description: "Description for Test 2" },
      ];
      await testRepository.save(testData);
      console.log("=> Datos de prueba insertados correctamente.");
    } else {
      console.log("=> Ya existen datos de prueba en la base de datos.");
    }
    } catch (error) {
    console.error("Error al insertar datos de prueba:", error);
  }
}
export {testConnection};