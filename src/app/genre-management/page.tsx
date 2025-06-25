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

import GenreServiceApi, { type TGenre } from "@/services/genre.service";
import { AppHeader } from "@/components/common/app-header";
import { EAppRouter } from "@/constants/app-router.enum";
import { usePagination } from "@/hooks/use-pagination";
import { getGenreTableColumns } from "@/components/columns/genre-table.column";
import { toast } from "sonner";
import { AppPagination } from "@/components/common/app-pagination";

export default function GenreManagementPage() {
  const router = useRouter();
  const [genreData, setGenreData] = useState<TGenre[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);

  const { currentPage, limit, totalPages, changePage, changeLimit } = usePagination({ totalItems: totalItems });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    created_at: false,
    updated_at: false,
  });

  const handleEditGenre = (genre: TGenre): void => {
    router.push(`${EAppRouter.GENRE_MANGEMENT_EDIT_PAGE}/${genre.id}`);
  };

  const handleDeleteGenre = async (genre: TGenre): Promise<void> => {
    if (confirm(`Bạn có chắc chắn muốn xóa tác giả "${genre.name}" không?`)) {
      try {
        const { results } = await GenreServiceApi.deleteById(genre.id);

        if (results === "1") {
          toast.success(`Xóa tác giả ${genre.name} thành công.`, { richColors: true });
          // Refetch data sau khi xóa
          fetchGenres(currentPage, limit);
        }
      } catch (error) {
        toast.error("Lỗi khi xóa tác giả.");
        console.error("Lỗi khi xóa tác giả:", error);
        alert("Đã có lỗi xảy ra khi xóa tác giả.");
      }
    }
  };

  const genreTableColumns: ColumnDef<TGenre>[] = getGenreTableColumns(handleEditGenre, handleDeleteGenre);

  const genreTable = useReactTable<TGenre>({
    data: genreData,
    columns: genreTableColumns,
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

  const fetchGenres = async (page: number, limit: number) => {
    try {
      const { dataPart } = await GenreServiceApi.getAll({ page, limit });

      setGenreData(dataPart.data);
      setTotalItems(dataPart.total_items);
    } catch (error) {
      console.error("Lỗi fetch tác giả:", error);
      setGenreData([]);
      setTotalItems(0);
    }
  };

  useEffect(() => {
    fetchGenres(currentPage, limit);
  }, [currentPage, limit]);

  return (
    <div className="w-full space-y-4 p-4 md:p-6">
      <AppHeader title="Thể loại sách" sub_title="Quản lý thông tin thể loại sách và theo dõi hoạt động" />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Lọc theo tên thể loại..."
            value={(genreTable.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => genreTable.getColumn("name")?.setFilterValue(event.target.value)}
            className="h-9 w-[150px] lg:w-[250px]"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push(EAppRouter.GENRE_MANGEMENT_ADD_PAGE)}>
            <Plus />
            Thêm thể loại
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto h-9">
                Cột <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {genreTable
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

      {/* Main genreTable */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {genreTable.getHeaderGroups().map((headerGroup) => (
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
            {genreTable.getRowModel().rows?.length ? (
              genreTable.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={genreTableColumns.length} className="h-24 text-center">
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <AppPagination
        totalSelects={genreTable.getFilteredSelectedRowModel().rows.length}
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
