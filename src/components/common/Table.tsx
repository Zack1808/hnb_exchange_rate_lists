import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

import Button from "./Button";

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
  const [sortingConfig, setSortingConfig] = useState<{
    headerIndex: number | null;
    direction: "asc" | "desc";
  }>({
    headerIndex: null,
    direction: "desc",
  });

  const handleInputChange = useCallback((event: React.ChangeEvent): void => {
    setInputValue((event.target as HTMLInputElement).value);
  }, []);

  const handleHeaderButtonPress = useCallback((index: number | null): void => {
    setSortingConfig((prevState) => {
      const { headerIndex, direction } = prevState;

      let newDirection: "asc" | "desc";

      if (headerIndex === null) newDirection = "desc";
      else if (headerIndex !== index) newDirection = "desc";
      else newDirection = direction === "desc" ? "asc" : "desc";

      return {
        headerIndex: index,
        direction: newDirection,
      };
    });
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

  const renderHeaderData = useCallback(
    (header: string, index: number): React.ReactNode => {
      return sortable ? (
        <Button
          className="px-4 py-2 md:py-4 max-w-none w-full justify-center outline-none focus:inset-ring-4 focus:inset-ring-red-200 items-center"
          onClick={() => handleHeaderButtonPress(index)}
        >
          {header}
          {sortingConfig.headerIndex !== null &&
          sortingConfig.headerIndex === index ? (
            sortingConfig.direction === "desc" ? (
              <FaCaretDown />
            ) : (
              <FaCaretUp />
            )
          ) : null}
        </Button>
      ) : (
        <span className="px-4 py-2 md:py-4 w-full justify-center flex">
          {header}
        </span>
      );
    },
    [sortable, sortingConfig]
  );

  const sortData = useCallback(
    (
      data: Record<string, string>[],
      key: string,
      direction: "asc" | "desc",
      isNumber: boolean
    ): Record<string, string>[] => {
      const sortedList = [...data];

      return sortedList.sort((a, b) => {
        if (a.hasOwnProperty(key) && b.hasOwnProperty(key)) {
          if (isNumber) {
            if (
              Number(a[key].replace(",", ".")) >
              Number(b[key].replace(",", "."))
            )
              return direction === "asc" ? -1 : 1;
            if (
              Number(a[key].replace(",", ".")) <
              Number(b[key].replace(",", "."))
            )
              return direction === "asc" ? 1 : -1;
            return 0;
          } else {
            if (a[key] > b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] < b[key]) return direction === "asc" ? 1 : -1;
            return 0;
          }
        }
        return 0;
      });
    },
    []
  );

  const dataForRender = useMemo((): Record<string, string>[] => {
    let tempData = [...data];

    if (sortable) {
      const head = headers[sortingConfig.headerIndex!];

      tempData =
        sortingConfig.headerIndex !== null
          ? sortData(
              tempData,
              head.value,
              sortingConfig.direction,
              head.isNumber
            )
          : tempData;
    }

    if (filterable)
      tempData = tempData.filter((row) =>
        filterableKeys
          ? filterableKeys.some((key) =>
              row[key]
                .toString()
                .toLowerCase()
                .trim()
                .includes(inputValue.toLowerCase().trim())
            )
          : Object.values(row)
              .toString()
              .toLowerCase()
              .trim()
              .includes(inputValue.toLowerCase().trim())
      );

    return tempData;
  }, [
    filterable,
    filterableKeys,
    data,
    inputValue,
    sortable,
    sortingConfig,
    headers,
  ]);

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
                  className={`bg-red-600 text-white first:sticky first:left-0 first:z-10`}
                >
                  {renderHeaderData(header.title, index)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {dataForRender.map((item, rowIndex) => (
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
