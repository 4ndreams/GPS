// src/components/TablaCompras.tsx
import { useState, useMemo } from "react";
import useCrearCompra from "@hooks/Funciones_Leandro/comXbodega";
import useGetAllBodega from "@Funciones_Leandro/useGetAllBodegas";

interface CrearCompraDTO {
  nombre_producto: string;
  tipo: "material" | "relleno";
  stock: number;
  costo_compra: number;
}

interface BuscarCompraDTO {
  id_bodega: number;
  nombre_producto: string;
  tipo: "material" | "relleno";
  stock: number;
  costo_compra: number;
}

type CompraInput = {
  nombre_producto: string;
  tipo: "material" | "relleno";
  stock: number;
  costo_compra: number;
  id_bodega?: number;
  modoCrear: boolean;
};

const TablaCompras = () => {
  const { crearCompra, resultado, loading, error } = useCrearCompra();
  const { bodegas, loading: loadingBodegas } = useGetAllBodega();

  const [compras, setCompras] = useState<CompraInput[]>([
    {
      nombre_producto: "",
      tipo: "material",
      stock: 0,
      costo_compra: 0,
      modoCrear: true,
    },
  ]);

  const [errores, setErrores] = useState<Record<number, string>>({});

  const handleChange = (
    index: number,
    field: keyof CompraInput,
    value: any
  ) => {
    const nuevasCompras = [...compras];

    if (field === "nombre_producto") {
      nuevasCompras[index].nombre_producto = value;

      if (!nuevasCompras[index].modoCrear) {
        const bodega = bodegas.find((b) => b.nombre === value);
        nuevasCompras[index].id_bodega = bodega?.id;
        nuevasCompras[index].tipo = bodega?.tipo || "material";
      }
    } else {
      (nuevasCompras[index] as any)[field] = value;
    }

    setCompras(nuevasCompras);
  };

  const toggleModoCrear = (index: number) => {
    const nuevasCompras = [...compras];
    nuevasCompras[index].modoCrear = !nuevasCompras[index].modoCrear;
    nuevasCompras[index].nombre_producto = "";
    setCompras(nuevasCompras);
  };

  const agregarFila = () => {
    setCompras([
      ...compras,
      {
        nombre_producto: "",
        tipo: "material",
        stock: 0,
        costo_compra: 0,
        modoCrear: true,
      },
    ]);
  };

  const eliminarFila = (index: number) => {
    const nuevasCompras = [...compras];
    nuevasCompras.splice(index, 1);
    setCompras(nuevasCompras);

    const nuevosErrores = { ...errores };
    delete nuevosErrores[index];
    setErrores(nuevosErrores);
  };

  const enviarCompras = async () => {
    const nuevosErrores: Record<number, string> = {};
    let hayErrores = false;

    compras.forEach((compra, i) => {
      if (!compra.nombre_producto.trim()) {
        nuevosErrores[i] = "Debe ingresar un producto.";
        hayErrores = true;
      } else if (compra.stock <= 0) {
        nuevosErrores[i] = "El stock debe ser mayor a 0.";
        hayErrores = true;
      } else if (compra.costo_compra <= 0) {
        nuevosErrores[i] = "El costo debe ser mayor a 0.";
        hayErrores = true;
      } else if (
        compra.modoCrear &&
        bodegas.some((b) => b.nombre.toLowerCase() === compra.nombre_producto.toLowerCase())
      ) {
        nuevosErrores[i] = "Ya existe un producto con ese nombre.";
        hayErrores = true;
      }
    });

    setErrores(nuevosErrores);

    if (hayErrores) return;

    for (const compra of compras) {
      const data: CrearCompraDTO | BuscarCompraDTO = compra.modoCrear
        ? {
            nombre_producto: compra.nombre_producto,
            tipo: compra.tipo,
            stock: compra.stock,
            costo_compra: compra.costo_compra,
          }
        : {
            id_bodega: compra.id_bodega!,
            nombre_producto: compra.nombre_producto,
            tipo: compra.tipo,
            stock: compra.stock,
            costo_compra: compra.costo_compra,
          };

      await crearCompra(data);
    }
  };

  const productosOptions = useMemo(() => {
    return bodegas.map((b) => ({
      label: `${b.nombre} (${b.tipo})`,
      value: b.nombre,
    }));
  }, [bodegas]);

  const filtrarProductos = (input: string) =>
    productosOptions.filter((op) =>
      op.label.toLowerCase().includes(input.toLowerCase())
    );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Botones fijos arriba */}
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pt-2 pb-4">
        <button
          onClick={agregarFila}
          className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded shadow"
        >
          ➕ Añadir producto
        </button>

        <button
          onClick={enviarCompras}
          disabled={loading || loadingBodegas}
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "✔ Guardar Compras"}
        </button>
      </div>

      {/* Card scrollable */}
      <div className="border rounded-lg shadow p-4 max-h-[500px] overflow-y-auto bg-white space-y-4">
        {compras.map((compra, index) => {
          const opcionesFiltradas = filtrarProductos(compra.nombre_producto);
          return (
            <div
              key={index}
              className="flex flex-wrap md:flex-nowrap items-end gap-4 border p-4 rounded-md shadow-sm relative"
            >
              {/* Campo nombre */}
              <div className="flex-1 min-w-[160px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {compra.modoCrear ? "Nuevo producto" : "Lista de productos"}
                </label>
                {compra.modoCrear ? (
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={compra.nombre_producto}
                    onChange={(e) =>
                      handleChange(index, "nombre_producto", e.target.value)
                    }
                  />
                ) : (
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    list={`productos-${index}`}
                    value={compra.nombre_producto}
                    onChange={(e) =>
                      handleChange(index, "nombre_producto", e.target.value)
                    }
                  />
                )}
                {!compra.modoCrear && (
                  <datalist id={`productos-${index}`}>
                    {opcionesFiltradas.map((op, i) => (
                      <option key={i} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </datalist>
                )}
                {errores[index] && (
                  <p className="text-red-600 text-sm mt-1">{errores[index]}</p>
                )}
              </div>

              {/* Campo stock */}
              <div className="min-w-[90px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={compra.stock}
                  onChange={(e) =>
                    handleChange(index, "stock", +e.target.value)
                  }
                />
              </div>

              {/* Campo tipo */}
              <div className="min-w-[100px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                {compra.modoCrear ? (
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={compra.tipo}
                    onChange={(e) =>
                      handleChange(index, "tipo", e.target.value as any)
                    }
                  >
                    <option value="material">Material</option>
                    <option value="relleno">Relleno</option>
                  </select>
                ) : (
                  <div className="px-2 py-2 border rounded bg-gray-100 text-sm text-gray-700">
                    {compra.tipo}
                  </div>
                )}
              </div>

              {/* Campo costo */}
              <div className="min-w-[110px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={compra.costo_compra}
                  onChange={(e) =>
                    handleChange(index, "costo_compra", +e.target.value)
                  }
                />
              </div>

              {/* Botones individuales */}
              <div className="ml-auto flex flex-col gap-2 items-end">
                <button
                  onClick={() => toggleModoCrear(index)}
                  className={`text-xs px-3 py-2 rounded-full shadow-sm transition font-medium ${
                    compra.modoCrear
                      ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  }`}
                >
                  {compra.modoCrear ? "🔃Cambiar modo a lista " : "🔃Cambiar modo a crear"}
                </button>
                <button
                  onClick={() => eliminarFila(index)}
                  className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                  ❌ Quitar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensajes de éxito o error */}
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {resultado && <p className="text-green-600 mt-4">{resultado.mensaje}</p>}
    </div>
  );
};

export default TablaCompras;











