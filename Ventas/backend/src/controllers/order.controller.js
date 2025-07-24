import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { AppDataSource } from '../config/configDb.js';
import { OrderEntity } from '../entity/order.entity.js';
import UsuarioSchema from '../entity/user.entity.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Configurar Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const preference = new Preference(client);
const payment = new Payment(client);

// Función para generar contraseña aleatoria alfanumérica de 8 caracteres
const generateRandomPassword = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

// Función para enviar email con contraseña temporal
const sendTemporaryPasswordEmail = async (email, nombre, password) => {
    try {
        // TODO: Implementar envío real de email
        // Aquí puedes integrar servicios como SendGrid, NodeMailer, etc.
        console.log(`
========================================
NUEVO USUARIO CREADO
========================================
Email: ${email}
Nombre: ${nombre}
Contraseña temporal: ${password}
========================================
Por favor, cambia tu contraseña después del primer inicio de sesión.
        `);
        
        // En un entorno real, aquí irían las configuraciones del servicio de email
        return true;
    } catch (error) {
        console.error('Error enviando email:', error);
        return false;
    }
};

// Función para crear un usuario nuevo
const createNewUser = async (contactInfo) => {
    try {
        const userRepository = AppDataSource.getRepository(UsuarioSchema);
        
        // Verificar si el usuario ya existe por email
        const existingUser = await userRepository.findOne({
            where: { email: contactInfo.email }
        });
        
        if (existingUser) {
            return existingUser;
        }
        
        // Generar contraseña aleatoria
        const randomPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        
        // Crear nuevo usuario
        const newUser = userRepository.create({
            nombre: contactInfo.nombre,
            apellidos: contactInfo.apellidos || '',
            email: contactInfo.email,
            password: hashedPassword,
            rol: 'cliente',
            correoVerificado: false
        });
        
        const savedUser = await userRepository.save(newUser);
        
        // Enviar email con la contraseña al usuario
        await sendTemporaryPasswordEmail(
            contactInfo.email, 
            contactInfo.nombre, 
            randomPassword
        );
        
        return savedUser;
    } catch (error) {
        console.error('Error creando usuario:', error);
        throw error;
    }
};

// Crear orden y preference de Mercado Pago
export const createPaymentOrder = async (req, res) => {
    try {
        const { contactInfo, items, total } = req.body;
        let userId = req.user?.id_usuario || null;

        // Validar datos requeridos
        if (!contactInfo || !items || !total) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos requeridos'
            });
        }

        // Si no hay usuario registrado, crear uno nuevo
        if (!userId) {
            try {
                const newUser = await createNewUser(contactInfo);
                userId = newUser.id_usuario;
            } catch (error) {
                console.error('Error creando usuario nuevo:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error creando usuario'
                });
            }
        }

        // Calcular cantidad total de items
        const cantidadTotal = items.reduce((total, item) => total + item.quantity, 0);

        // Crear la orden en la base de datos
        const orderRepository = AppDataSource.getRepository(OrderEntity);
        const newOrder = orderRepository.create({
            contactInfo,
            items,
            total,
            cantidad: cantidadTotal,
            status: 'pending',
            id_usuario: userId,
        });

        const savedOrder = await orderRepository.save(newOrder);

        // Crear items para Mercado Pago
        const preferenceItems = items.map(item => ({
            id: item.id.toString(),
            title: item.nombre,
            quantity: item.quantity,
            unit_price: item.precio,
            currency_id: 'CLP'
        }));

        // Crear la preferencia de pago
        const preferenceData = {
            items: preferenceItems,
            payer: {
                name: contactInfo.nombre,
                surname: contactInfo.apellidos,
                email: contactInfo.email,
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL || 'http://localhost:444'}/payment-success`,
                failure: `${process.env.FRONTEND_URL || 'http://localhost:444'}/payment-failure`,
                pending: `${process.env.FRONTEND_URL || 'http://localhost:444'}/payment-pending`
            },
            auto_return: 'approved',
            external_reference: savedOrder.id.toString(),
            notification_url: `${process.env.API_BASE_URL || 'http://localhost:3000/api'}/orders/webhook`,
        };

        const response = await preference.create({ body: preferenceData });

        // Actualizar la orden con el preference_id
        savedOrder.preferenceId = response.id;
        await orderRepository.save(savedOrder);

        res.json({
            success: true,
            preferenceId: response.id,
            orderId: savedOrder.id
        });

    } catch (error) {
        console.error('Error creando orden de pago:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Verificar estado del pago
export const verifyPaymentStatus = async (req, res) => {
    try {
        const { paymentId, orderId } = req.params;

        const orderRepository = AppDataSource.getRepository(OrderEntity);
        const order = await orderRepository.findOne({
            where: { id: parseInt(orderId) }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Orden no encontrada'
            });
        }

        res.json({
            success: true,
            order: {
                id: order.id,
                status: order.status,
                total: order.total,
                items: order.items,
                createdAt: order.createdAt
            }
        });

    } catch (error) {
        console.error('Error verificando estado del pago:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Función para actualizar stock de productos
const updateProductStock = async (items) => {
    const productRepository = AppDataSource.getRepository(ProductoEntity);
    
    for (const item of items) {
        const product = await productRepository.findOne({
            where: { id_producto: item.id }
        });
        
        if (product) {
            const newStock = product.stock - item.quantity;
            if (newStock >= 0) {
                product.stock = newStock;
                await productRepository.save(product);
                console.log(`Stock actualizado para producto ${item.nombre}: ${product.stock}`);
            } else {
                console.warn(`Stock insuficiente para producto ${item.nombre}`);
            }
        }
    }
};

// Webhook de Mercado Pago
export const handleWebhook = async (req, res) => {
    try {
        const { type, data } = req.body;

        if (type === 'payment') {
            const paymentId = data.id;
            
            // Consultar el pago a Mercado Pago
            const paymentData = await payment.get({ id: paymentId });
            
            if (paymentData.status === 'approved') {
                // Buscar la orden por external_reference
                const orderRepository = AppDataSource.getRepository(OrderEntity);
                const order = await orderRepository.findOne({
                    where: { id: parseInt(paymentData.external_reference) }
                });
                
                if (order && order.status !== 'paid') {
                    // Actualizar estado de la orden
                    order.status = 'paid';
                    order.paymentId = paymentId;
                    await orderRepository.save(order);
                    
                    // Actualizar stock de productos
                    await updateProductStock(order.items);
                    
                    console.log(`Orden ${order.id} marcada como pagada y stock actualizado`);
                }
            } else if (paymentData.status === 'rejected' || paymentData.status === 'cancelled') {
                // Actualizar estado de la orden como fallida
                const orderRepository = AppDataSource.getRepository(OrderEntity);
                const order = await orderRepository.findOne({
                    where: { id: parseInt(paymentData.external_reference) }
                });
                
                if (order) {
                    order.status = 'failed';
                    order.paymentId = paymentId;
                    await orderRepository.save(order);
                    
                    console.log(`Orden ${order.id} marcada como fallida`);
                }
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Error en webhook:', error);
        res.status(500).send('Error');
    }
};

// Obtener órdenes del usuario
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id_usuario;

        const orderRepository = AppDataSource.getRepository(OrderEntity);
        const orders = await orderRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });

        res.json({
            success: true,
            orders: orders.map(order => ({
                id: order.id,
                status: order.status,
                total: order.total,
                items: order.items,
                createdAt: order.createdAt
            }))
        });

    } catch (error) {
        console.error('Error obteniendo órdenes del usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
