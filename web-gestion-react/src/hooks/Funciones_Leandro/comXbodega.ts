import { useState } from 'react';
import { comprasBodegaService } from '@services/compras_bodegaService';


interface BodegaActualizada {
  id: number;
  nombre: string;
  stock: number;
}

interface CompraRegistrada {
  id: number;
  fecha: string;
  cantidad: number;
  id_bodega: number;

}

interface CompraResult {
  mensaje: string;
  tipo: 'actualizacion' | 'nueva';
  bodega_actualizada: BodegaActualizada[];
  compra_registrada: CompraRegistrada;
}

interface UseCrearCompraReturn {
  crearCompra: (data: any) => Promise<void>; // puedes reemplazar `any` por el DTO de la compra si lo tienes
  resultado: CompraResult | null;
  loading: boolean;
  error: string | null;
}

export default function useCrearCompra(): UseCrearCompraReturn {
  const [resultado, setResultado] = useState<CompraResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearCompra = async (data: any): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await comprasBodegaService.create(data);


      const result: CompraResult = {
        mensaje: response.mensaje,
        tipo: response.tipo,
        bodega_actualizada: response.bodega_actualizada,
        compra_registrada: response.compra_registrada,
      };

      setResultado(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al crear compra');
      }
    } finally {
      setLoading(false);
    }
  };

  return { crearCompra, resultado, loading, error };
}

