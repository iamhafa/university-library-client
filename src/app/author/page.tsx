"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Button } from "@/ui/button";
import {
  useReactTable,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Table,
} from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import AuthorServiceApi, { type Author } from "@/services/author.service";
import AppPagination from "@/components/common/app-pagination";
import AppHeader from "@/components/common/app-header";
import { authorTableColumns } from "@/components/columns/author-table.column";
import AppTable from "@/components/common/app-table";
import { EAppRouter } from "@/constants/app-router.enum";
import { usePagination } from "@/hooks/use-pagination";

export default function AuthorPage() {
  const router = useRouter();
  const [authorData, setAuthorData] = useState<Author[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);

  const { page, limit, totalPages, changePage, changeLimit } = usePagination({
    totalItems: totalItems,
  });

  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const authorTable: Table<Author> = useReactTable<Author>({
    data: authorData,
    columns: authorTableColumns,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    (async () => {
      const { dataPart } = await AuthorServiceApi.getAll({ page, limit });
      setAuthorData(dataPart.data);
      setTotalItems(dataPart.total_items);
    })();

    authorTable.resetRowSelection();
  }, [page, totalPages, authorTable.getState().pagination.pageIndex]);

  return (
    <div className="w-full">
      <AppHeader title="Tác giả" sub_title="Quản lý thông tin tác giả và tiểu sử" />

      <div className="flex items-center py-4">
        <Button onClick={() => router.push(EAppRouter.AUTHOR_PAGE)}>Thêm tác giả</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {authorTable
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: boolean) => column.toggleVisibility(value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AppTable tableData={authorTable} tableColumns={authorTableColumns} />

      <AppPagination
        totalSelects={authorTable.getSelectedRowModel().rows.length}
        totalPages={totalPages}
        currentPage={page}
        pageSize={limit}
        onPageChange={changePage}
        onPageSizeChange={changeLimit}
      />
    </div>
  );
}
