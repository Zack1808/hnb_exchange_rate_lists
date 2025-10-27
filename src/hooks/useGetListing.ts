import { useState, useCallback } from "react";

import {
  mockExchangeRateHistoryList,
  MOCK_CONFIG,
} from "../services/mock/mockData";

type GetCurrencyHistoryProps = (
  fromDate: string,
  toDate: string
) => Promise<Record<string, string>[] | undefined>;

interface UseGetListingReturnProps {
  loading: boolean;
  error: string | null;
  getCurrencyHistory: GetCurrencyHistoryProps;
}

type UseGetListingProps = (useMockData: boolean) => UseGetListingReturnProps;

export const useGetListings: UseGetListingProps = (
  useMockData = MOCK_CONFIG.enableMockData
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrencyHistory: GetCurrencyHistoryProps = useCallback(
    async (fromDate, toDate) => {
      setLoading(true);
      setError(null);

      try {
        if (useMockData) {
          await new Promise((resolve) =>
            setTimeout(resolve, MOCK_CONFIG.apiDelay)
          );

          return mockExchangeRateHistoryList;
        }
      } catch (err: any) {
      } finally {
        setLoading(false);
      }
    },
    [useMockData]
  );

  return { loading, error, getCurrencyHistory };
};
