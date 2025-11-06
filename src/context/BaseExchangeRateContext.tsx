import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { useGetListings } from "../hooks/useGetListing";

interface BaseExchangeRateProviderProps {
  children: React.ReactNode;
}

interface BaseExchangeRateReturnProps {
  baseData: Record<string, string>[];
  currency: Array<string>;
}

const BaseExchangeRateContext = createContext<BaseExchangeRateReturnProps>({
  baseData: [],
  currency: [],
});

export const useBaseExchangeRate = () => {
  return useContext(BaseExchangeRateContext);
};

const BaseExchangeRateProvider = ({
  children,
}: BaseExchangeRateProviderProps) => {
  const [baseData, setBaseData] = useState<Record<string, string>[]>([]);
  const [currency, setCurrency] = useState<Array<string>>([]);

  const { getListing } = useGetListings();

  const getAllCurrencies = useCallback((data: Record<string, string>[]) => {
    return data.map((item: Record<string, string>): string => item.valuta);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const newData = await getListing("2023-01-01");

      if (!newData) return;

      const currs = getAllCurrencies(newData);

      setBaseData(newData);
      setCurrency(currs);
    };

    fetchData();
  }, []);

  return (
    <BaseExchangeRateContext.Provider value={{ baseData, currency }}>
      {children}
    </BaseExchangeRateContext.Provider>
  );
};

export default BaseExchangeRateProvider;
