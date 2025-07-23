"use strict";
import Producto from "../entity/producto.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getProductosService() {
  try {
    const repository = AppDataSource.getRepository(Producto);
    let productos = await repository.find({ relations: ["material", "tipo"] });

    // Si no hay productos, insertar materiales, tipos y productos de ejemplo
    if (!productos || productos.length === 0) {
      // Insertar materiales si no existen
      const materialRepo = AppDataSource.getRepository("Material");
      const tipoRepo = AppDataSource.getRepository("Tipo");

      const materialesEjemplo = [
        { nombre_material: "Madera Wenge", caracteristicas: "Resistente y elegante" },
        { nombre_material: "Vidrio Templado", caracteristicas: "Alta seguridad y transparencia" },
        { nombre_material: "Roble Sólido", caracteristicas: "Madera maciza de alta calidad" },
        { nombre_material: "Acero Reforzado", caracteristicas: "Ideal para puertas de seguridad" },
        { nombre_material: "MDF Blanco", caracteristicas: "Acabado moderno y liso" },
      ];
      const tiposEjemplo = [
        { nombre_tipo: "puertas" },
        { nombre_tipo: "molduras" },
      ];

      // Insertar materiales si no existen
      let materiales = await materialRepo.find();
      if (materiales.length < materialesEjemplo.length) {
        for (const mat of materialesEjemplo) {
          if (!materiales.find(m => m.nombre_material === mat.nombre_material)) {
            await materialRepo.save(materialRepo.create(mat));
          }
        }
        materiales = await materialRepo.find();
      }

      // Insertar tipos si no existen
      let tipos = await tipoRepo.find();
      if (tipos.length < tiposEjemplo.length) {
        for (const t of tiposEjemplo) {
          if (!tipos.find(tp => tp.nombre_tipo === t.nombre_tipo)) {
            await tipoRepo.save(tipoRepo.create(t));
          }
        }
        tipos = await tipoRepo.find();
      }

      // Mapear materiales y tipos por nombre para fácil acceso
      const matMap = Object.fromEntries(materiales.map(m => [m.nombre_material, m]));
      const tipoMap = Object.fromEntries(tipos.map(t => [t.nombre_tipo, t]));

      // Productos de ejemplo
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
          tipo: tipoMap["molduras"],
        },
      ];

      for (const prod of productosEjemplo) {
        const nuevo = repository.create(prod);
        await repository.save(nuevo);
      }
      productos = await repository.find({ relations: ["material", "tipo"] });
    }

    return [productos, null];
  } catch (error) {
    return [null, "Error al obtener productos"];
  }
}

export async function getProductoByIdService(id_producto) {
  try {
    const repository = AppDataSource.getRepository(Producto);
    const producto = await repository.findOneBy({ id_producto });
    return producto ? [producto, null] : [null, "Producto no encontrado"];
  } catch (error) {
    return [null, "Error al buscar producto"];
  }
}

export async function createProductoService(body) {
  try {
    const repository = AppDataSource.getRepository(Producto);
    

    const Material = await AppDataSource.getRepository("Material");
    const Tipo = await AppDataSource.getRepository("Tipo");
    const Relleno = await AppDataSource.getRepository("Relleno");
  
    const material = await Material.findOneBy({ id_material: body.id_material });
    const tipo = await Tipo.findOneBy({ id_tipo: body.id_tipo });
    const relleno = await Relleno.findOneBy({ id_relleno: body.id_relleno });
      
    const nuevo = repository.create(
      {
        ...body,
        material: material ? { id_material: material.id_material } : null,
        tipo: tipo ? { id_tipo: tipo.id_tipo } : null,
        relleno: relleno ? { id_relleno: relleno.id_relleno } : null,
        createdAt: new Date(), 
        updatedAt: new Date()
      });
    await repository.save(nuevo);
    
const productoCompleto = await repository.findOne({
  where: { id_producto: nuevo.id_producto },
  relations: ["material", "tipo", "relleno"]
});

return [productoCompleto, null];
  } catch (error) {
    return [null, "Error al crear producto"];
  }
}

export async function updateProductoService(id_producto, body) {
  try {
    const repository = AppDataSource.getRepository(Producto);
    await repository.update({ id_producto }, body);
    const updated = await repository.findOneBy({ id_producto });
    return updated ? [updated, null] : [null, "Producto no encontrado"];
  } catch (error) {
    return [null, "Error al actualizar producto"];
  }
}

export async function deleteProductoService(id_producto) {
  try {
    const repository = AppDataSource.getRepository(Producto);
    const encontrado = await repository.findOneBy({ id_producto });
    if (!encontrado) return [null, "Producto no encontrado"];
    await repository.remove(encontrado);
    return [encontrado, null];
  } catch (error) {
    return [null, "Error al eliminar producto"];
  }
}
