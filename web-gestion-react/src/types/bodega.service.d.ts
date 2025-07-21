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
    material: null | any; // puedes definir mejor según tus datos reales
    relleno: {
      id_relleno: number;
      nombre_relleno: string;
      caracteristicas: string | null;
      createdAt: string;
      updatedAt: string;
    } | null;
    producto: null | any;
  };
};

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
}
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
  export function filtro(): Promise<Response>;
  export function comprasTotalesFiltradas(body: ComprasFiltroBody): Promise<ComprasFiltroResponse>;
  export function ventasTotalesPorMes(body: ComprasFiltroBody): Promise<VentasTotalesPorMesResponse>;
}