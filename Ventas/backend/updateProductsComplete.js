import { connectDB, AppDataSource } from "./src/config/configDb.js";

// Función para determinar tipo basado en el nombre del producto
function determinarTipo(nombreProducto) {
  const nombre = nombreProducto.toLowerCase();
  
  // Todos estos productos parecen ser puertas basado en los nombres
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
  
  // Si no coincide con ningún patrón de puerta, asumir moldura
  return 2; // molduras
}

// Función para determinar material basado en el nombre
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

// Función para determinar relleno basado en el tipo y características
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

// Función para generar descripción basada en las características
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
    console.log("🚀 Iniciando actualización completa de productos...");
    console.log("🔧 Conectando a la base de datos...");
    
    // Simular conexión exitosa como en checkDataSimple.js
    await connectDB();
    console.log("✅ Conexión establecida\n");

    // Primero crear rellenos si no existen
    console.log("🪵 Creando rellenos por defecto...");
    
    const rellenos = [
      { id: 1, nombre: "Panal de Abeja", caracteristicas: "Ligero y resistente, ideal para puertas interiores" },
      { id: 2, nombre: "Macizo", caracteristicas: "Estructura sólida, máxima resistencia y durabilidad" },
      { id: 3, nombre: "Laminado", caracteristicas: "Láminas de madera intercaladas, balance entre peso y resistencia" },
      { id: 4, nombre: "Espuma de Poliuretano", caracteristicas: "Aislamiento térmico y acústico, liviano" },
      { id: 5, nombre: "Tubular", caracteristicas: "Estructura hueca con refuerzos internos, económico" }
    ];

    const rellenoRepo = AppDataSource.getRepository("Relleno");
    
    for (const rellenoData of rellenos) {
      const existing = await rellenoRepo.findOne({ where: { id_relleno: rellenoData.id } });
      if (!existing) {
        const nuevoRelleno = rellenoRepo.create({
          id_relleno: rellenoData.id,
          nombre_relleno: rellenoData.nombre,
          caracteristicas: rellenoData.caracteristicas
        });
        await rellenoRepo.save(nuevoRelleno);
        console.log(`✅ Creado relleno: ${rellenoData.nombre}`);
      }
    }

    // Obtener repositorios
    const productoRepo = AppDataSource.getRepository("Producto");
    const tipoRepo = AppDataSource.getRepository("Tipo");
    const materialRepo = AppDataSource.getRepository("Material");
    
    // Obtener datos de referencia
    const tipos = await tipoRepo.find();
    const materiales = await materialRepo.find();
    const rellenosCreados = await rellenoRepo.find();
    
    // Crear mapas para acceso rápido
    const tipoMap = new Map(tipos.map(t => [t.id_tipo, t]));
    const materialMap = new Map(materiales.map(m => [m.id_material, m]));
    const rellenoMap = new Map(rellenosCreados.map(r => [r.id_relleno, r]));

    console.log("\n📦 Actualizando productos...");
    
    // Obtener todos los productos
    const productos = await productoRepo.find();
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
        if (!producto.medida_largo) {
          producto.medida_largo = tipoId === 1 ? 5.0 : 2.5; // puertas vs molduras
        }
        if (!producto.medida_alto && tipoId === 2) { // solo para molduras
          producto.medida_alto = 5.0;
        }

        // Actualizar producto
        await productoRepo.update(producto.id_producto, {
          id_tipo: tipoId,
          id_material: materialId,
          id_relleno: rellenoId,
          descripcion: descripcion,
          medida_largo: producto.medida_largo
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

    // Verificar resultado
    console.log("\n🔍 Verificando productos actualizados...");
    const productosVerificacion = await productoRepo.find({
      relations: ["tipo", "material", "relleno"],
      take: 3
    });

    productosVerificacion.forEach(p => {
      console.log(`\n📦 ${p.nombre_producto}`);
      console.log(`   🏷️  Tipo: ${p.tipo?.nombre_tipo || 'NO ASIGNADO'}`);
      console.log(`   🏗️  Material: ${p.material?.nombre_material || 'NO ASIGNADO'}`);
      console.log(`   🪵 Relleno: ${p.relleno?.nombre_relleno || 'NO ASIGNADO'}`);
      console.log(`   📝 Descripción: ${p.descripcion ? 'ASIGNADA' : 'NO ASIGNADA'}`);
    });

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
