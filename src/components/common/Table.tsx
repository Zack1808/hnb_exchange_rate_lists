import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { convertToDateString } from "../../utils/dateUtils";

interface TableProps {
  headers: Array<{ title: string; value: string; isNumber: boolean }>;
  data: Record<string, string>[];
  sortable?: boolean;
  filterable?: boolean;
  filterableKeys?: Array<string>;
  linkCols?: Array<{
    targetCol: string;
    startLink: string;
    selectedDate: Date;
  }>;
}

const Table: React.FC<TableProps> = ({
  headers,
  data,
  sortable,
  filterable,
  filterableKeys,
  linkCols,
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = useCallback((event: React.ChangeEvent) => {
    setInputValue((event.target as HTMLInputElement).value);
  }, []);

  const renderCellData = useCallback(
    (row: Record<string, string>, header: string): React.ReactNode => {
      const linkKey = linkCols?.find((link) => link.targetCol === header);
      if (!linkKey)
        return (
          <span className="px-4 py-2 md:py-4 flex items-center justify-center">
            {row[header]}
          </span>
        );

      const toDate = new Date(linkKey.selectedDate);
      const fromDate = new Date(linkKey.selectedDate);
      fromDate.setDate(fromDate.getDate() - 2);

      return (
        <Link
          to={`${linkKey.startLink}valuta=${
            row[header]
          }&datum_primjene_od=${convertToDateString(
            fromDate,
            "YYYY-MM-DD"
          )}&datum_primjene_do=${convertToDateString(toDate, "YYYY-MM-DD")}`}
          className="px-4 py-2 md:py-4 flex items-center justify-center outline-none focus:inset-ring-2 focus:inset-ring-red-300"
        >
          {row[header]}
        </Link>
      );
    },
    [linkCols]
  );

  const renderData = useMemo((): Record<string, string>[] => {
    let tempData = [...data];

    if (filterable)
      tempData = tempData.filter((row) =>
        filterableKeys
          ? filterableKeys.some((key) =>
              row[key]
                .toString()
                .toLowerCase()
                .includes(inputValue.toLowerCase())
            )
          : Object.values(row)
              .toString()
              .toLowerCase()
              .includes(inputValue.toLowerCase())
      );

    return tempData;
  }, [data, inputValue]);

  return (
    <div className="w-full flex flex-col gap-5 mt-5 items-start">
      {filterable && (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full p-2 bg-gray-50 border border-gray-300 rounded-sm outline-none text-lg text-gray-800 placeholder:text-gray-400 focus:ring focus:ring-red-300"
          placeholder="Filtriraj po državi, valuti, ISO broju ili šifri valute..."
        />
      )}
      <div className="overflow-x-auto w-full rounded-sm">
        <table className="w-full text-lg">
          <thead>
            <tr className="divide-x divide-red-400">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-4 py-2 bg-red-600 md:py-4 text-white first:sticky first:left-0 first:z-10`}
                >
                  {header.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {renderData.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="divide-x divide-gray-300 odd:bg-gray-200 even:bg-gray-50"
              >
                {headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className="first:sticky first:left-0 first:z-10 bg-inherit"
                  >
                    {renderCellData(item, header.value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
