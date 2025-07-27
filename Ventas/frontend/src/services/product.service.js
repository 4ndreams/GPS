import axios from './api.js';
import cookies from 'js-cookie';

export async function getProductos() {
    try {
        const { data } = await axios.get(`/products/`);

        const formattedData = data.data.map(item => ({
            id: item.id_producto,
            nombre: item.nombre_producto,
            precio: item.precio,
            // Usar la primera imagen si existe, sino imagen por defecto
            imagen: item.imagenes && item.imagenes.length > 0 
                ? item.imagenes[0].ruta_imagen 
                : (item.imagen_producto || 'default.jpg'),
            // Incluir todas las imágenes
            imagenes: item.imagenes || [],
            categoria: item.tipo,
            quantity: item.stock,
            descripcion: item.descripcion,
            medidas: {
                ancho: item.medida_ancho,
                largo: item.medida_largo,
                alto: item.medida_alto
            },          
        }));

        return formattedData;
    } catch (error) {
        return error.response.data;
    }
}

// Nuevo método para crear producto con imágenes
export async function createProductoConImagenes(productoData, imagenes) {
    try {
        const formData = new FormData();
        
        // Agregar datos del producto
        Object.keys(productoData).forEach(key => {
            if (productoData[key] !== null && productoData[key] !== undefined) {
                formData.append(key, productoData[key]);
            }
        });
        
        // Agregar imágenes
        if (imagenes && imagenes.length > 0) {
            imagenes.forEach((imagen, index) => {
                formData.append('imagenes', imagen);
            });
        }
        
        const { data } = await axios.post('/products/con-imagenes', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

// Nuevo método para actualizar producto con imágenes
export async function updateProductoConImagenes(id, productoData, imagenes) {
    try {
        const formData = new FormData();
        
        // Agregar datos del producto
        Object.keys(productoData).forEach(key => {
            if (productoData[key] !== null && productoData[key] !== undefined) {
                formData.append(key, productoData[key]);
            }
        });
        
        // Agregar imágenes
        if (imagenes && imagenes.length > 0) {
            imagenes.forEach((imagen, index) => {
                formData.append('imagenes', imagen);
            });
        }
        
        const { data } = await axios.patch(`/products/${id}/con-imagenes`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

// Método para obtener un producto específico con sus imágenes
export async function getProductoById(id) {
    try {
        const { data } = await axios.get(`/products/${id}`);
        return data;
    } catch (error) {
        throw error.response?.data || error;
    }
}