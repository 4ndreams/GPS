import { AppDataSource } from "./src/config/configDb.js";
import pg from 'pg';
import { DATABASE, DB_USERNAME, HOST, PASSWORD } from "./src/config/configEnv.js";

const { Client } = pg;

async function checkAvailableData() {
  const client = new Client({
    host: HOST,
    port: 5432,
    username: DB_USERNAME,
    password: PASSWORD,
    database: DATABASE
  });

  try {
    await client.connect();
    console.log("🔍 Verificando datos disponibles en la base de datos...\n");
    
    // Verificar tipos disponibles
    const tiposResult = await client.query("SELECT * FROM tipo");
    console.log("📋 TIPOS DISPONIBLES:");
    tiposResult.rows.forEach(tipo => {
      console.log(`  - ID: ${tipo.id_tipo}, Nombre: ${tipo.nombre_tipo}`);
    });

    // Verificar materiales disponibles
    const materialesResult = await client.query("SELECT * FROM material");
    console.log("\n🏗️  MATERIALES DISPONIBLES:");
    materialesResult.rows.forEach(material => {
      console.log(`  - ID: ${material.id_material}, Nombre: ${material.nombre_material}`);
    });

    // Verificar rellenos disponibles
    const rellenosResult = await client.query("SELECT * FROM relleno");
    console.log("\n🪵 RELLENOS DISPONIBLES:");
    rellenosResult.rows.forEach(relleno => {
      console.log(`  - ID: ${relleno.id_relleno}, Nombre: ${relleno.nombre_relleno}`);
    });

    // Verificar productos actuales con joins
    const productosResult = await client.query(`
      SELECT 
        p.id_producto,
        p.nombre_producto,
        p.descripcion,
        p.medida_ancho,
        p.medida_largo,
        p.medida_alto,
        t.nombre_tipo,
        m.nombre_material,
        r.nombre_relleno
      FROM producto p
      LEFT JOIN tipo t ON p.id_tipo = t.id_tipo
      LEFT JOIN material m ON p.id_material = m.id_material
      LEFT JOIN relleno r ON p.id_relleno = r.id_relleno
      LIMIT 5
    `);
    
    console.log("\n📦 PRODUCTOS ACTUALES (primeros 5):");
    productosResult.rows.forEach(producto => {
      console.log(`  - ID: ${producto.id_producto}`);
      console.log(`    Nombre: ${producto.nombre_producto}`);
      console.log(`    Tipo: ${producto.nombre_tipo || 'NO ASIGNADO'}`);
      console.log(`    Material: ${producto.nombre_material || 'NO ASIGNADO'}`);
      console.log(`    Relleno: ${producto.nombre_relleno || 'NO ASIGNADO'}`);
      console.log(`    Descripción: ${producto.descripcion || 'NO ASIGNADA'}`);
      console.log(`    Medidas: ${producto.medida_ancho || 'N/A'} x ${producto.medida_largo || 'N/A'} x ${producto.medida_alto || 'N/A'}`);
      console.log("    ---");
    });

    console.log("\n🔢 CONTEO TOTAL:");
    const countTipos = await client.query("SELECT COUNT(*) FROM tipo");
    const countMateriales = await client.query("SELECT COUNT(*) FROM material");
    const countRellenos = await client.query("SELECT COUNT(*) FROM relleno");
    const countProductos = await client.query("SELECT COUNT(*) FROM producto");
    
    console.log(`  - Tipos: ${countTipos.rows[0].count}`);
    console.log(`  - Materiales: ${countMateriales.rows[0].count}`);
    console.log(`  - Rellenos: ${countRellenos.rows[0].count}`);
    console.log(`  - Productos: ${countProductos.rows[0].count}`);

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.end();
  }
}

checkAvailableData().then(() => {
  console.log("✅ Verificación completada");
}).catch(error => {
  console.error("❌ Error fatal:", error);
});
