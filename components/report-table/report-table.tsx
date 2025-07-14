import { ReportTableProps } from '@/types/report-production';
import React from 'react';

export const ReportTable = ({
  headers,
  data,
}: ReportTableProps) => {
  return (
    <div className="overflow-x-auto bg-white">
      <table className="min-w-full">
        <thead className="">
          <tr className="border-b border-gray-200">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {header.key === "number" ?
                    Number(rowIndex) + 1 :
                    row[header.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
