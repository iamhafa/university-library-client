"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDownIcon, Plus } from "lucide-react";

import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// shadcn/ui components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import AuthorServiceApi, { type TAuthor } from "@/services/author.service";
import { AppHeader } from "@/components/common/app-header";
import { EAppRouter } from "@/constants/app-router.enum";
import { usePagination } from "@/hooks/use-pagination";
import { getAuthorTableColumns } from "@/components/columns/author-table.column";
import { toast } from "sonner";
import { AppPagination } from "@/components/common/app-pagination";

export default function AuthorManagementPage() {
  const router = useRouter();
  const [authorData, setAuthorData] = useState<TAuthor[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);

  const { currentPage, limit, totalPages, changePage, changeLimit } = usePagination({ totalItems: totalItems });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    created_at: false,
    updated_at: false,
  });

  const handleEditAuthor = (author: TAuthor): void => {
    router.push(`${EAppRouter.AUTHOR_MANAGEMENT_EDIT_PAGE}/${author.id}`);
  };

  const handleDeleteAuthor = async (author: TAuthor): Promise<void> => {
    if (confirm(`Bạn có chắc chắn muốn xóa tác giả "${author.name}" không?`)) {
      try {
        const { results } = await AuthorServiceApi.deleteById(author.id);

        if (results === "1") {
          toast.success(`Xóa tác giả ${author.name} thành công.`, { richColors: true });
          // Refetch data sau khi xóa
          fetchAuthors(currentPage, limit);
        }
      } catch (error) {
        toast.error("Lỗi khi xóa tác giả.");
        console.error("Lỗi khi xóa tác giả:", error);
        alert("Đã có lỗi xảy ra khi xóa tác giả.");
      }
    }
  };

  const authorTableColumns: ColumnDef<TAuthor>[] = getAuthorTableColumns(handleEditAuthor, handleDeleteAuthor);

  const authorTable = useReactTable<TAuthor>({
    data: authorData,
    columns: authorTableColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    manualPagination: true,
    pageCount: totalPages,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const fetchAuthors = async (page: number, limit: number) => {
    try {
      const { dataPart } = await AuthorServiceApi.getAll({ page, limit });

      setAuthorData(dataPart.data);
      setTotalItems(dataPart.total_items);
    } catch (error) {
      console.error("Lỗi fetch tác giả:", error);
      setAuthorData([]);
      setTotalItems(0);
    }
  };

  useEffect(() => {
    fetchAuthors(currentPage, limit);
  }, [currentPage, limit]);

  return (
    <div className="w-full space-y-4 p-4 md:p-6">
      <AppHeader title="Tác giả" sub_title="Quản lý thông tin tác giả và theo dõi hoạt động" />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Lọc theo tên tác giả..."
            value={(authorTable.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => authorTable.getColumn("name")?.setFilterValue(event.target.value)}
            className="h-9 w-[150px] lg:w-[250px]"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push(EAppRouter.AUTHOR_MANAGEMENT_ADD_PAGE)}>
            <Plus />
            Thêm tác giả
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto h-9">
                Cột <ChevronDownIcon className="ml-2 h-4 w-4" />
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
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id === "name"
                        ? "Tên tác giả"
                        : column.id === "bio"
                        ? "Tiểu sử"
                        : column.id === "created_at"
                        ? "Ngày tạo"
                        : column.id === "updated_at"
                        ? "Ngày cập nhật"
                        : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main authorTable */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {authorTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {authorTable.getRowModel().rows?.length ? (
              authorTable.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={authorTableColumns.length} className="h-24 text-center">
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <AppPagination
        totalSelects={authorTable.getFilteredSelectedRowModel().rows.length}
        totalItems={totalItems}
        page={currentPage}
        limit={limit}
        totalPages={totalPages}
        onPageChange={(newPage: number) => changePage(newPage)}
        onLimitChange={(newLimit: number) => changeLimit(newLimit)}
      />
    </div>
  );
}
