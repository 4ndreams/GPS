import { useEffect, useState } from "react";
import { getInfoAll } from "@services/añadirPuertaService";

type TipoItem = "producto" | "material" | "relleno";

interface Producto {
  id_producto: number;
  nombre_producto: string;
  [key: string]: any;
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

interface ItemUnificado {
  id_bodega: number;
  stock: number;
  tipo: TipoItem;
  detalle: Producto | Material | Relleno;
}

export default function useInfoBodegaUnificada() {
  const [data, setData] = useState<ItemUnificado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await getInfoAll();
      if (res.error) {
        setError(res.error);
      } else if (res.data) {
        setData(res.data);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return {
    data,     // lista de bodega unificada
    loading,  // booleano mientras carga
    error,    // error en string o null
  };
}
