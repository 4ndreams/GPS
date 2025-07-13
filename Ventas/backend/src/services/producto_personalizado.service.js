"use strict";
import { AppDataSource } from "../config/configDb.js";
import { sendCotizacionConfirmationEmail, sendCotizacionStatusChangeEmail } from "../helpers/email.helper.js";

export async function getProductosPersonalizadosService() {
    try {
        const repository = AppDataSource.getRepository("ProductoPersonalizado");
        const productosPersonalizados = await repository.find({
        relations: ["relleno", "material", "usuario"]
        });
        if (!productosPersonalizados || productosPersonalizados.length === 0) return [null, "No hay productos personalizados disponibles"];
        return [productosPersonalizados, null];
    } catch (error) {
        return [error, "Error al obtener productos personalizados"];
    }
}

export async function getProductoPersonalizadoByIdService(id_producto_personalizado) {
    try {
        const repository = AppDataSource.getRepository("ProductoPersonalizado");
        const productoPersonalizado = await repository.findOne({
            where: { id_producto_personalizado },
            relations: ["relleno", "material", "usuario"]
        });
        if (!productoPersonalizado) return [null, "Producto personalizado / cotización no encontrado"];
        return [productoPersonalizado, null];
    } catch (error) {
        return [error, "Error al buscar producto personalizado"];
    }
}

export async function createProductoPersonalizadoService(body) {
    try {
        const repository = AppDataSource.getRepository("ProductoPersonalizado");
        
        // Verificar que el material existe
        if (body.id_material) {
            const materialRepository = AppDataSource.getRepository("Material");
            const materialExists = await materialRepository.findOneBy({ id_material: body.id_material });
            if (!materialExists) {
                return [null, `El material con ID ${body.id_material} no existe en la base de datos`];
            }
        }
        
        // Verificar que el relleno existe
        if (body.id_relleno) {
            const rellenoRepository = AppDataSource.getRepository("Relleno");
            const rellenoExists = await rellenoRepository.findOneBy({ id_relleno: body.id_relleno });
            if (!rellenoExists) {
                return [null, `El relleno con ID ${body.id_relleno} no existe en la base de datos`];
            }
        }
        
        // Verificar que el usuario existe (solo si se proporciona)
        if (body.id_usuario) {
            const usuarioRepository = AppDataSource.getRepository("Usuario");
            try {
                const usuarioExists = await usuarioRepository.findOneBy({ id_usuario: body.id_usuario });
                if (!usuarioExists) {
                    return [null, `El usuario con ID ${body.id_usuario} no existe en la base de datos`];
                }
                console.log(`✅ Usuario ${body.id_usuario} verificado correctamente`);
            } catch (error) {
                console.error(`❌ Error al verificar usuario ${body.id_usuario}:`, error);
                return [null, `Error al verificar la existencia del usuario: ${error.message}`];
            }
        }
        
        const nuevo = repository.create(body);
        const saved = await repository.save(nuevo);
        
        // Obtener el registro completo con relaciones
        const completo = await repository.findOne({
            where: { id_producto_personalizado: saved.id_producto_personalizado },
            relations: ["relleno", "material", "usuario"]
        });
        
        // Enviar email de confirmación de cotización
        try {
            await sendCotizacionConfirmationEmail(completo);
        } catch (emailError) {
            console.error(`❌ Error al enviar email de confirmación para cotización #${completo.id_producto_personalizado}:`, emailError.message);
            // No fallar la creación si el email falla, solo registrar el error
        }
        
        return [completo, null];
    } catch (error) {
        return [error, "Error al crear producto personalizado"];
    }
}

export async function updateProductoPersonalizadoService(id_producto_personalizado, body) {
    try {
        const repository = AppDataSource.getRepository("ProductoPersonalizado");
        
        // Verificar que el producto personalizado existe
        const exists = await repository.findOneBy({ id_producto_personalizado });
        if (!exists) {
            return [null, "Producto personalizado / cotización no encontrado"];
        }
        
        // Verificar que el material existe (si se está actualizando)
        if (body.id_material) {
            const materialRepository = AppDataSource.getRepository("Material");
            const materialExists = await materialRepository.findOneBy({ id_material: body.id_material });
            if (!materialExists) {
                return [null, `El material con ID ${body.id_material} no existe en la base de datos`];
            }
        }
        
        // Verificar que el relleno existe (si se está actualizando)
        if (body.id_relleno) {
            const rellenoRepository = AppDataSource.getRepository("Relleno");
            const rellenoExists = await rellenoRepository.findOneBy({ id_relleno: body.id_relleno });
            if (!rellenoExists) {
                return [null, `El relleno con ID ${body.id_relleno} no existe en la base de datos`];
            }
        }
        
        // Verificar que el usuario existe (si se está actualizando)
        if (body.id_usuario) {
            const usuarioRepository = AppDataSource.getRepository("Usuario");
            const usuarioExists = await usuarioRepository.findOneBy({ id_usuario: body.id_usuario });
            if (!usuarioExists) {
                return [null, `El usuario con ID ${body.id_usuario} no existe en la base de datos`];
            }
        }
        
        await repository.update({ id_producto_personalizado }, body);
        const updated = await repository.findOne({
            where: { id_producto_personalizado },
            relations: ["relleno", "material", "usuario"]
        });
        
        return [updated, null];
    } catch (error) {
        return [error, "Error al actualizar producto personalizado"];
    }
}

export async function deleteProductoPersonalizadoService(id_producto_personalizado) {
    try {
        const repository = AppDataSource.getRepository("ProductoPersonalizado");
        const encontrado = await repository.findOneBy({ id_producto_personalizado });
        if (!encontrado) return [null, "Producto personalizado / cotización no encontrado"];
        await repository.remove(encontrado);
        return [encontrado, null];
    } catch (error) {
        return [error, "Error al eliminar producto personalizado"];
    }
}

export async function getProductosPersonalizadosByUserService(id_usuario, rut_contacto) {
    try {
        const repository = AppDataSource.getRepository("ProductoPersonalizado");
        
        // Buscar productos personalizados por id_usuario o rut_contacto para los que no se logueen
        const whereCondition = {};
        if (id_usuario) {
            whereCondition.id_usuario = id_usuario;
        }
        if (rut_contacto) {
            whereCondition.rut_contacto = rut_contacto;
        }
        
        const productosPersonalizados = await repository.find({
            where: whereCondition,
            relations: ["relleno", "material", "usuario"]
        });
        
        if (!productosPersonalizados || productosPersonalizados.length === 0) {
            return [null, "No hay productos personalizados disponibles para este usuario"];
        }
        return [productosPersonalizados, null];
    } catch (error) {
        return [error, "Error al obtener productos personalizados del usuario"];
    }
}

export async function updateEstadoProductoPersonalizadoService(id_producto_personalizado, estado) {
    try {
        const repository = AppDataSource.getRepository("ProductoPersonalizado");
        
        // Verificar que el producto personalizado existe y obtener el estado anterior
        const exists = await repository.findOne({
            where: { id_producto_personalizado },
            relations: ["relleno", "material", "usuario"]
        });
        if (!exists) {
            return [null, "Producto personalizado / cotización no encontrado"];
        }
        
        const estadoAnterior = exists.estado;
        
        // Actualizar solo el estado
        await repository.update({ id_producto_personalizado }, { estado });
        
        // Obtener el registro actualizado con relaciones
        const updated = await repository.findOne({
            where: { id_producto_personalizado },
            relations: ["relleno", "material", "usuario"]
        });
        
        // Enviar email de cambio de estado solo si el estado realmente cambió
        if (estadoAnterior !== estado) {
            try {
                await sendCotizacionStatusChangeEmail(updated, estadoAnterior);
            } catch (emailError) {
                console.error(`❌ Error al enviar email de cambio de estado para cotización #${updated.id_producto_personalizado}:`, emailError.message);
            }
        }
        
        return [updated, null];
    } catch (error) {
        return [error, "Error al actualizar el estado del producto personalizado"];
    }
}

