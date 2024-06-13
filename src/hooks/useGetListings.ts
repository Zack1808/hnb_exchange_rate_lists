import { useState, useCallback } from "react";
import axios from "axios";

export const useGetListings = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getListing = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`/api?datum-primjene=${date}`);
      return data;
    } catch (err) {
      setError(`Došlo je do pogreške: ${err}`);
      console.log(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrencyHistory = useCallback(
    async (fromDate: string, toDate: string) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `/api?datum-primjene-od=${toDate}&datum-primjene-do=${fromDate}`
        );
        return data;
      } catch (err) {
        setError(`Došlo je do pogreške: ${err}`);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, getListing, getCurrencyHistory };
};
