import axios from './api.js';
import cookies from 'js-cookie';

export async function getProductos() {
    try {

        const { data } = await axios.get(`/product/all/`);

        const formattedData = data.data.map(item => ({
            id: item.id_producto,
            nombre: item.nombre_producto,
            precio: item.precio,
            imagen: item.imagen_producto || 'default.jpg', 
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