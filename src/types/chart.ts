import { CURRENCY_COLORS } from "../components/common/Chart";

export type Currency = keyof typeof CURRENCY_COLORS;

export type ChartData = {
  datum_primjene: string;
  [key: string]: string | number;
};
