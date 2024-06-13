import React, { useMemo, useState } from "react";
import { TableProps } from "../interfaces/components";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

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

  const handleHeaderClick = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig?.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    const sorted = [...data];
    if (!!!sortConfig) return sorted;
    return sort({
      data: sorted,
      key: sortConfig.key,
      direction: sortConfig.direction,
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

  return (
    <div className="w-full flex flex-col">
      <div className="overflow-x-auto w-full">
        <table className="w-full">
          <thead>
            <tr className="divide-x divide-red-400">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-4 py-2 bg-red-600 md:py-4 flex-1 text-white items-center justify-between gap-3 ${
                    sortable ? "cursor-pointer" : "cursor-default"
                  } ${header.value === "valuta" ? "sticky left-0 z-10" : ""}`}
                  onClick={() => sortable && handleHeaderClick(header.value)}
                >
                  <span className="flex w-full justify-between items-center gap-3">
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

          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className="divide-x divide-gray-400">
                {headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-4 py-2 md:py-4 ${
                      header.value === "valuta" ? "sticky left-0 z-10" : ""
                    } ${colorRow && colorRow(rowIndex)}`}
                  >
                    {row[header.value]}
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
