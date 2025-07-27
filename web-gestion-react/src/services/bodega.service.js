import api from "@services/api.js";
import cookies from "js-cookie";

export async function getBodega(idBodega) {
    try {
       const {data} = await api.get(`/bodega/${idBodega}`);
       return data.data;
    } catch (error) {
       return error.response.data;
    }
}

export async function getBodegas() {
    try {
        const {data} = await api.get('/bodega/');
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function filtro() {
  try {
    const response = await api.get('/com_mes/Filtros');
  
    return response.data;
  } catch (error) {
    console.error("Error al obtener filtros:", error);
    return error.response?.data || { status: "Error", message: "No se pudo obtener los filtros" };
  }
}
export async function comprasTotalesFiltradas(body) {
    try {
        const token = cookies.get('token');
        const response = await api.post('/com_mes/compras', body, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener compras totales filtradas:", error);
        return error.response?.data || { status: "Error", message: "No se pudo obtener las compras totales filtradas" };
    }
}
export async function ventasTotalesPorMes(body) {
    try {
        const token = cookies.get('token');
        const response = await api.post('/com_mes/ventas', body, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener ventas totales por mes:", error);
        return error.response?.data || { status: "Error", message: "No se pudo obtener las ventas totales por mes" };
    }
}
