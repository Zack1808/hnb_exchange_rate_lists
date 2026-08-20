import React from "react";
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

interface ChartProps {
  chartData: Record<string, string | number>[];
  currency: string | string[];
  multiple?: boolean;
}

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

const Chart: React.FC<ChartProps> = ({
  chartData = [],
  currency,
  multiple,
}) => {
  const currs = Array.isArray(currency) ? currency : [currency];

  return (
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
          tickFormatter={(value, index) => {
            const data = chartData || [];

            const date = new Date(value);
            const month = date.getMonth();
            const year = date.getFullYear();

            const indiciesWithSameMonth = data
              .map((item: Record<string, string | number>, indx: number) =>
                new Date(item.datum_primjene).getMonth() === month ? indx : -1,
              )
              .filter((indx: number) => indx !== -1);

            const middleIndex = indiciesWithSameMonth[0];

            return index === middleIndex ? `${MONTHS[month]} ${year}` : "";
          }}
          label={{
            value: "Period",
            position: "insideBottom",
            offset: 40,
          }}
        />

        <YAxis
          label={{
            value: `Rast/Pad tečaja ${!multiple ? `${currs[0]}-a` : ""} u %`,
            angle: -90,
            position: {
              x: 10,
              y: multiple ? 150 : 50,
            },
          }}
        />

        {currs.map((item) => (
          <React.Fragment key={item}>
            <Line
              dot={false}
              strokeWidth={2}
              dataKey={
                multiple ? `${item}_postotak_od_pocetka` : "postotak_od_pocetka"
              }
              name={`${item} - od uvođenja EUR`}
              stroke={
                CURRENCY_COLORS[item as keyof typeof CURRENCY_COLORS].primary
              }
            />

            <Line
              dot={false}
              strokeWidth={2}
              stroke={
                CURRENCY_COLORS[item as keyof typeof CURRENCY_COLORS].secondary
              }
              dataKey={
                multiple
                  ? `${item}_postotak_od_prosle_liste`
                  : "postotak_od_prosle_liste"
              }
              name={`${item} - dnevno`}
            />
          </React.Fragment>
        ))}

        <Legend
          iconType="diamond"
          iconSize={15}
          align="left"
          wrapperStyle={{
            paddingTop: 10,
          }}
        />

        <Tooltip
          content={
            <CustomTooltip
              multiple={multiple}
              currencies={currs}
              allowEscapeViewBox={{ x: false, y: false }}
            />
          }
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = ({ active, payload, multiple, currencies }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const specificDate = new Date(data.datum_primjene);
    const percentage = data.postotak_od_prosle_liste;
    const historyPercentage = data.postotak_od_pocetka;

    return multiple ? (
      <div
        className="bg-white p-3 border border-gray-300 rounded shadow-md flex flex-col gap-3 md:max-w-lg max-w-[calc(100vw-50px)]
    max-h-[70vh]"
      >
        <p className="font-semibold">{`Datum: ${specificDate.getDate()}.${specificDate.getMonth()}.${specificDate.getFullYear()}`}</p>
        <div className="max-w flex flex-wrap gap-5">
          {currencies.map((curr: string) => (
            <div key={curr} className="text-sm flex flex-col gap-1 mb-3">
              <strong>{curr}</strong>
              <p className="min-w-max flex gap-2 text-xs">
                Dnevno:{" "}
                <span
                  className={`${
                    Number(data[`${curr}_postotak_od_prosle_liste`]) !== 0
                      ? Number(data[`${curr}_postotak_od_prosle_liste`]) <= 0
                        ? "text-red-600"
                        : "text-green-700"
                      : ""
                  } flex items-center justify-center gap-2`}
                >
                  {Number(data[`${curr}_postotak_od_prosle_liste`]) !== 0 ? (
                    Number(data[`${curr}_postotak_od_prosle_liste`]) <= 0 ? (
                      <ImArrowDown />
                    ) : (
                      <ImArrowUp />
                    )
                  ) : null}
                  {data[`${curr}_postotak_od_prosle_liste`]}%
                </span>
              </p>
              <p className="min-w-max flex gap-2 text-xs">
                od 01.01.2023:{" "}
                <span
                  className={`${
                    Number(data[`${curr}_postotak_od_pocetka`]) !== 0
                      ? Number(data[`${curr}_postotak_od_pocetka`]) <= 0
                        ? "text-red-600"
                        : "text-green-700"
                      : ""
                  } flex items-center justify-center gap-2`}
                >
                  {Number(data[`${curr}_postotak_od_pocetka`]) !== 0 ? (
                    Number(data[`${curr}_postotak_od_pocetka`]) <= 0 ? (
                      <ImArrowDown />
                    ) : (
                      <ImArrowUp />
                    )
                  ) : null}
                  {data[`${curr}_postotak_od_pocetka`]}%
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-md flex flex-col gap-3 min-w-max">
        <p className="font-semibold">{`Datum: ${specificDate.getDate()}.${specificDate.getMonth()}.${specificDate.getFullYear()}`}</p>
        <div className="text-sm flex flex-col gap-1">
          <p>Broj tečajnice: {data.broj_tecajnice}</p>
          <p>Valuta: {data.valuta}</p>
          <p> Srednji tečaj: {data.srednji_tecaj}</p>
          <p className="flex gap-3">
            Dnevni rast/pad {data.valuta}-a:{" "}
            <span
              className={`${
                Number(percentage) !== 0
                  ? Number(percentage) <= 0
                    ? "text-red-600"
                    : "text-green-700"
                  : ""
              } flex items-center justify-center gap-2`}
            >
              {Number(percentage) !== 0 ? (
                Number(percentage) <= 0 ? (
                  <ImArrowDown />
                ) : (
                  <ImArrowUp />
                )
              ) : null}
              {percentage}%
            </span>
          </p>
          <p className="flex gap-3">
            Rast/pad {data.valuta}-a od uvođenja EUR 01.01.2023:{" "}
            <span
              className={`${
                Number(historyPercentage) !== 0
                  ? Number(historyPercentage) <= 0
                    ? "text-red-600"
                    : "text-green-700"
                  : ""
              } flex items-center justify-center gap-2`}
            >
              {Number(historyPercentage) !== 0 ? (
                Number(historyPercentage) <= 0 ? (
                  <ImArrowDown />
                ) : (
                  <ImArrowUp />
                )
              ) : null}
              {historyPercentage}%
            </span>
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default Chart;
