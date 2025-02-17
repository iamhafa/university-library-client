"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { ColumnDef, flexRender, Table as TableRef } from "@tanstack/react-table";

type Props<T> = {
  tableData: TableRef<T>;
  tableColumns: ColumnDef<T>[];
};

/**
 * A reusable table component for rendering dynamic data using TanStack Table.
 *
 * @template T - The type of data for each row in the table.
 * @prop {TableRef<T>} tableData - The table instance containing rows and data.
 * @prop {ColumnDef<T>[]} tableColumns - The column definitions for rendering the table.
 *
 * @example
 * ```tsx
 * const columns: ColumnDef<User>[] = [
 *   { accessorKey: "name", header: "Name", cell: ({ row }) => row.getValue("name") },
 *   { accessorKey: "email", header: "Email", cell: ({ row }) => row.getValue("email") }
 * ];
 *
 * <AppTable tableData={table} tableColumns={columns} />
 * ```
 */
export default function AppTable<T>({ tableData, tableColumns }: Props<T>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {tableData.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {tableData.getRowModel().rows?.length ? (
            tableData.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="h-12"
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={tableColumns.length} className="h-32 text-center">
                Không có dữ liệu.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
