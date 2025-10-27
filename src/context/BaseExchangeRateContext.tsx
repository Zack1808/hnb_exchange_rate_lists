import React, { createContext, useContext, useState, useEffect } from "react";

import { useGetListings } from "../hooks/useGetListing";

interface BaseExchangeRateProviderProps {
  children: React.ReactNode;
}

const BaseExchangeRateContext = createContext<Record<string, string>[]>([]);

export const useBaseExchangeRate = () => {
  return useContext(BaseExchangeRateContext);
};

const BaseExchangeRateProvider = ({
  children,
}: BaseExchangeRateProviderProps) => {
  const [data, setData] = useState<Record<string, string>[]>([]);

  const { getListing } = useGetListings();

  useEffect(() => {
    const fetchData = async () => {
      const newData = await getListing("2023-01-01");

      if (!newData) return;

      setData(newData);
    };

    fetchData();
  }, []);

  return (
    <BaseExchangeRateContext.Provider value={data}>
      {children}
    </BaseExchangeRateContext.Provider>
  );
};

export default BaseExchangeRateProvider;
