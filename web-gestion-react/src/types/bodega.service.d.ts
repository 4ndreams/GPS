declare module "@services/bodega.service" {

   export type ComprasFiltroBody = {
    fecha_inicial?: string;
    fecha_final?: string;
    id_bodega?: number | string | number[];
    tipo?: "material" | "relleno";
  };
  export type ComprasFiltroResponse = {
    data: {
      bodegasConMaterial: BodegaRaw[];
      bodegasConRelleno: BodegaRaw[];
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
  export function filtro(): Promise<Response>;
  export function comprasTotalesFiltradas(body: ComprasFiltroBody): Promise<ComprasFiltroResponse>;
}