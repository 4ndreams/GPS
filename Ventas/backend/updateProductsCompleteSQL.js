import pg from 'pg';

const { Client } = pg;

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

async function updateProductsCompleteSQL() {
  // Usar las credenciales que aparentemente funcionan en algunos contextos
  const configs = [
    { host: 'localhost', port: 5432, user: 'postgres', password: 'postgres', database: 'gps_ventas' },
    { host: 'localhost', port: 5432, user: 'postgres', password: '123456', database: 'gps_ventas' },
    { host: 'localhost', port: 5432, user: 'postgres', password: '', database: 'gps_ventas' },
    { host: 'localhost', port: 5432, user: 'sebae', password: 'sebae', database: 'gps_ventas' }
  ];

  for (const config of configs) {
    const client = new Client(config);
    
    try {
      await client.connect();
      console.log(`🔗 Conexión exitosa con usuario: ${config.user}`);
      
      // Primero crear rellenos si no existen
      console.log("🪵 Creando rellenos por defecto...");
      
      const rellenosData = [
        { id: 1, nombre: "Panal de Abeja", caracteristicas: "Ligero y resistente, ideal para puertas interiores" },
        { id: 2, nombre: "Macizo", caracteristicas: "Estructura sólida, máxima resistencia y durabilidad" },
        { id: 3, nombre: "Laminado", caracteristicas: "Láminas de madera intercaladas, balance entre peso y resistencia" },
        { id: 4, nombre: "Espuma de Poliuretano", caracteristicas: "Aislamiento térmico y acústico, liviano" },
        { id: 5, nombre: "Tubular", caracteristicas: "Estructura hueca con refuerzos internos, económico" }
      ];

      for (const relleno of rellenosData) {
        try {
          await client.query(
            'INSERT INTO relleno (id_relleno, nombre_relleno, caracteristicas) VALUES ($1, $2, $3) ON CONFLICT (id_relleno) DO NOTHING',
            [relleno.id, relleno.nombre, relleno.caracteristicas]
          );
          console.log(`✅ Relleno procesado: ${relleno.nombre}`);
        } catch (error) {
          console.log(`⚠️  Error con relleno ${relleno.nombre}: ${error.message}`);
        }
      }

      // Obtener datos de referencia
      const tiposResult = await client.query('SELECT * FROM tipo');
      const materialesResult = await client.query('SELECT * FROM material');
      const rellenosResult = await client.query('SELECT * FROM relleno');
      
      const tipos = new Map(tiposResult.rows.map(t => [t.id_tipo, t]));
      const materiales = new Map(materialesResult.rows.map(m => [m.id_material, m]));
      const rellenos = new Map(rellenosResult.rows.map(r => [r.id_relleno, r]));

      console.log("\n📦 Actualizando productos...");
      
      // Obtener todos los productos
      const productosResult = await client.query('SELECT * FROM producto ORDER BY id_producto');
      console.log(`📊 Encontrados ${productosResult.rows.length} productos para actualizar\n`);

      let productosActualizados = 0;

      for (const producto of productosResult.rows) {
        try {
          // Determinar atributos basados en el nombre
          const tipoId = determinarTipo(producto.nombre_producto);
          const materialId = determinarMaterial(producto.nombre_producto);
          const rellenoId = determinarRelleno(producto.nombre_producto, tipoId);
          
          // Obtener objetos de referencia
          const tipo = tipos.get(tipoId);
          const material = materiales.get(materialId);
          const relleno = rellenos.get(rellenoId);

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

          // Actualizar producto
          await client.query(`
            UPDATE producto 
            SET id_tipo = $1, 
                id_material = $2, 
                id_relleno = $3, 
                descripcion = $4,
                medida_largo = $5
            WHERE id_producto = $6
          `, [tipoId, materialId, rellenoId, descripcion, medidaLargo, producto.id_producto]);

          console.log(`✅ ${producto.id_producto}: ${producto.nombre_producto}`);
          console.log(`   Tipo: ${tipo?.nombre_tipo} | Material: ${material?.nombre_material} | Relleno: ${relleno?.nombre_relleno}`);
          
          productosActualizados++;

        } catch (error) {
          console.error(`❌ Error actualizando producto ${producto.id_producto}:`, error.message);
        }
      }

      console.log(`\n🎉 Actualización completada!`);
      console.log(`📊 Productos actualizados: ${productosActualizados}/${productosResult.rows.length}`);

      // Verificar resultado
      console.log("\n🔍 Verificando productos actualizados...");
      const verificacionResult = await client.query(`
        SELECT 
          p.id_producto,
          p.nombre_producto,
          p.descripcion,
          t.nombre_tipo,
          m.nombre_material,
          r.nombre_relleno
        FROM producto p
        LEFT JOIN tipo t ON p.id_tipo = t.id_tipo
        LEFT JOIN material m ON p.id_material = m.id_material
        LEFT JOIN relleno r ON p.id_relleno = r.id_relleno
        ORDER BY p.id_producto
        LIMIT 3
      `);

      verificacionResult.rows.forEach(p => {
        console.log(`\n📦 ${p.nombre_producto}`);
        console.log(`   🏷️  Tipo: ${p.nombre_tipo || 'NO ASIGNADO'}`);
        console.log(`   🏗️  Material: ${p.nombre_material || 'NO ASIGNADO'}`);
        console.log(`   🪵 Relleno: ${p.nombre_relleno || 'NO ASIGNADO'}`);
        console.log(`   📝 Descripción: ${p.descripcion ? 'ASIGNADA' : 'NO ASIGNADA'}`);
      });

      await client.end();
      return; // Salir si fue exitoso

    } catch (error) {
      console.log(`❌ Error con ${config.user}: ${error.message}`);
      try {
        await client.end();
      } catch (e) {
        // Ignore disconnect errors
      }
    }
  }
  
  console.error("❌ No se pudo conectar con ninguna configuración");
}

updateProductsCompleteSQL().then(() => {
  console.log("\n✅ Proceso completado exitosamente");
}).catch(error => {
  console.error("❌ Error fatal:", error);
});
