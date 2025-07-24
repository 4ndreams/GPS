declare module "@services/bodega.service" {
  export type Compra = {
    id_compra: number;
    id_bodega: number;
    nombre_producto: string;
    stock: number;
    costo_compra: string;
    createdAt: string;
    updatedAt: string;
    bodega: {
      id_bodega: number;
      stock: number;
      createdAt: string;
      updatedAt: string;
      material: {
        nombre_material: string;
        caracteristicas: string | null;
      } | null;
      relleno: {
        id_relleno: number;
        nombre_relleno: string;
        caracteristicas: string | null;
        createdAt: string;
        updatedAt: string;
      } | null;
      producto: unknown | null; // mejor que `any`
    };
  };
export interface BackendResponse<T = unknown> {
  status: string;
  message?: string;
  data?: T;
}

export function filtro(): Promise<BackendResponse<{ bodegasConMaterial: BodegaRaw[]; bodegasConRelleno: BodegaRaw[] }>>;

interface Material {
  nombre_material: string;
  caracteristicas: string | null;
}

interface Relleno {
  nombre_relleno: string;
  caracteristicas: string | null;
}

interface BodegaRaw {
  id_bodega: number;
  stock: number;
  material: Material | null;
  relleno: Relleno | null;
}
  export type ComprasTotalesFiltradasResponse = {
    status: "Success" | "Error";
    message: string;
    data: {
      compras: Compra[];
      total: number;
      cantidad: number;
    };
  };

  export type ComprasFiltroBody = {
    fecha_inicial?: string;
    fecha_final?: string;
    id_bodega?: number | string | number[];
    tipo?: "material" | "relleno";
  };

  export type VentaFiltroBody = {
    fecha_inicial?: string;
    fecha_final?: string;
  };

  export type VentasTotalesPorMesResponse = {
    status: "Success" | "Error";
    message: string;
    data: {
      total: number;
    };
  };

  export type BodegaRaw = {
    id_bodega: number;
    stock: number;
    material: {
      nombre_material: string;
      caracteristicas: string | null;
    } | null;
    relleno: {
      nombre_relleno: string;
      caracteristicas: string | null;
    } | null;
  };

  // Funciones que exportas desde el backend
  export function filtro(): Promise<Response>;
  export function comprasTotalesFiltradas(body: ComprasFiltroBody): Promise<ComprasTotalesFiltradasResponse>;
  export function ventasTotalesPorMes(body: VentaFiltroBody): Promise<VentasTotalesPorMesResponse>;
}
