import { useState, useCallback } from "react";

import { hnbApi } from "../services/api/hnbApi";

import {
  mockExchangeRateList,
  mockExchangeRateHistoryList,
  MOCK_CONFIG,
} from "../services/mock/mockData";

type CurrencyData = Record<string, string>;

interface UseGetListingReturnProps {
  loading: boolean;
  error: string | null;
  getCurrencyHistory: (
    fromDate: string,
    toDate: string,
  ) => Promise<CurrencyData[]>;
  getListing: (date: string) => Promise<CurrencyData[]>;
}

type UseGetListingProps = () => UseGetListingReturnProps;

type RequestFunction<T> = () => Promise<T>;

const DEFAULT_ERROR_MESSAGE =
  "Nešto je pošlo po zlu tokom dobavljanja podataka. Molimo pokušajte osvježiti stranicu ili pokušajte kasnije.";

const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;
};

export const useGetListings: UseGetListingProps = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeRequest = useCallback(
    async (
      request: RequestFunction<CurrencyData[]>,
    ): Promise<CurrencyData[]> => {
      setLoading(true);
      setError(null);
      try {
        return await request();
      } catch (error: unknown) {
        setError(getErrorMessage(error));
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getListing = useCallback(
    async (date: string) => {
      return executeRequest(async () => {
        if (MOCK_CONFIG.enableMockData) {
          await new Promise<void>((resolve) => {
            setTimeout(resolve, MOCK_CONFIG.apiDelay);
          });
          return mockExchangeRateList;
        }
        return hnbApi.getListData(date);
      });
    },
    [executeRequest],
  );

  const getCurrencyHistory = useCallback(
    async (fromDate: string, toDate: string) => {
      return executeRequest(async () => {
        if (MOCK_CONFIG.enableMockData) {
          await new Promise<void>((resolve) => {
            setTimeout(resolve, MOCK_CONFIG.apiDelay);
          });
          return mockExchangeRateHistoryList;
        }
        return hnbApi.getPeriodData(fromDate, toDate);
      });
    },
    [],
  );

  return { loading, error, getCurrencyHistory, getListing };
};
