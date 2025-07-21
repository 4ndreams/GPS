import { useState, useEffect } from "react";
import { filtro } from "@services/bodega.service";

// ✅ Tipo individual de bodega formateada
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


// ✅ Tipo de error si quieres mantenerlo como string o null
type ErrorType = string | null;

const useGetAllBodega = () => {
  const [bodegas, setBodegas] = useState<BodegaUI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ErrorType>(null);
  console.log("useGetAllBodega initialized");
 const fetchBodegas = async () => {
  try {
    console.log("Fetching bodegas...");
    setLoading(true);
    console.log("Calling filtro service...");
    const json = await filtro(); // ✅ ESTA ES LA CORRECCIÓN
    console.log("Response JSON:", json);

    const bodegasConMaterial: BodegaRaw[] = json.data.bodegasConMaterial || [];
    const bodegasConRelleno: BodegaRaw[] = json.data.bodegasConRelleno || [];

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

    console.log("Materiales:", materiales);
    console.log("Rellenos:", rellenos);

    setBodegas([...materiales, ...rellenos]);
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

  return { bodegas, loading, error, fetchBodegas };
};

export default useGetAllBodega;


