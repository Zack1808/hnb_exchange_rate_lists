import React from "react";

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
  return (
    <div className="w-full flex flex-col gap-5 mt-5 items-start">
      <div className="overflow-x-auto w-full rounded-sm">
        <table className="w-full text-lg">
          <thead>
            <tr className="divide-x divide-red-400">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-4 py-2 bg-red-600 md:py-4 flex-1 text-white first:sticky first:left-0 first:z-10`}
                >
                  {header.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="divide-x divide-gray-300 odd:bg-gray-100 even:bg-white"
              >
                {headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-2 md:py-4 text-center first:sticky first:left-0 first:z-10 bg-inherit"
                  >
                    {item[header.value]}
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
