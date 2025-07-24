import { connectDB, AppDataSource } from "./src/config/configDb.js";

async function createDefaultRellenos() {
  try {
    console.log("🪵 Creando rellenos por defecto...");
    await connectDB();
    
    const rellenoRepo = AppDataSource.getRepository("Relleno");
    
    const rellenos = [
      {
        id_relleno: 1,
        nombre_relleno: "Panal de Abeja",
        caracteristicas: "Ligero y resistente, ideal para puertas interiores"
      },
      {
        id_relleno: 2,
        nombre_relleno: "Macizo",
        caracteristicas: "Estructura sólida, máxima resistencia y durabilidad"
      },
      {
        id_relleno: 3,
        nombre_relleno: "Laminado",
        caracteristicas: "Láminas de madera intercaladas, balance entre peso y resistencia"
      },
      {
        id_relleno: 4,
        nombre_relleno: "Espuma de Poliuretano",
        caracteristicas: "Aislamiento térmico y acústico, liviano"
      },
      {
        id_relleno: 5,
        nombre_relleno: "Tubular",
        caracteristicas: "Estructura hueca con refuerzos internos, económico"
      }
    ];

    for (const rellenoData of rellenos) {
      const existingRelleno = await rellenoRepo.findOne({ 
        where: { id_relleno: rellenoData.id_relleno } 
      });
      
      if (!existingRelleno) {
        const nuevoRelleno = rellenoRepo.create(rellenoData);
        await rellenoRepo.save(nuevoRelleno);
        console.log(`✅ Creado relleno: ${rellenoData.nombre_relleno}`);
      } else {
        console.log(`⚠️  Relleno ya existe: ${rellenoData.nombre_relleno}`);
      }
    }

    console.log("🎉 Rellenos creados exitosamente");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

createDefaultRellenos().then(() => {
  console.log("✅ Proceso completado");
}).catch(error => {
  console.error("❌ Error fatal:", error);
});
