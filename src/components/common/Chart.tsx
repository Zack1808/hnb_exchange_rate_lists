import { type FC, Fragment, ReactNode } from "react";
import { ImArrowDown, ImArrowUp } from "react-icons/im";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

import { convertToDateString } from "../../utils/dateUtils";

const MONTHS = [
  "Sij",
  "Velj",
  "Ožu",
  "Tra",
  "Svi",
  "Lip",
  "Srp",
  "Kol",
  "Ruj",
  "Lis",
  "Stu",
  "Pro",
] as const;

export const CURRENCY_COLORS = {
  AUD: {
    primary: "#2563EB",
    secondary: "#93C5FD",
  },
  BAM: {
    primary: "#16A34A",
    secondary: "#86EFAC",
  },
  CAD: {
    primary: "#DC2626",
    secondary: "#FCA5A5",
  },
  CHF: {
    primary: "#9333EA",
    secondary: "#D8B4FE",
  },
  CZK: {
    primary: "#EA580C",
    secondary: "#FDBA74",
  },
  DKK: {
    primary: "#0891B2",
    secondary: "#67E8F9",
  },
  GBP: {
    primary: "#4F46E5",
    secondary: "#A5B4FC",
  },
  HUF: {
    primary: "#CA8A04",
    secondary: "#FDE047",
  },
  JPY: {
    primary: "#DB2777",
    secondary: "#F9A8D4",
  },
  NOK: {
    primary: "#0F766E",
    secondary: "#5EEAD4",
  },
  PLN: {
    primary: "#7C3AED",
    secondary: "#C4B5FD",
  },
  SEK: {
    primary: "#0284C7",
    secondary: "#7DD3FC",
  },
  USD: {
    primary: "#15803D",
    secondary: "#86EFAC",
  },
};

const BASE_Y_AXIS_LABEL = "Rast/pad tečaja";

type Currency = keyof typeof CURRENCY_COLORS;

interface ChartData {
  datum_primjene: string;
  broj_tecajnice: string | number;
  valuta?: string;
  srednji_tecaj?: string | number;
  postotak_od_prosle_liste?: string | number;
  postotak_od_pocetka?: string | number;
  [key: string]: string | number | undefined;
}

interface ChartProps {
  chartData: ChartData[];
  currency: Currency | Currency[];
  multiple?: boolean;
}

interface ChangeIndicatorProps {
  value: string | number | undefined;
  children?: ReactNode;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
  }>;
  multiple: boolean;
  currencies: Currency[];
}

interface TooltipDataProps {
  data: ChartData;
}

const getChangeClassName = (value: string | number | undefined) => {
  const numericValue = Number(value);

  if (numericValue === 0 || Number.isNaN(numericValue)) {
    return "flex items-center justify-center gap-2";
  }

  return `flex items-center justify-center gap-2 ${numericValue < 0 ? "text-red-600" : "text-green-700"}`;
};

const ChangeIndicator = ({ value }: ChangeIndicatorProps) => {
  const numericValue = Number(value);

  return (
    <span className={getChangeClassName(value)}>
      {numericValue !== 0 && !Number.isNaN(numericValue) ? (
        numericValue < 0 ? (
          <ImArrowDown aria-hidden="true" />
        ) : (
          <ImArrowUp aria-hidden="true" />
        )
      ) : null}{" "}
      {value}%
    </span>
  );
};

const getMonthLabel = (value: string | number) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const createMonthLabelIndexes = (data: ChartData[]) => {
  const firstIndexByMonth = new Map<string, number>();

  data.forEach((item, index) => {
    const date = new Date(item.datum_primjene);

    if (Number.isNaN(date.getTime())) return;

    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!firstIndexByMonth.has(key)) firstIndexByMonth.set(key, index);
  });

  return firstIndexByMonth;
};

const Chart: FC<ChartProps> = ({ chartData, currency, multiple = false }) => {
  const currs = Array.isArray(currency) ? currency : [currency];
  const monthLabelIndexes = createMonthLabelIndexes(chartData);

  const getXAxisLabel = (value: string | number, index: number) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    const key = `${date.getFullYear()}-${date.getMonth()}`;

    return monthLabelIndexes.get(key) === index ? getMonthLabel(value) : "";
  };

  return (
    <div
      role="img"
      aria-label={`Grafikon promjene tečaja ${currs.join(", ")}`}
      className="h-full w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid stroke="#ddd" strokeDasharray="5 5" vertical={false} />

          <XAxis
            dataKey="datum_primjene"
            type="category"
            tickFormatter={getXAxisLabel}
            label={{
              value: "Period",
              position: "insideBottom",
              offset: 40,
            }}
          />

          <YAxis
            label={{
              value: `${BASE_Y_AXIS_LABEL} ${!multiple ? `${currs[0]}-a` : ""} u %`,
              angle: -90,
              position: {
                x: 10,
                y: multiple ? 150 : 50,
              },
            }}
          />

          {currs.map((item) => {
            const colors = CURRENCY_COLORS[item];

            return (
              <Fragment key={item}>
                <Line
                  dot={false}
                  strokeWidth={2}
                  dataKey={
                    multiple
                      ? `${item}_postotak_od_pocetka`
                      : "postotak_od_pocetka"
                  }
                  name={`${item} - od uvođenja EUR`}
                  stroke={colors.primary}
                />

                <Line
                  dot={false}
                  strokeWidth={2}
                  stroke={colors.secondary}
                  dataKey={
                    multiple
                      ? `${item}_postotak_od_prosle_liste`
                      : "postotak_od_prosle_liste"
                  }
                  name={`${item} - dnevno`}
                />
              </Fragment>
            );
          })}

          <Legend
            iconType="diamond"
            iconSize={15}
            align="left"
            wrapperStyle={{
              paddingTop: 10,
            }}
          />

          <Tooltip
            content={<CustomTooltip multiple={multiple} currencies={currs} />}
            allowEscapeViewBox={{ x: false, y: false }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomTooltip = ({
  active,
  payload,
  multiple,
  currencies,
}: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  const date = new Date(data.datum_primjene);

  if (Number.isNaN(date.getTime())) return null;

  return multiple ? (
    <MultipleToolTip data={data} currencies={currencies} />
  ) : (
    <SingleToolTip data={data} />
  );
};

const MultipleToolTip = ({
  data,
  currencies,
}: TooltipDataProps & { currencies: Currency[] }) => {
  return (
    <div className="flex max-h-[70vh] max-w-[calc(100vw-50px)] flex-col gap-3 rounded border border-gray-300 bg-white p-3 shadow-md md:max-w-lg">
      <p className="font-semibold">
        {convertToDateString(new Date(data.datum_primjene), "DD.MM.YYYY")}
      </p>

      <div className="flex flex-wrap gap-5">
        {currencies.map((curr) => {
          const dailyChange = data[`${curr}_postotak_od_prosle_liste`];

          const historicalChange = data[`${curr}_postotak_od_pocetka`];

          return (
            <div key={curr} className="mb-3 flex flex-col gap-1 text-sm">
              <strong>{curr}</strong>

              <p className="flex min-w-max gap-2 text-xs">
                Dnevno: <ChangeIndicator value={dailyChange} />
              </p>

              <p className="flex min-w-max gap-2 text-xs">
                od 01.01.2023:
                <ChangeIndicator value={historicalChange} />
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SingleToolTip = ({ data }: TooltipDataProps) => {
  return (
    <div className="flex p-3 min-w-max flex-col gap-3 rounded border border-gray-300 bg-white shadow-md">
      <p className="font-semibold">
        Datum:{" "}
        {convertToDateString(new Date(data.datum_primjene), "DD.MM.YYYY")}
      </p>

      <div className="flex flex-col gap-1 text-sm">
        <p>Broj tečajnice: {data.broj_tecajnice}</p>
        <p>Valuta: {data.valuta}</p>
        <p>Srednji tečaj: {data.srednji_tecaj}</p>

        <p className="flex gap-3">
          Dnevni rast/pad {data.valuta}-a:
          <ChangeIndicator value={data.postotak_od_prosle_liste} />
        </p>

        <p className="flex gap-3">
          Rast/pad {data.valuta}-a od uvođenja EUR 01.01.2023:
          <ChangeIndicator value={data.postotak_od_pocetka} />
        </p>
      </div>
    </div>
  );
};

export default Chart;
