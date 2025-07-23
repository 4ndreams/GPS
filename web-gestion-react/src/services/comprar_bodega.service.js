import api from "@services/api.js";
import cookies from "js-cookie";

export const comprar_bodega = async (body) => {
    try {
        const token = cookies.get('token') || localStorage.getItem('token');
        const response = await api.post('/compXbog/', body, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al realizar la compra en bodega:", error);
        throw error;
    }
}