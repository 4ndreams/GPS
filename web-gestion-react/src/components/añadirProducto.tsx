import React, { useMemo, useState } from "react";
import useAñadirPuertas from "@Funciones_Leandro/añadirPuertas";
import useGetAllProductos from "@Funciones_Leandro/getAllPuertas";
import useGetAllBodega from "@Funciones_Leandro/useGetAllBodegas";
import useGetAllProductosDesdeBodega from "@Funciones_Leandro/bodegaProducto";

export default function AñadirPuertasForm() {
  const { productos, loading: loadingProductos, error: errorProductos } = useGetAllProductos();
  const {
    bodegas: infoBodega,
    loading: loadingBodega,
    error: errorBodega,
    refetch: refetchBodega,
  } = useGetAllBodega();
  const {
    productosBodega,
    loading: loadingBodega2,
    error: errorBodega2,
    refetch: refetchProductosBodega,
  } = useGetAllProductosDesdeBodega();
  const { añadirPuertas, loading, error, response } = useAñadirPuertas();

  const [selectedProducto, setSelectedProducto] = useState<string>("");
  const [cantidad, setCantidad] = useState<number>(0);
  const [tocadoSelect, setTocadoSelect] = useState(false);

  const normalizar = (texto: string) => texto?.trim().toLowerCase();

  const producto = useMemo(() => {
    return productos?.find(
      (p) => normalizar(p.nombre_producto) === normalizar(selectedProducto)
    );
  }, [productos, selectedProducto]);

  const productoEnBodega = useMemo(() => {
    const data = productosBodega?.data ?? productosBodega ?? [];
    return data.find(
      (b) => normalizar(b.nombre_producto) === normalizar(selectedProducto)
    );
  }, [productosBodega, selectedProducto]);

  const materialesRelacionados = useMemo(() => {
    return (
      infoBodega?.filter(
        (item) =>
          item.tipo === "material" &&
          normalizar(item.nombre) ===
            normalizar(producto?.material?.nombre_material || "")
      ) ?? []
    );
  }, [infoBodega, producto]);

  const rellenoRelacionado = useMemo(() => {
    return (
      infoBodega?.filter(
        (item) =>
          item.tipo === "relleno" &&
          normalizar(item.nombre) ===
            normalizar(producto?.relleno?.nombre_relleno || "")
      ) ?? []
    );
  }, [infoBodega, producto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTocadoSelect(true);

    if (!selectedProducto.trim()) {
      alert("Debes seleccionar un producto");
      return;
    }
    if (cantidad <= 0) {
      alert("La cantidad debe ser mayor que 0");
      return;
    }

    await añadirPuertas({
      nombre_producto: selectedProducto,
      stock: cantidad,
    });

    await Promise.all([refetchBodega(), refetchProductosBodega()]);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto p-4 bg-white shadow-md rounded-xl">
      {/* Formulario */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Añadir Puertas</h2>

        {loadingProductos && <p>Cargando productos...</p>}
        {errorProductos && <p className="text-red-500">Error: {errorProductos}</p>}

        {!loadingProductos && !errorProductos && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Producto</label>
              <select
                value={selectedProducto}
                onChange={(e) => {
                  setSelectedProducto(e.target.value);
                  setTocadoSelect(true);
                }}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">-- Selecciona un producto --</option>
                {productos.map((p) => (
                  <option key={p.id_producto} value={p.nombre_producto}>
                    {p.nombre_producto}
                  </option>
                ))}
              </select>
              {tocadoSelect && !selectedProducto && (
                <p className="text-red-500 text-sm mt-1">⚠️ Debes seleccionar un producto</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Cantidad</label>
              <input
                type="number"
                min={1}
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value, 10))}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Procesando..." : "Añadir"}
            </button>

            {error && <p className="text-red-500 mt-2">❌ {error}</p>}
            {response && <p className="text-green-600 mt-2">✅ {response.mensaje}</p>}
          </form>
        )}
      </div>

      {/* Información relacionada */}
      {selectedProducto && (
        <div className="mt-6 bg-gray-100 p-4 rounded-xl w-full md:w-1/2">
          <h3 className="text-lg font-semibold mb-2">📦 Stock en fábrica</h3>

          {loadingBodega ? (
            <p>Cargando stock...</p>
          ) : errorBodega ? (
            <p className="text-red-500">{errorBodega}</p>
          ) : (
            <>
              <h4 className="font-semibold">🚪 Producto seleccionado:</h4>
              {productoEnBodega ? (
                <ul className="list-disc pl-5">
                  <li>
                    Stock disponible: {productoEnBodega?.stock ?? 0} unidades
                  </li>
                </ul>
              ) : (
                <p className="text-sm text-gray-600 mb-4">
                  No hay stock disponible para este producto en bodega.
                </p>
              )}

              {/* Materiales */}
              <h4 className="font-semibold mt-6">🧱 Materiales:</h4>
              {materialesRelacionados.length > 0 ? (
                <ul className="list-disc pl-5">
                  {materialesRelacionados.map((mat) => (
                    <li key={mat.id}>
                      {mat.nombre}: {mat.stock}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">No hay materiales asociados.</p>
              )}

              {/* Rellenos */}
              <h4 className="font-semibold mt-6">🧩 Rellenos:</h4>
              {rellenoRelacionado.length > 0 ? (
                <ul className="list-disc pl-5">
                  {rellenoRelacionado.map((rel) => (
                    <li key={rel.id}>
                      {rel.nombre}: {rel.stock}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">No hay rellenos asociados.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
