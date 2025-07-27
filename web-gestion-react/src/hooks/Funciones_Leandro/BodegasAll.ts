import { useEffect, useState } from "react";
import { getBodegas} from "@services/bodega.service";

export default function useGetAllBodegas() {
  const [bodegas, setBodegas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBodegas = async () => {
      setLoading(true);
      const result = await getBodegas();
      if (result.status === "Error") {
        setError(result.message);
      } else {
        setBodegas(result);
      }
      setLoading(false);
    };

    fetchBodegas();
  }, []);

  return { bodegas, loading, error };
}
