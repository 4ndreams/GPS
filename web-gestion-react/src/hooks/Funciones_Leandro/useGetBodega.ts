import { useState, useEffect } from "react";
import { getBodega } from "@services/bodega.service.js";

const useGetBodega = (idBodega) => {
    const [bodega, setBodega] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBodega = async () => {
            try {
                setLoading(true);
                const data = await getBodega(idBodega);
                setBodega(data);
            } catch (err) {
                setError(err.message || 'Error al obtener la bodega');
            } finally {
                setLoading(false);
            }
        };

        fetchBodega();
    }, [idBodega]);

    return { bodega, loading, error };
}
export default useGetBodega;