import { useState} from 'react';
import { comprar_bodega } from '@services/c';

const useComprarBodega = (setCompra) => {
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const comprar = async (data) => {
        setLoading(true);
        setError(null);
        try {
        const response = await comprar_bodega(data);
        setCompra(response.data);
        } catch (err) {
        setError(err.message || 'Error al realizar la compra');
        } finally {
        setLoading(false);
        }
    };
    
    return { comprar, loading, error };
};

export default useComprarBodega;


