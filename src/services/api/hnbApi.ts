const HNB_API_URL = "/api?";

type HnbResponse = Record<string, string>[];

const request = async (
  params: Record<string, string>,
): Promise<HnbResponse> => {
  const searchParams = new URLSearchParams(params);

  const response = await fetch(`${HNB_API_URL}${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(
      `HNB API request failed: ${response.status} ${response.statusText}`,
    );
  }
  return response.json() as Promise<HnbResponse>;
};

export const hnbApi = {
  getListData: (date: string) =>
    request({
      "datum-primjene": date,
    }),

  getPeriodData: (fromDate: string, toDate: string) =>
    request({
      "datum-primjene-od": fromDate,
      "datum-primjene-do": toDate,
    }),
};
