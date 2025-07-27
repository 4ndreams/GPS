import api from "@services/api";
export type TipoItem = "producto" | "material" | "relleno";
interface AñadirPuertasBody {
  nombre_producto: string;
  stock: number;
}

interface AñadirPuertasResponse {
  mensaje: string;
  tipo: "creacion" | "actualizacion";
  producto_aumentado: any;
  material_disminuido: any;
  relleno_disminuido: any;
}


interface Material {
  id_material: number;
  nombre_material: string;
  [key: string]: any;
}

interface Relleno {
  id_relleno: number;
  nombre_relleno: string;
  [key: string]: any;
}


interface Producto {
  id_producto: number;
  nombre_producto: string;
    material?: Material;
    relleno?: Relleno;
  [key: string]: any;
}

export async function añadirPuertasService(
  body: AñadirPuertasBody
): Promise<{
  data?: AñadirPuertasResponse;
  error?: string;
}> {
  try {
    const res = await api.put("/produccion/", body);
    return { data: res.data?.data };
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || "Error inesperado";
    return { error: errorMsg };
  }
}
export async function getAllProductos(
   ): Promise<{
     data?: Producto[];
     error?: string;
   }> {
     try {
       const res = await api.get("/products/all");
       return { data: res.data?.data };
     } catch (err: any) {
       const errorMsg = err.response?.data?.message || "Error inesperado";
       return { error: errorMsg };
     }
   }
