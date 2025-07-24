import { connectDB, AppDataSource } from "./src/config/configDb.js";

// Funciones para determinar atributos
function determinarTipo(nombreProducto) {
  const nombre = nombreProducto.toLowerCase();
  
  if (nombre.includes('puerta') || 
      nombre.includes('geno') || 
      nombre.includes('castell') || 
      nombre.includes('alcala') || 
      nombre.includes('palos') || 
      nombre.includes('milano') || 
      nombre.includes('roma') || 
      nombre.includes('vero') || 
      nombre.includes('enchape') ||
      nombre.includes('vidrio') ||
      nombre.includes('lisa') ||
      nombre.includes('ranurada') ||
      nombre.includes('closet') ||
      nombre.includes('terciado') ||
      nombre.includes('luces') ||
      nombre.includes('mirilla')) {
    return 1; // puertas
  }
  
  return 2; // molduras
}

function determinarMaterial(nombreProducto) {
  const nombre = nombreProducto.toLowerCase();
  
  if (nombre.includes('wenge') || nombre.includes('wengue')) {
    return 1; // Madera Wenge
  } else if (nombre.includes('vidrio')) {
    return 2; // Vidrio Templado
  } else if (nombre.includes('roble')) {
    return 3; // Roble Sólido
  } else if (nombre.includes('acero') || nombre.includes('reforzado')) {
    return 4; // Acero Reforzado
  } else if (nombre.includes('mdf') || nombre.includes('blanco')) {
    return 5; // MDF Blanco
  } else if (nombre.includes('mara') || nombre.includes('enchape')) {
    return 1; // Madera Wenge (por defecto para enchapados)
  } else if (nombre.includes('cedro')) {
    return 3; // Roble Sólido (similar)
  } else {
    return 3; // Roble Sólido por defecto
  }
}

function determinarRelleno(nombreProducto, tipo) {
  const nombre = nombreProducto.toLowerCase();
  
  if (nombre.includes('seguridad') || nombre.includes('reforzad')) {
    return 2; // Macizo
  } else if (nombre.includes('closet') || nombre.includes('interior')) {
    return 1; // Panal de Abeja
  } else if (nombre.includes('terciado') || nombre.includes('corriente')) {
    return 5; // Tubular
  } else if (nombre.includes('vidrio')) {
    return 3; // Laminado
  } else if (tipo === 1) { // puertas
    return 2; // Macizo por defecto para puertas
  } else { // molduras
    return 1; // Panal de Abeja por defecto para molduras
  }
}

function generarDescripcion(nombreProducto, tipoNombre, materialNombre, rellenoNombre) {
  const nombre = nombreProducto.toLowerCase();
  
  let descripcion = `${nombreProducto} - `;
  
  if (tipoNombre === 'puertas') {
    descripcion += 'Puerta ';
    
    if (nombre.includes('doble')) {
      descripcion += 'doble hoja ';
    } else {
      descripcion += 'una hoja ';
    }
    
    if (nombre.includes('vidrio')) {
      descripcion += 'con vidrio ';
    }
    
    if (nombre.includes('seguridad')) {
      descripcion += 'de seguridad ';
    }
    
    if (nombre.includes('interior')) {
      descripcion += 'interior ';
    } else {
      descripcion += 'exterior ';
    }
    
  } else {
    descripcion += 'Moldura ';
  }
  
  descripcion += `fabricada en ${materialNombre.toLowerCase()} con relleno ${rellenoNombre.toLowerCase()}. `;
  
  // Añadir características específicas
  if (nombre.includes('enchape')) {
    descripcion += 'Acabado enchapado premium. ';
  }
  
  if (nombre.includes('ranurada')) {
    descripcion += 'Diseño con ranuras decorativas. ';
  }
  
  if (nombre.includes('lisa')) {
    descripcion += 'Superficie lisa y elegante. ';
  }
  
  if (nombre.includes('luces')) {
    descripcion += 'Con elementos de vidrio para iluminación. ';
  }
  
  descripcion += 'Ideal para construcción residencial y comercial.';
  
  return descripcion;
}

async function updateProductsComplete() {
  try {
    console.log("� Iniciando actualización completa de productos...");
    console.log("�🔍 Conectando a la base de datos...");
    await connectDB();
    console.log("✅ Conexión establecida\n");
    
    // Obtener repositorios
    const tipoRepo = AppDataSource.getRepository("Tipo");
    const materialRepo = AppDataSource.getRepository("Material");
    const rellenoRepo = AppDataSource.getRepository("Relleno");
    const productoRepo = AppDataSource.getRepository("Producto");
    
    // Primero crear rellenos si no existen
    console.log("🪵 Creando rellenos por defecto...");
    
    const rellenosData = [
      { id_relleno: 1, nombre_relleno: "Panal de Abeja", caracteristicas: "Ligero y resistente, ideal para puertas interiores" },
      { id_relleno: 2, nombre_relleno: "Macizo", caracteristicas: "Estructura sólida, máxima resistencia y durabilidad" },
      { id_relleno: 3, nombre_relleno: "Laminado", caracteristicas: "Láminas de madera intercaladas, balance entre peso y resistencia" },
      { id_relleno: 4, nombre_relleno: "Espuma de Poliuretano", caracteristicas: "Aislamiento térmico y acústico, liviano" },
      { id_relleno: 5, nombre_relleno: "Tubular", caracteristicas: "Estructura hueca con refuerzos internos, económico" }
    ];

    for (const rellenoData of rellenosData) {
      const existing = await rellenoRepo.findOne({ where: { id_relleno: rellenoData.id_relleno } });
      if (!existing) {
        const nuevoRelleno = rellenoRepo.create(rellenoData);
        await rellenoRepo.save(nuevoRelleno);
        console.log(`✅ Creado relleno: ${rellenoData.nombre_relleno}`);
      } else {
        console.log(`⚠️  Relleno ya existe: ${rellenoData.nombre_relleno}`);
      }
    }
    
    // Verificar tipos disponibles
    const tipos = await tipoRepo.find({ order: { id_tipo: "ASC" } });
    console.log("\n📋 TIPOS DISPONIBLES:");
    tipos.forEach(tipo => {
      console.log(`  - ID: ${tipo.id_tipo}, Nombre: ${tipo.nombre_tipo}`);
    });

    // Verificar materiales disponibles
    const materiales = await materialRepo.find({ order: { id_material: "ASC" } });
    console.log("\n🏗️  MATERIALES DISPONIBLES:");
    materiales.forEach(material => {
      console.log(`  - ID: ${material.id_material}, Nombre: ${material.nombre_material}`);
    });

    // Verificar rellenos disponibles
    const rellenos = await rellenoRepo.find({ order: { id_relleno: "ASC" } });
    console.log("\n🪵 RELLENOS DISPONIBLES:");
    rellenos.forEach(relleno => {
      console.log(`  - ID: ${relleno.id_relleno}, Nombre: ${relleno.nombre_relleno}`);
    });

    // Crear mapas para acceso rápido
    const tipoMap = new Map(tipos.map(t => [t.id_tipo, t]));
    const materialMap = new Map(materiales.map(m => [m.id_material, m]));
    const rellenoMap = new Map(rellenos.map(r => [r.id_relleno, r]));

    console.log("\n📦 Actualizando productos...");
    
    // Obtener todos los productos
    const productos = await productoRepo.find({ order: { id_producto: "ASC" } });
    console.log(`📊 Encontrados ${productos.length} productos para actualizar\n`);

    let productosActualizados = 0;

    for (const producto of productos) {
      try {
        // Determinar atributos basados en el nombre
        const tipoId = determinarTipo(producto.nombre_producto);
        const materialId = determinarMaterial(producto.nombre_producto);
        const rellenoId = determinarRelleno(producto.nombre_producto, tipoId);
        
        // Obtener objetos de referencia
        const tipo = tipoMap.get(tipoId);
        const material = materialMap.get(materialId);
        const relleno = rellenoMap.get(rellenoId);

        // Generar descripción
        const descripcion = generarDescripcion(
          producto.nombre_producto,
          tipo?.nombre_tipo || 'puertas',
          material?.nombre_material || 'Roble Sólido',
          relleno?.nombre_relleno || 'Macizo'
        );

        // Generar dimensiones faltantes
        let medidaLargo = producto.medida_largo;
        if (!medidaLargo) {
          medidaLargo = tipoId === 1 ? 5.0 : 2.5; // puertas vs molduras
        }

        // Actualizar producto con objetos de relación, no IDs
        await productoRepo.update(producto.id_producto, {
          tipo: tipo,
          material: material,
          relleno: relleno,
          descripcion: descripcion,
          medida_largo: medidaLargo
        });

        console.log(`✅ ${producto.id_producto}: ${producto.nombre_producto}`);
        console.log(`   Tipo: ${tipo?.nombre_tipo} | Material: ${material?.nombre_material} | Relleno: ${relleno?.nombre_relleno}`);
        
        productosActualizados++;

      } catch (error) {
        console.error(`❌ Error actualizando producto ${producto.id_producto}:`, error.message);
      }
    }

    console.log(`\n🎉 Actualización completada!`);
    console.log(`📊 Productos actualizados: ${productosActualizados}/${productos.length}`);

    // Verificar productos actuales con relaciones
    const productosVerificacion = await productoRepo.find({
      relations: ["tipo", "material", "relleno"],
      order: { id_producto: "ASC" },
      take: 3
    });
    
    console.log("\n📦 PRODUCTOS ACTUALIZADOS (primeros 3):");
    productosVerificacion.forEach(producto => {
      console.log(`  - ID: ${producto.id_producto}`);
      console.log(`    Nombre: ${producto.nombre_producto}`);
      console.log(`    Tipo: ${producto.tipo?.nombre_tipo || 'NO ASIGNADO'}`);
      console.log(`    Material: ${producto.material?.nombre_material || 'NO ASIGNADO'}`);
      console.log(`    Relleno: ${producto.relleno?.nombre_relleno || 'NO ASIGNADO'}`);
      console.log(`    Descripción: ${producto.descripcion ? 'ASIGNADA' : 'NO ASIGNADA'}`);
      console.log(`    Precio: $${producto.precio || 'NO ASIGNADO'}`);
      console.log(`    Stock: ${producto.stock || 'NO ASIGNADO'}`);
      console.log(`    Medidas: ${producto.medida_ancho || 'N/A'} x ${producto.medida_largo || 'N/A'} x ${producto.medida_alto || 'N/A'}`);
      console.log("    ---");
    });

    // Verificar cuántos productos ahora tienen todos los atributos
    const productsSinTipo = await productoRepo.count({ where: { tipo: null } });
    const productsSinMaterial = await productoRepo.count({ where: { material: null } });
    const productsSinRelleno = await productoRepo.count({ where: { relleno: null } });
    const productsSinDescripcion = await productoRepo.createQueryBuilder("producto")
      .where("producto.descripcion IS NULL OR producto.descripcion = ''")
      .getCount();

    console.log("\n📊 ESTADO FINAL:");
    console.log(`  - Productos sin tipo: ${productsSinTipo}`);
    console.log(`  - Productos sin material: ${productsSinMaterial}`);
    console.log(`  - Productos sin relleno: ${productsSinRelleno}`);
    console.log(`  - Productos sin descripción: ${productsSinDescripcion}`);

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

updateProductsComplete().then(() => {
  console.log("\n✅ Proceso completado exitosamente");
}).catch(error => {
  console.error("❌ Error fatal:", error);
});
