import { AppDataSource } from "./src/config/configDb.js";
import UsuarioSchema from "./src/entity/user.entity.js";
import { encryptPassword } from "./src/helpers/bcrypt.helper.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, HOST, DATABASE, DB_USERNAME, PASSWORD } from "./src/config/configEnv.js";

// Función para crear múltiples usuarios bypaseando la verificación de email
async function createMultipleUsers() {
  try {
    console.log("🔧 Configuración de base de datos:");
    console.log(`   📍 Host: ${HOST || 'localhost'}`);
    console.log(`   🗄️  Database: ${DATABASE || 'mundoPuertas'}`);
    console.log(`   👤 User: ${DB_USERNAME || 'postgres'}`);
    console.log(`   🔐 Password: ${PASSWORD ? '***' : 'no configurada'}\n`);

    // Inicializar la conexión de la base de datos
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("🔗 Conexión a base de datos inicializada\n");
    }

    const userRepository = AppDataSource.getRepository(UsuarioSchema);
    
    // Datos de los usuarios a crear
    const usersData = [
      {
        nombre: "Andrea",
        apellidos: "Tapia",
        email: "andreav.tapiaz@gmail.com",
        password: "andrea123",
        rol: "administrador",
        rut: null
      },
      {
        nombre: "Prueba",
        apellidos: "Tienda",
        email: "tienda@gmail.com",
        password: "tienda123",
        rol: "tienda",
        rut: null
      },
      {
        nombre: "Prueba",
        apellidos: "Fábrica",
        email: "fabrica@gmail.com",
        password: "fabrica123",
        rol: "fabrica",
        rut: null
      }
    ];

    const createdUsers = [];

    for (const userData of usersData) {
      console.log(`👤 Procesando usuario: ${userData.nombre} ${userData.apellidos} (${userData.rol})...`);

      // Verificar si el usuario ya existe
      console.log("🔍 Verificando si el usuario ya existe...");
      const existingUser = await userRepository.findOne({ 
        where: { email: userData.email } 
      });

      if (existingUser) {
        console.log(`⚠️  El usuario ya existe:`);
        console.log(`   - ID: ${existingUser.id_usuario}`);
        console.log(`   - Nombre: ${existingUser.nombre} ${existingUser.apellidos}`);
        console.log(`   - Email: ${existingUser.email}`);
        console.log(`   - Rol: ${existingUser.rol}`);
        console.log(`   - Correo verificado: ${existingUser.correoVerificado ? '✅' : '❌'}\n`);
        continue; // Continuar con el siguiente usuario
      }

      // Encriptar contraseña usando el mismo método que el sistema
      console.log("🔐 Encriptando contraseña...");
      const hashedPassword = await encryptPassword(userData.password);
      console.log(`   - Contraseña original: ${userData.password}`);
      console.log(`   - Hash generado: ${hashedPassword.substring(0, 20)}...`);

      // Crear el usuario directamente usando TypeORM (igual que verifyEmailService)
      console.log("� Creando usuario en la base de datos...");
      const newUser = userRepository.create({
        nombre: userData.nombre,
        apellidos: userData.apellidos,
        rut: userData.rut,
        email: userData.email,
        password: hashedPassword,
        rol: userData.rol,
        correoVerificado: true, // ✅ BYPASS: Marcar como verificado sin email
        flag_blacklist: false,
        intentosFallidos: 0,
        fechaBloqueo: null,
        tokenVerificacion: null,
        verificacionTokenExpiracion: null
      });

      const savedUser = await userRepository.save(newUser);
      createdUsers.push(savedUser);
      
      console.log("✅ ¡Usuario creado exitosamente!");
      console.log("═══════════════════════════════════════");
      console.log(`   👤 ID: ${savedUser.id_usuario}`);
      console.log(`   📝 Nombre: ${savedUser.nombre} ${savedUser.apellidos}`);
      console.log(`   📧 Email: ${savedUser.email}`);
      console.log(`   🔐 Contraseña: ${userData.password}`);
      console.log(`   👑 Rol: ${savedUser.rol}`);
      console.log(`   ✅ Correo verificado: ${savedUser.correoVerificado ? 'Sí' : 'No'}`);
      console.log(`   🚫 Blacklist: ${savedUser.flag_blacklist ? 'Sí' : 'No'}`);
      console.log("═══════════════════════════════════════\n");
    }

    // Mostrar resumen de usuarios creados
    if (createdUsers.length > 0) {
      console.log("🎉 Resumen de usuarios creados:");
      console.log("═══════════════════════════════════════");
      createdUsers.forEach((user, index) => {
        const originalData = usersData.find(u => u.email === user.email);
        console.log(`${index + 1}. 👤 ${user.nombre} ${user.apellidos}`);
        console.log(`   📧 ${user.email}`);
        console.log(`   🔐 ${originalData.password}`);
        console.log(`   👑 ${user.rol}`);
        console.log(`   🆔 ID: ${user.id_usuario}`);
      });
      console.log("═══════════════════════════════════════");

      // Generar tokens de prueba para cada usuario creado
      console.log("\n🔑 Tokens de prueba generados:");
      for (const user of createdUsers) {
        const originalData = usersData.find(u => u.email === user.email);
        const testToken = jwt.sign(
          {
            id: user.id_usuario,
            email: user.email,
            rol: user.rol,
          },
          ACCESS_TOKEN_SECRET || "default_secret",
          { expiresIn: "24h" }
        );
        
        console.log(`\n� ${user.rol.toUpperCase()} - ${user.nombre} ${user.apellidos}:`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🔐 Password: ${originalData.password}`);
        console.log(`   🎫 Token: ${testToken.substring(0, 50)}...`);
      }
    } else {
      console.log("ℹ️  No se crearon nuevos usuarios (todos ya existían)");
    }

  } catch (error) {
    console.error("\n❌ Error durante la creación:", error.message);
    
    if (error.code === '23505') {
      console.error("💡 El email ya está registrado (restricción de unicidad)");
    } else if (error.code === 'ECONNREFUSED') {
      console.error("💡 No se pudo conectar a la base de datos");
    } else {
      console.error("💡 Código de error:", error.code);
      console.error("💡 Stack trace:", error.stack);
    }
  } finally {
    // Cerrar conexión
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("\n🔌 Conexión cerrada");
    }
  }
}

// Función adicional para mostrar usuarios por rol
async function showUsersByRole() {
  try {
    console.log("\n🔍 Mostrando usuarios por rol...");
    
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(UsuarioSchema);
    
    // Obtener usuarios por cada rol
    const roles = ["administrador", "tienda", "fabrica", "cliente"];
    
    for (const rol of roles) {
      const users = await userRepository.find({
        where: { rol: rol }
      });

      console.log(`\n👑 USUARIOS ${rol.toUpperCase()} (${users.length}):`);
      console.log("═".repeat(50));
      
      if (users.length > 0) {
        users.forEach((user, index) => {
          console.log(`${index + 1}. 👤 ${user.nombre} ${user.apellidos}`);
          console.log(`   📧 ${user.email}`);
          console.log(`   🆔 ID: ${user.id_usuario}`);
          console.log(`   ✅ Verificado: ${user.correoVerificado ? 'Sí' : 'No'}`);
          console.log(`   🚫 Blacklist: ${user.flag_blacklist ? 'Sí' : 'No'}`);
          console.log(`   📅 Creado: ${new Date(user.createdAt).toLocaleDateString('es-CL')}`);
          console.log("");
        });
      } else {
        console.log(`   No hay usuarios con rol ${rol}`);
        console.log("");
      }
    }

  } catch (error) {
    console.error("❌ Error al mostrar usuarios por rol:", error.message);
  }
}

// Ejecutar el script
async function main() {
  console.log("🚀 Iniciando creación de usuarios de prueba...\n");
  
  await createMultipleUsers();
  await showUsersByRole();
  
  console.log("\n✅ Proceso completado");
}

main().catch(error => {
  console.error("❌ Error fatal:", error);
  process.exit(1);
});
