import { useState, useCallback } from "react";

import {
  mockExchangeRateList,
  mockExchangeRateHistoryList,
  MOCK_CONFIG,
} from "../services/mock/mockData";

type GetCurrencyHistoryProps = (
  fromDate: string,
  toDate: string
) => Promise<Record<string, string>[] | undefined>;

type GetListingProps = (
  date: string
) => Promise<Record<string, string>[] | undefined>;

interface UseGetListingReturnProps {
  loading: boolean;
  error: string | null;
  getCurrencyHistory: GetCurrencyHistoryProps;
  getListing: GetListingProps;
}

type UseGetListingProps = () => UseGetListingReturnProps;

export const useGetListings: UseGetListingProps = (
  useMockData = MOCK_CONFIG.enableMockData
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getListing: GetListingProps = useCallback(async (date) => {
    setLoading(true);
    setError(null);

    try {
      if (useMockData) {
        await new Promise((resolve) =>
          setTimeout(resolve, MOCK_CONFIG.apiDelay)
        );

        return mockExchangeRateList;
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, []);

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

  return { loading, error, getCurrencyHistory, getListing };
};
