
import TestEntity from "../entity/test.entity.js";
import { AppDataSource } from "./configDb.js";
import Producto from "../entity/producto.entity.js";
import MaterialSchema from "../entity/material.entity.js";
import TipoSchema from "../entity/tipo.entity.js";

async function testConnection() {
  try {
    // Test entity (demo)
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

    // Inicialización de materiales, tipos y productos
    const materialRepo = AppDataSource.getRepository(MaterialSchema);
    const tipoRepo = AppDataSource.getRepository(TipoSchema);
    const productoRepo = AppDataSource.getRepository(Producto);

    // Materiales de ejemplo
    const materialesEjemplo = [
      { nombre_material: "Madera Wenge", caracteristicas: "Resistente y elegante" },
      { nombre_material: "Vidrio Templado", caracteristicas: "Alta seguridad y transparencia" },
      { nombre_material: "Roble Sólido", caracteristicas: "Madera maciza de alta calidad" },
      { nombre_material: "Acero Reforzado", caracteristicas: "Ideal para puertas de seguridad" },
      { nombre_material: "MDF Blanco", caracteristicas: "Acabado moderno y liso" },
    ];
    // Tipos de ejemplo
    const tiposEjemplo = [
      { nombre_tipo: "puertas" },
      { nombre_tipo: "molduras" },
    ];

    // Insertar materiales si la tabla está vacía
    const matCount = await materialRepo.count();
    if (matCount === 0) {
      await materialRepo.save(materialesEjemplo);
      console.log("=> Materiales de ejemplo insertados correctamente.");
    } else {
      console.log("=> Ya existen materiales en la base de datos.");
    }

    // Insertar tipos si la tabla está vacía
    const tipoCount = await tipoRepo.count();
    if (tipoCount === 0) {
      await tipoRepo.save(tiposEjemplo);
      console.log("=> Tipos de ejemplo insertados correctamente.");
    } else {
      console.log("=> Ya existen tipos en la base de datos.");
    }

    // Insertar rellenos si la tabla está vacía
    const rellenoRepo = AppDataSource.getRepository("Relleno");
    const rellenosEjemplo = [
      { nombre_relleno: "Relleno Sólido", caracteristicas: "Relleno de madera sólida" },
      { nombre_relleno: "Relleno Hueco", caracteristicas: "Relleno hueco para puertas ligeras" },
      { nombre_relleno: "Relleno Aislante", caracteristicas: "Relleno con propiedades aislantes" },
    ];
    
    const rellenoCount = await rellenoRepo.count();
    if (rellenoCount === 0) {
      await rellenoRepo.save(rellenosEjemplo);
      console.log("=> Rellenos de ejemplo insertados correctamente.");
    } else {
      console.log("=> Ya existen rellenos en la base de datos.");
    }

    // Insertar productos si la tabla está vacía
    const prodCount = await productoRepo.count();
    if (prodCount === 0) {
      // Obtener materiales, tipos y rellenos actualizados
      const materiales = await materialRepo.find();
      const tipos = await tipoRepo.find();
      const rellenos = await rellenoRepo.find();
      const matMap = Object.fromEntries(materiales.map(m => [m.nombre_material, m]));
      const tipoMap = Object.fromEntries(tipos.map(t => [t.nombre_tipo, t]));
      const rellenoMap = Object.fromEntries(rellenos.map(r => [r.nombre_relleno, r]));

      const productosEjemplo = [
        {
          nombre_producto: 'Puerta Geno Enchape Wenge',
          precio: 105000,
          stock: 10,
          descripcion: 'Puerta de madera wenge, diseño moderno y resistente.',
          medida_ancho: 90.0,
          medida_largo: 210.0,
          medida_alto: 4.0,
          imagen_producto: '1.png',
          material: matMap["Madera Wenge"],
          relleno: rellenoMap["Relleno Sólido"],
          tipo: tipoMap["puertas"],
        },
        {
          nombre_producto: 'Puerta Moderna Vidrio',
          precio: 210000,
          stock: 5,
          descripcion: 'Puerta moderna con panel de vidrio templado.',
          medida_ancho: 95.0,
          medida_largo: 210.0,
          medida_alto: 4.5,
          imagen_producto: '2.jpeg',
          material: matMap["Vidrio Templado"],
          relleno: rellenoMap["Relleno Hueco"],
          tipo: tipoMap["puertas"],
        },
        {
          nombre_producto: 'Moldura Roble 2m',
          precio: 45000,
          stock: 8,
          descripcion: 'Moldura de roble sólido, longitud 2 metros.',
          medida_ancho: 5.0,
          medida_largo: 200.0,
          medida_alto: 2.0,
          imagen_producto: 'm1.jpg',
          material: matMap["Roble Sólido"],
          relleno: rellenoMap["Relleno Sólido"],
          tipo: tipoMap["molduras"],
        },
        {
          nombre_producto: 'Marco Roble Sólido',
          precio: 75000,
          stock: 12,
          descripcion: 'Marco de roble sólido para puertas o ventanas.',
          medida_ancho: 7.0,
          medida_largo: 210.0,
          medida_alto: 3.0,
          imagen_producto: 'm2.jpeg',
          material: matMap["Roble Sólido"],
          relleno: rellenoMap["Relleno Sólido"],
          tipo: tipoMap["molduras"],
        },
        {
          nombre_producto: 'Puerta Seguridad Acero',
          precio: 320000,
          stock: 7,
          descripcion: 'Puerta de seguridad fabricada en acero reforzado.',
          medida_ancho: 92.0,
          medida_largo: 210.0,
          medida_alto: 5.0,
          imagen_producto: '3.jpeg',
          material: matMap["Acero Reforzado"],
          relleno: rellenoMap["Relleno Aislante"],
          tipo: tipoMap["puertas"],
        },
        {
          nombre_producto: 'Moldura Blanca Moderna',
          precio: 38000,
          stock: 15,
          descripcion: 'Moldura blanca de MDF, ideal para ambientes modernos.',
          medida_ancho: 4.0,
          medida_largo: 200.0,
          medida_alto: 1.8,
          imagen_producto: 'm3.jpg',
          material: matMap["MDF Blanco"],
          relleno: rellenoMap["Relleno Hueco"],
          tipo: tipoMap["molduras"],
        },
      ];
      await productoRepo.save(productosEjemplo);
      console.log("=> Productos de ejemplo insertados correctamente.");
    } else {
      console.log("=> Ya existen productos en la base de datos.");
    }
  } catch (error) {
    console.error("Error al inicializar datos de ejemplo:", error);
  }
}
export { testConnection };