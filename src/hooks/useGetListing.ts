import { useState, useCallback } from "react";

import { hnbApi } from "../services/api/hnbApi";

import {
  mockExchangeRateList,
  mockExchangeRateHistoryList,
  MOCK_CONFIG,
} from "../services/mock/mockData";

type GetCurrencyHistoryProps = (
  fromDate: string,
  toDate: string,
) => Promise<Record<string, string>[] | undefined>;

type GetListingProps = (
  date: string,
) => Promise<Record<string, string>[] | undefined>;

interface UseGetListingReturnProps {
  loading: boolean;
  error: string | null;
  getCurrencyHistory: GetCurrencyHistoryProps;
  getListing: GetListingProps;
}

type UseGetListingProps = () => UseGetListingReturnProps;

export const useGetListings: UseGetListingProps = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getListing: GetListingProps = useCallback(async (date) => {
    setLoading(true);
    setError(null);

    try {
      if (MOCK_CONFIG.enableMockData) {
        await new Promise((resolve) =>
          setTimeout(resolve, MOCK_CONFIG.apiDelay),
        );

        return mockExchangeRateList;
      }

      const data = await hnbApi.getListData(date);

      return data;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Nešto je pošlo po zlu tokom dobavljanja podataka. Molimo pokušajte osvježiti stranicu ili pokušajte kasnije ";

      setError(message);

      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrencyHistory: GetCurrencyHistoryProps = useCallback(
    async (fromDate, toDate) => {
      setLoading(true);
      setError(null);

      try {
        if (MOCK_CONFIG.enableMockData) {
          await new Promise((resolve) =>
            setTimeout(resolve, MOCK_CONFIG.apiDelay),
          );

          return mockExchangeRateHistoryList;
        }
      } catch (err: any) {
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { loading, error, getCurrencyHistory, getListing };
};
