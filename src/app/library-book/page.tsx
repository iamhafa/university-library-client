"use client";

import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  useReactTable,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import BookServiceApi, { type Book } from "@/services/book.service";
import AppPagination from "@/components/common/app-pagination";
import AppHeader from "@/components/common/app-header";
import { bookColumns } from "@/components/columns/book.column";
import AppTable from "@/components/common/app-table";
import { useRouter } from "next/navigation";
import { EAppRouter } from "@/constants/app-router.enum";

export default function BookPage() {
  const router = useRouter();
  const [bookData, setBookData] = useState<Book[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    created_at: false, // hide column based on `id`
    updated_at: false,
  });

  useEffect(() => {
    (async () => {
      const { dataPart } = await BookServiceApi.getAlls();
      setBookData(dataPart.data);
    })();
  }, []);

  const bookTable = useReactTable<Book>({
    data: bookData,
    columns: bookColumns,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility, // hide column
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <AppHeader title="Sách thư viện" />

      {/* Drop down menu */}
      <div className="flex items-center py-4">
        <Button onClick={() => router.push(EAppRouter.LIBRARY_BOOK_PAGE_ADD_BOOK)}>
          Thêm sách
        </Button>
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

      {/* Main table */}
      <AppTable tableData={bookTable} tableColumns={bookColumns} />

      {/* Pagination */}
      <AppPagination />
    </div>
  );
}
