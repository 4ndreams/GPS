import { useState, useEffect } from "react";
import { filtro } from "@services/bodega.service";

type BodegaUI = {
  id: number;
  tipo: "material" | "relleno";
  nombre: string;
  stock: number;
};

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

type ErrorType = string | null;

interface BackendResponse {
  status: string;
  message?: string;
  data?: {
    bodegasConMaterial?: BodegaRaw[];
    bodegasConRelleno?: BodegaRaw[];
  };
}

const useGetAllBodega = () => {
  const [bodegas, setBodegas] = useState<BodegaUI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ErrorType>(null);

  const fetchBodegas = async () => {
    try {
      setLoading(true);

      const json: BackendResponse = await filtro(); // ✅ sin .json()

      if (json.status !== "Success" || !json.data) {
        throw new Error(json.message || "Respuesta inválida del servidor");
      }

      const bodegasConMaterial = json.data.bodegasConMaterial || [];
      const bodegasConRelleno = json.data.bodegasConRelleno || [];

      const materiales: BodegaUI[] = bodegasConMaterial
        .filter((b): b is BodegaRaw & { material: Material } => b.material !== null)
        .map((b) => ({
          id: b.id_bodega,
          tipo: "material",
          nombre: b.material.nombre_material,
          stock: b.stock ?? 0,
        }));

      const rellenos: BodegaUI[] = bodegasConRelleno
        .filter((b): b is BodegaRaw & { relleno: Relleno } => b.relleno !== null)
        .map((b) => ({
          id: b.id_bodega,
          tipo: "relleno",
          nombre: b.relleno.nombre_relleno,
          stock: b.stock ?? 0,
        }));

      setBodegas([...materiales, ...rellenos]);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al obtener las bodegas");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBodegas();
  }, []);

  return { bodegas, loading, error, fetchBodegas , refetch: fetchBodegas };
};

export default useGetAllBodega;
