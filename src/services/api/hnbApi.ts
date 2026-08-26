const HNB_API_URL = "/api";

export const hnbApi = {
  getListData: async (date: string): Promise<Record<string, string>[]> => {
    const response = await fetch(`${HNB_API_URL}?datum-primjene=${date}`);

    if (!response.ok) {
      throw new Error(
        `HNB API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  },
  getPeriodData: async (
    fromDate: string,
    toDate: string,
  ): Promise<Record<string, string>[]> => {
    return [];
  },
};
