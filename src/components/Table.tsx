import React, { useCallback, useMemo, useState } from "react";
import { TableProps } from "../interfaces/components";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Link } from "react-router-dom";

import { Input } from "./";

import { sort } from "../helpers/sortData";

import { SortItems } from "../interfaces/state";

const Table: React.FC<TableProps> = ({
  headers,
  data,
  colorRow,
  sortable = false,
  filterable = false,
  filterableKeys = [],
  linkCols = [],
}) => {
  const [sortConfig, setSortConfig] = useState<SortItems | null>(null);
  const [filterText, setFilterText] = useState<string>("");

  const handleHeaderClick = useCallback((key: string) => {
    setSortConfig((prevState) => {
      let direction: "asc" | "desc" = "asc";
      let isNumber = false;
      if (prevState?.key === key && prevState?.direction === "asc")
        direction = "desc";
      if (
        key === "kupovni_tecaj" ||
        key === "srednji_tecaj" ||
        key === "prodajni_tecaj" ||
        key === "sifra_valute"
      )
        isNumber = true;

      return { key, direction, isNumber };
    });
  }, []);

  const sortedData = useMemo(() => {
    const sorted = [...data];
    if (!!!sortConfig) return sorted;
    return sort({
      data: sorted,
      key: sortConfig.key,
      direction: sortConfig.direction,
      isNumber: sortConfig.isNumber,
    });
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    if (!filterable || !!!filterText) return sortedData;
    return sortedData.filter((row) =>
      filterableKeys.some((key) =>
        row[key]
          .toString()
          .toLowerCase()
          .includes(filterText.toLocaleLowerCase())
      )
    );
  }, [sortedData, filterText]);

  const returnLink = useCallback(
    (row: Record<string, any>, value: string) => {
      const linkKey = linkCols.find((link) => link.target === value);
      if (!!!linkKey) return "/";
      if (linkKey.isCurrentDate) return `/povijest/${row[value]}`;
      return `/povijest/${row[value]}/${linkKey.date}`;
    },
    [linkCols]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  return (
    <div className="w-full flex flex-col gap-5 mt-5 items-start">
      {filterable && (
        <Input
          type="text"
          value={filterText}
          onChange={handleChange}
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
                  className={`px-4 py-2 bg-red-600 md:py-4 flex-1 text-white ${
                    sortable ? "cursor-pointer" : "cursor-default"
                  } ${header.value === "valuta" ? "sticky left-0 z-10" : ""}`}
                  onClick={() => sortable && handleHeaderClick(header.value)}
                >
                  <span className="flex w-full justify-center items-center gap-3">
                    {header.title}{" "}
                    {sortable &&
                      (sortConfig?.key === header.value &&
                      sortConfig?.direction === "asc" ? (
                        <FaCaretUp />
                      ) : (
                        <FaCaretDown />
                      ))}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className="divide-x divide-gray-300">
                {headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-4 py-2 md:py-4 text-center ${
                      header.value === "valuta" ? "sticky left-0 z-10" : ""
                    } ${colorRow && colorRow(rowIndex)}`}
                  >
                    {!!linkCols.find((link) => link.target === header.value) ? (
                      <Link
                        className="w-full flex justify-center"
                        to={returnLink(row, header.value)}
                      >
                        {row[header.value]}
                      </Link>
                    ) : (
                      row[header.value]
                    )}
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
