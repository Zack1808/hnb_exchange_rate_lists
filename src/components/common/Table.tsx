import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { ImArrowDown, ImArrowUp } from "react-icons/im";

import Button from "./Button";

import { convertToDateString } from "../../utils/dateUtils";
import { sortData } from "../../utils/dataUtils";

interface TableHeaders {
  title: string;
  value: string;
  isNumber: boolean;
}

interface LinkColumn {
  targetCol: string;
  startLink: string;
  selectedDate: Date;
}

interface TableProps {
  headers: TableHeaders[];
  data: Record<string, string>[];
  sortable?: boolean;
  sortableKeys?: string[];
  filterable?: boolean;
  filterableKeys?: Array<string>;
  linkCols?: LinkColumn[];
}

interface SortinConfig {
  headerIndex: number | null;
  direction: "asc" | "desc";
}

const PERCENTAGE_COLUMNS = new Set([
  "postotak_od_prosle_liste",
  "postotak_od_pocetka",
]);

const Table: React.FC<TableProps> = ({
  headers,
  data,
  sortable = false,
  sortableKeys,
  filterable = false,
  filterableKeys,
  linkCols,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [sortingConfig, setSortingConfig] = useState<SortinConfig>({
    headerIndex: null,
    direction: "desc",
  });

  const linkColumnsMap = useMemo(
    () => new Map(linkCols?.map((link) => [link.targetCol, link]) ?? []),
    [linkCols],
  );

  const handleInputChange = useCallback((event: React.ChangeEvent) => {
    setInputValue((event.target as HTMLInputElement).value);
  }, []);

  const handleSort = useCallback((index: number) => {
    const header = headers[index];

    if (sortableKeys?.length && !sortableKeys.includes(header.value)) return;

    setSortingConfig((prev) => ({
      headerIndex: index,
      direction:
        prev.headerIndex === index && prev.direction === "desc"
          ? "asc"
          : "desc",
    }));
  }, []);

  const dataForRender = useMemo((): Record<string, string>[] => {
    let result = [...data];

    if (sortable && sortingConfig.headerIndex !== null) {
      const header = headers[sortingConfig.headerIndex!];

      result = sortData(
        result,
        header.value,
        sortingConfig.direction,
        header.isNumber,
      );
    }

    if (filterable) {
      const searchTerm = inputValue.trim().toLowerCase();

      if (searchTerm) {
        result = result.filter((row) => {
          const values = filterableKeys
            ? filterableKeys.map((key) => row[key])
            : Object.values(row);

          return values.some((value) =>
            value.toLowerCase().includes(searchTerm),
          );
        });
      }
    }

    return result;
  }, [
    filterable,
    filterableKeys,
    data,
    inputValue,
    sortable,
    sortingConfig,
    headers,
  ]);

  const renderPercentage = useCallback((value: string) => {
    const numericValue = Number(value.replace(",", "."));

    const isPositive = numericValue > 0;
    const isNegative = numericValue < 0;

    return (
      <span
        className={`flex items-center justify-center gap-2 ${isPositive ? "text-green-700" : isNegative ? "text-red-500" : ""}`}
      >
        {isPositive ? (
          <ImArrowUp aria-hidden="true" />
        ) : isNegative ? (
          <ImArrowDown aria-hidden="true" />
        ) : null}{" "}
        {value}%
      </span>
    );
  }, []);

  const getCellContent = useCallback(
    (row: Record<string, string>, column: TableHeaders) => {
      const value = row[column.value];

      if (PERCENTAGE_COLUMNS.has(column.value)) {
        return renderPercentage(value);
      }

      return value;
    },
    [renderPercentage],
  );

  const getLinkUrl = useCallback(
    (row: Record<string, string>, link: LinkColumn) => {
      const toDate = new Date(link.selectedDate);
      const fromDate = new Date(link.selectedDate);

      fromDate.setDate(fromDate.getDate() - 10);

      const params = new URLSearchParams({
        valuta: JSON.stringify([row[link.targetCol]]),
        datum_primjene_od: convertToDateString(fromDate, "YYYY-MM-DD"),
        datum_primjene_do: convertToDateString(toDate, "YYYY-MM-DD"),
        prikaz: "table",
      });

      return `${link.startLink}${params.toString()}`;
    },
    [],
  );

  const renderCell = useCallback(
    (row: Record<string, string>, column: TableHeaders) => {
      const link = linkColumnsMap.get(column.value);
      const content = getCellContent(row, column);

      if (!link) {
        return (
          <div className="flex items-center justify-center px-4 py-2 md:py-4">
            {content}
          </div>
        );
      }

      return (
        <Link
          to={getLinkUrl(row, link)}
          className="flex items-center justify-center px-4 py-2 outline-none focus-visible:inset-ring-2 focus-visible:inset-ring-red-300 md:py-4"
        >
          {content}
        </Link>
      );
    },
    [getCellContent, getLinkUrl, linkColumnsMap],
  );

  const renderHeaderData = useCallback(
    (header: TableHeaders, index: number) => {
      const isSortable =
        sortable &&
        (!sortableKeys?.length || sortableKeys.includes(header.value));

      const isActiveSort = sortingConfig.headerIndex === index;

      if (!isSortable)
        return (
          <span className="flex w-full justify-center px-4 py-2 md:py-4">
            {header.title}
          </span>
        );

      return (
        <Button
          type="button"
          onClick={() => handleSort(index)}
          className="w-full max-w-none items-center justify-center px-4 py-2 md:py-4 outline-none focus-visible:inset-ring-4 focus-visible:inset-ring-red-200"
          aria-label={`Sortiraj po ${header.title}`}
          aria-pressed={isActiveSort}
        >
          {header.title}

          {isActiveSort &&
            (sortingConfig.direction === "desc" ? (
              <FaCaretDown aria-hidden="true" />
            ) : (
              <FaCaretUp aria-hidden="true" />
            ))}
        </Button>
      );
    },
    [sortable, sortingConfig, handleSort, sortingConfig],
  );

  return (
    <div className="w-full flex flex-col gap-5 mt-5 items-start">
      {filterable && (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full p-2 bg-gray-50 border border-gray-300 rounded-sm outline-none text-lg text-gray-800 placeholder:text-gray-400 focus:ring focus:ring-red-300"
          placeholder="Filtriraj po državi, valuti..."
          aria-label="Filtriraj tablicu"
        />
      )}

      <div className="overflow-x-auto w-full rounded-sm">
        <table className="w-full text-lg">
          <thead>
            <tr className="divide-x divide-red-400">
              {headers.map((header, index) => (
                <th
                  key={header.value}
                  className={`bg-red-600 text-white first:sticky first:left-0 first:z-10`}
                >
                  {renderHeaderData(header, index)}
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
                {headers.map((header) => (
                  <td
                    key={header.value}
                    className="first:sticky first:left-0 first:z-10 bg-inherit"
                  >
                    {renderCell(item, header)}
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
