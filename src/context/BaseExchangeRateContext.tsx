import React, { createContext, useContext, useState, useEffect } from "react";

import { useGetListings } from "../hooks/useGetListing";

interface BaseExchangeRateProviderProps {
  children: React.ReactNode;
}

interface BaseExchangeRateReturnProps {
  baseData: Record<string, string>[];
}

const BaseExchangeRateContext = createContext<BaseExchangeRateReturnProps>({
  baseData: [],
});

export const useBaseExchangeRate = () => {
  return useContext(BaseExchangeRateContext);
};

const BaseExchangeRateProvider = ({
  children,
}: BaseExchangeRateProviderProps) => {
  const [baseData, setBaseData] = useState<Record<string, string>[]>([]);

  const { getListing } = useGetListings();

  useEffect(() => {
    const fetchData = async () => {
      const newData = await getListing("2023-01-01");

      if (!newData) return;

      setBaseData(newData);
    };

    fetchData();
  }, []);

  return (
    <BaseExchangeRateContext.Provider value={{ baseData }}>
      {children}
    </BaseExchangeRateContext.Provider>
  );
};

export default BaseExchangeRateProvider;
