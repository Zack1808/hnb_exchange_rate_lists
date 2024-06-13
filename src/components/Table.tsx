import React, { useState } from "react";
import { TableProps } from "../interfaces/components";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

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

  const handleHeaderClick = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig?.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  return (
    <div className="w-full flex flex-col">
      <div className="overflow-x-auto w-full">
        <table className="w-full">
          <thead>
            <tr className="divide-x divide-red-400 flex items-stretch">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-4 py-2 bg-red-600 md:py-4 flex flex-1 text-white items-center justify-between gap-3 ${
                    sortable ? "cursor-pointer" : "cursor-default"
                  } ${header.value === "valuta" ? "sticky left-0 z-10" : ""}`}
                  onClick={() => sortable && handleHeaderClick(header.value)}
                >
                  {header.title}{" "}
                  {sortable &&
                    (sortConfig?.key === header.value &&
                    sortConfig?.direction === "asc" ? (
                      <FaCaretUp />
                    ) : (
                      <FaCaretDown />
                    ))}
                </th>
              ))}
            </tr>
          </thead>

          <tbody></tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
