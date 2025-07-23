import pg from 'pg';

const { Client } = pg;

async function createRellenos() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'gps_ventas'
  });

  try {
    await client.connect();
    console.log("🪵 Creando rellenos por defecto...\n");
    
    const rellenos = [
      { id: 1, nombre: "Panal de Abeja", caracteristicas: "Ligero y resistente, ideal para puertas interiores" },
      { id: 2, nombre: "Macizo", caracteristicas: "Estructura sólida, máxima resistencia y durabilidad" },
      { id: 3, nombre: "Laminado", caracteristicas: "Láminas de madera intercaladas, balance entre peso y resistencia" },
      { id: 4, nombre: "Espuma de Poliuretano", caracteristicas: "Aislamiento térmico y acústico, liviano" },
      { id: 5, nombre: "Tubular", caracteristicas: "Estructura hueca con refuerzos internos, económico" }
    ];

    for (const relleno of rellenos) {
      try {
        // Verificar si existe
        const existingResult = await client.query(
          'SELECT id_relleno FROM relleno WHERE id_relleno = $1',
          [relleno.id]
        );

        if (existingResult.rows.length === 0) {
          // Crear nuevo relleno
          await client.query(
            'INSERT INTO relleno (id_relleno, nombre_relleno, caracteristicas) VALUES ($1, $2, $3)',
            [relleno.id, relleno.nombre, relleno.caracteristicas]
          );
          console.log(`✅ Creado relleno: ${relleno.nombre}`);
        } else {
          console.log(`⚠️  Relleno ya existe: ${relleno.nombre}`);
        }
      } catch (error) {
        console.error(`❌ Error creando relleno ${relleno.nombre}:`, error.message);
      }
    }

    // Verificar rellenos creados
    const rellenosResult = await client.query('SELECT * FROM relleno ORDER BY id_relleno');
    console.log("\n🎉 Rellenos en la base de datos:");
    rellenosResult.rows.forEach(relleno => {
      console.log(`  - ID: ${relleno.id_relleno}, Nombre: ${relleno.nombre_relleno}`);
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.end();
  }
}

createRellenos().then(() => {
  console.log("\n✅ Proceso completado");
}).catch(error => {
  console.error("❌ Error fatal:", error);
});
