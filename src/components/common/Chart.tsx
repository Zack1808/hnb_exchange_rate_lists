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
  chartData: Record<string, string>[];
  currency: string;
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

const Chart: React.FC<ChartProps> = ({ chartData = [], currency = "" }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
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
              .map((item: Record<string, string>, indx: number) =>
                new Date(item.datum_primjene).getMonth() === month ? indx : -1
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
            value: `Rast/Pad tečaja ${currency}-a u %`,
            angle: -90,
            position: {
              x: 5,
              y: 50,
            },
          }}
        />

        <Line
          dot={false}
          strokeWidth={2}
          dataKey="percentage_history"
          name={`Rast/pad ${currency}-a od uvođenja EUR 01.01.2023`}
        />

        <Line
          dot={false}
          strokeWidth={2}
          stroke="gray"
          dataKey="percentage"
          name={`Dnevni rast/pad ${currency}-a`}
        />

        <Legend iconType="diamond" iconSize={15} align="left" />

        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const specificDate = new Date(data.datum_primjene);
    const percentage = data.percentage;
    const historyPercentage = data.percentage_history;

    return (
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
