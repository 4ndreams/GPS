import { useState, useEffect } from "react";
import { comprasTotalesFiltradas } from "@services/bodega.service";


const useGetComprasMes = (id_bodega, tipo, fecha_inicial, fecha_final) => {
  const [compras, setCompras]   = useState(null);   // objeto, no array
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    setLoading(true);
    comprasTotalesFiltradas({ id_bodega, tipo, fecha_inicial, fecha_final })
      .then(setCompras)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id_bodega, tipo, fecha_inicial, fecha_final]);

  return { ...compras, loading, error };   // compras, total, cantidad
};
export default useGetComprasMes;