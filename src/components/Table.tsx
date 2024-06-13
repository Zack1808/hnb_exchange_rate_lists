import React from "react";
import { TableProps } from "../interfaces/components";

const Table: React.FC<TableProps> = ({
  headers,
  data,
  colorRow,
  sortableCols,
  filterable,
  filterableKeys,
  linkCols,
}) => {
  return (
    <div className="w-full flex flex-col">
      <div className="overflow-x-auto w-full">
        <table className="w-full">
          <thead className="bg-red-600">
            <tr className="divide-x divide-red-400 flex items-stretch">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 md:py-4 flex flex-1 text-white items-center justify-between"
                >
                  {header}
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
