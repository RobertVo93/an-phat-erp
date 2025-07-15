import { useLanguage } from '@/contexts/language-context';
import { ProductionFormat } from '@/types/report-production';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import React from 'react';

interface Props {
  data: ProductionFormat[]
}

export default function ReportTable({
  data
}: Props) {
  const columnHelper = createColumnHelper<ProductionFormat>();
  const { t } = useLanguage()
  const columns = [
    columnHelper.accessor('name', {
      header: t(`pro.table.product`),
    }),
    columnHelper.accessor('quantity', {
      header: t(`pro.table.quantity`),
    }),
    columnHelper.accessor('totalPrice', {
      header: t(`pro.table.totalPrice`),
      cell: (info) => `${info.getValue().toLocaleString()} đ`,
    }),
    columnHelper.accessor('totalCost', {
      header: t(`pro.table.totalCost`),
      cell: (info) => `${info.getValue().toLocaleString()} đ`,
    }),
    columnHelper.accessor('profit', {
      header: t(`pro.table.profit`),
      cell: (info) => `${info.getValue().toLocaleString()} đ`,
    }),
    columnHelper.accessor('time', {
      header: t(`pro.table.time`),
      cell: (info) => `${info.getValue()}`,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse w-full text-sm">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-2 border text-left">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 border">
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
