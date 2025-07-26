import { DataSource } from "typeorm";
import { encryptPassword } from "./src/helpers/bcrypt.helper.js";

// Configuración directa de la base de datos
const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "1109",
  database: "mundopuertas",
  entities: ["src/entity/**/*.js"],
  synchronize: false, // Desactivar sincronización
  logging: false,
});

async function createAdminUser() {
  try {
    console.log("🔧 Conectando a la base de datos...");
    
    // Inicializar la conexión de la base de datos
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ Conexión a base de datos establecida\n");
    }

    // Datos del usuario administrador
    const adminData = {
      nombre: "Administrador",
      apellidos: "Sistema",
      email: "admin@terplac.com",
      password: "admin123",
      rol: "administrador",
      rut: "87654321-0" // Cambiar RUT para evitar conflictos
    };

    console.log(`👤 Creando usuario administrador: ${adminData.nombre} ${adminData.apellidos}...`);

    // Verificar si el usuario ya existe
    const existingUser = await AppDataSource.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [adminData.email]
    );

    if (existingUser.length > 0) {
      console.log(`⚠️  El usuario administrador ya existe:`);
      console.log(`   - ID: ${existingUser[0].id_usuario}`);
      console.log(`   - Nombre: ${existingUser[0].nombre} ${existingUser[0].apellidos}`);
      console.log(`   - Email: ${existingUser[0].email}`);
      console.log(`   - Rol: ${existingUser[0].rol}`);
      console.log(`   - Correo verificado: ${existingUser[0].correoVerificado ? '✅' : '❌'}`);
      return;
    }

    // Encriptar contraseña
    console.log("🔐 Encriptando contraseña...");
    const hashedPassword = await encryptPassword(adminData.password);

    // Crear el usuario usando SQL directo
    console.log("📝 Creando usuario en la base de datos...");
    const result = await AppDataSource.query(
      `INSERT INTO usuarios (nombre, apellidos, rut, email, password, rol, "correoVerificado", "flag_blacklist", "intentosFallidos") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [
        adminData.nombre,
        adminData.apellidos,
        adminData.rut,
        adminData.email,
        hashedPassword,
        adminData.rol,
        true, // correoVerificado
        false, // flag_blacklist
        0 // intentosFallidos
      ]
    );
    
    const savedUser = result[0];
    
    console.log("✅ ¡Usuario administrador creado exitosamente!");
    console.log("═══════════════════════════════════════");
    console.log(`   👤 ID: ${savedUser.id_usuario}`);
    console.log(`   📝 Nombre: ${savedUser.nombre} ${savedUser.apellidos}`);
    console.log(`   📧 Email: ${savedUser.email}`);
    console.log(`   🔐 Contraseña: ${adminData.password}`);
    console.log(`   👑 Rol: ${savedUser.rol}`);
    console.log(`   ✅ Correo verificado: ${savedUser.correoVerificado ? 'Sí' : 'No'}`);
    console.log(`   🚫 Blacklist: ${savedUser.flag_blacklist ? 'Sí' : 'No'}`);
    console.log("═══════════════════════════════════════");
    console.log("\n🎉 ¡Ahora puedes iniciar sesión en el sistema de gestión!");
    console.log("📧 Email: admin@terplac.com");
    console.log("🔐 Contraseña: admin123");

  } catch (error) {
    console.error("\n❌ Error durante la creación:", error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error("💡 No se pudo conectar a la base de datos PostgreSQL");
      console.error("💡 Asegúrate de que PostgreSQL esté corriendo en localhost:5432");
      console.error("💡 Verifica que las credenciales sean correctas");
    } else if (error.code === '23505') {
      console.error("💡 El email ya está registrado");
    } else {
      console.error("💡 Código de error:", error.code);
    }
  } finally {
    // Cerrar conexión
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("\n🔌 Conexión cerrada");
    }
  }
}

// Ejecutar el script
console.log("🚀 Creando usuario administrador...\n");
createAdminUser().catch(error => {
  console.error("❌ Error fatal:", error);
  process.exit(1);
}); 