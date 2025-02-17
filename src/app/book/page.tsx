"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  useReactTable,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Button } from "@/ui/button";
import { Checkbox } from "@/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import BookServiceApi, { type Book } from "@/services/book.service";
import AppPagination from "@/components/common/app-pagination";
import { EAppRouter } from "@/constants/app-router.enum";

const bookColumns: ColumnDef<Book>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`${EAppRouter.BOOK_PAGE}/${row.original.id}`}
        className="capitalize hover:underline hover:text-blue-600"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "ISBN",
    header: () => <div>ISBN</div>,
    cell: ({ row }) => <div>{row.original.ISBN}</div>,
  },
  {
    accessorKey: "price",
    header: () => <div>Price</div>,
    cell: ({ row }) => <div className="font-medium">{`$${row.original.price}`}</div>,
  },
  {
    accessorKey: "page number",
    header: () => <div>Page number</div>,
    cell: ({ row }) => <div className="text-center font-medium">{row.original.total_page}</div>,
  },
  {
    accessorKey: "quantity",
    header: () => <div>Quantity</div>,
    cell: ({ row }) => <div className="text-center">{row.original.quantity}</div>,
  },
  {
    accessorKey: "published date",
    header: () => <div>Pulished Date</div>,
    cell: ({ row }) => <div>{row.original.publish_date}</div>,
  },
  {
    accessorKey: "created at",
    header: () => <div>Created At</div>,
    cell: ({ row }) => <div>{row.original.created_at}</div>,
  },
  {
    accessorKey: "updated at",
    header: () => <div>Updated At</div>,
    cell: ({ row }) => <div>{row.original.updated_at}</div>,
  },
  {
    id: "edit",
    cell: () => <Button>Edit</Button>,
  },
];

export default function BookPage() {
  const [bookData, setBookData] = useState<Book[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    (async () => {
      const { dataPart } = await BookServiceApi.getAlls();
      console.log(dataPart);

      setBookData(dataPart.data);
    })();
  }, []);

  const bookTable = useReactTable({
    data: bookData,
    columns: bookColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {bookTable
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {bookTable.getHeaderGroups().map((headerGroup) => (
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
            {bookTable.getRowModel().rows?.length ? (
              bookTable.getRowModel().rows.map((row) => (
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
                <TableCell colSpan={bookColumns.length} className="h-32 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <AppPagination />
    </div>
  );
}
