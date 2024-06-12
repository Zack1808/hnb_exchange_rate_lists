import { useState, useCallback } from "react";
import axios from "axios";

const baseUrl = "https://api.hnb.hr/tecajn-eur/v3";

export const useGetListings = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getListing = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${baseUrl}?datum-primjene=${date}`);
      return data;
    } catch (err) {
      setError(`Došlo je do pogreške: ${err}`);
      console.log(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, getListing };
};
