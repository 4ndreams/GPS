// Script para insertar datos de prueba para RF 5
import { AppDataSource } from './src/config/configDb.js';
import Orden from './src/entity/orden.entity.js';
import Producto from './src/entity/producto.entity.js';
import Usuario from './src/entity/user.entity.js';
import Bodega from './src/entity/bodega.entity.js';

async function insertTestData() {
  try {
    await AppDataSource.initialize();
    console.log('🔗 Conexión a BD establecida');

    // Crear datos de prueba
    const ordenRepo = AppDataSource.getRepository(Orden);
    const productoRepo = AppDataSource.getRepository(Producto);
    const usuarioRepo = AppDataSource.getRepository(Usuario);
    const bodegaRepo = AppDataSource.getRepository(Bodega);

    // Crear un producto de prueba si no existe
    let producto = await productoRepo.findOne({ where: { id_producto: 1 } });
    if (!producto) {
      producto = productoRepo.create({
        nombre_producto: 'Puerta Enchapada Mara',
        precio: 150000,
        descripcion: 'Puerta enchapada en madera de Mara, 3 palos',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await productoRepo.save(producto);
      console.log('✅ Producto de prueba creado');
    }

    // Crear un usuario de prueba si no existe
    let usuario = await usuarioRepo.findOne({ where: { id_usuario: 1 } });
    if (!usuario) {
      usuario = usuarioRepo.create({
        nombre: 'Usuario',
        apellidos: 'Fabrica Test',
        email: 'fabrica@test.com',
        password: 'test123',
        rol: 'fabrica',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await usuarioRepo.save(usuario);
      console.log('✅ Usuario de prueba creado');
    }

    // Crear una bodega de prueba si no existe
    let bodega = await bodegaRepo.findOne({ where: { id_bodega: 1 } });
    if (!bodega) {
      bodega = bodegaRepo.create({
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await bodegaRepo.save(bodega);
      console.log('✅ Bodega de prueba creada');
    }

    // Crear órdenes de prueba
    const ordenesExistentes = await ordenRepo.count();
    if (ordenesExistentes === 0) {
      const ordenesPrueba = [
        {
          cantidad: 2,
          origen: 'Fábrica Central',
          destino: 'Tienda Norte',
          estado: 'Pendiente',
          prioridad: 'Media',
          tipo: 'normal',
          observaciones: 'Orden de prueba pendiente',
          id_producto: producto.id_producto,
          id_usuario: usuario.id_usuario,
          id_bodega: bodega.id_bodega,
        },
        {
          cantidad: 1,
          origen: 'Fábrica Central',
          destino: 'Tienda Sur',
          estado: 'En producción',
          prioridad: 'Alta',
          tipo: 'normal',
          observaciones: 'Orden en fabricación',
          id_producto: producto.id_producto,
          id_usuario: usuario.id_usuario,
          id_bodega: bodega.id_bodega,
        },
        {
          cantidad: 3,
          origen: 'Fábrica Central',
          destino: 'Tienda Este',
          estado: 'Fabricada',
          prioridad: 'Media',
          tipo: 'normal',
          observaciones: 'Lista para despacho',
          transportista: null,
          id_producto: producto.id_producto,
          id_usuario: usuario.id_usuario,
          id_bodega: bodega.id_bodega,
        },
        {
          cantidad: 5,
          origen: 'Fábrica Central',
          destino: 'Tienda Oeste',
          estado: 'En tránsito',
          prioridad: 'Alta',
          tipo: 'normal',
          transportista: 'Transportes Rápidos S.A.',
          observaciones: 'En camino a destino',
          id_producto: producto.id_producto,
          id_usuario: usuario.id_usuario,
          id_bodega: bodega.id_bodega,
        },
        {
          cantidad: 2,
          origen: 'Fábrica Central',
          destino: 'Tienda Centro',
          estado: 'Recibido',
          prioridad: 'Media',
          tipo: 'normal',
          transportista: 'Transportes Rápidos S.A.',
          observaciones: 'Entregado sin problemas',
          fecha_entrega: new Date(),
          id_producto: producto.id_producto,
          id_usuario: usuario.id_usuario,
          id_bodega: bodega.id_bodega,
        },
        {
          cantidad: 10,
          origen: 'Solicitud Tienda',
          destino: 'Fábrica Central',
          estado: 'Pendiente',
          prioridad: 'Urgente',
          tipo: 'stock',
          observaciones: 'Pedido de stock urgente',
          id_producto: producto.id_producto,
          id_usuario: usuario.id_usuario,
          id_bodega: bodega.id_bodega,
        },
      ];

      for (const ordenData of ordenesPrueba) {
        const orden = ordenRepo.create({
          ...ordenData,
          fecha_envio: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await ordenRepo.save(orden);
      }
      
      console.log('✅ Órdenes de prueba creadas:', ordenesPrueba.length);
    }

    console.log('🎉 Datos de prueba RF 5 insertados exitosamente');
    
    // Verificar los datos
    const totalOrdenes = await ordenRepo.count();
    const ordenesPorEstado = await ordenRepo
      .createQueryBuilder('orden')
      .select('orden.estado, COUNT(*) as count')
      .groupBy('orden.estado')
      .getRawMany();
    
    console.log('📊 Resumen de datos:');
    console.log(`   Total órdenes: ${totalOrdenes}`);
    console.log('   Por estado:', ordenesPorEstado);

  } catch (error) {
    console.error('❌ Error insertando datos de prueba:', error);
  } finally {
    await AppDataSource.destroy();
    process.exit(0);
  }
}

insertTestData();
