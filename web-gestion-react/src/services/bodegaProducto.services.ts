import api from "@services/api";

export type ProductoBodega = {
  id: number;
  nombre_producto: string;
  stock: number;
  tipo: "material" | "relleno" | "producto";
};

export async function getAllProductosDesdeBodega(): Promise<{
  data?: ProductoBodega[];
  error?: string;
}> {
  try {
    const res = await api.get("/bodega/");
    const rawList = res.data?.data?.[0];
    
    if (!Array.isArray(rawList)) {
      return { error: "Formato inesperado en respuesta de bodega" };
    }

    const productos: ProductoBodega[] = rawList
      .filter(item => item?.producto && item?.id_bodega)
      .map((item: any) => ({
        id: item.id_bodega,
        nombre_producto: item.producto.nombre_producto,
        stock: item.stock,
        tipo: "producto",
      }));
      
    return { data: productos };
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || "Error inesperado en bodega";
    return { error: errorMsg };
  }
}



