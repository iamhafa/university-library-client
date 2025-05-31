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

import BorrowingServiceApi, { type TBorrowing } from "@/services/borrowing.service";
import AppHeader from "@/components/common/app-header";
import { EAppRouter } from "@/constants/app-router.enum";
import { usePagination } from "@/hooks/use-pagination";
import { getBorrowingTableColumns } from "@/components/columns/borrowing-table.column";
import { toast } from "sonner";
import AppPagination from "@/components/common/app-pagination";

export default function BorrowingManagementPage() {
  const router = useRouter();
  const [borrowingData, setBorrowingData] = useState<TBorrowing[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);

  const { currentPage, limit, totalPages, changePage, changeLimit } = usePagination({ totalItems: totalItems });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    member_id: false, // Ẩn ID thành viên vì đã có thông tin đầy đủ
    created_at: false,
    updated_at: false,
    created_by: false,
    updated_by: false,
  });

  const handleEditBorrowing = (borrowing: TBorrowing): void => {
    router.push(`${EAppRouter.BORROWING_MANAGEMENT_EDIT_PAGE}/${borrowing.id}`);
  };

  const handleDeleteBorrowing = async (borrowing: TBorrowing): Promise<void> => {
    if (confirm(`Bạn có chắc chắn muốn xóa bản ghi mượn sách ID ${borrowing.id} không?`)) {
      try {
        const { results } = await BorrowingServiceApi.deleteById(borrowing.id);

        if (results === "1") {
          toast.success(`Xóa bản ghi mượn sách ID ${borrowing.id} thành công.`, { richColors: true });
          // Refetch data sau khi xóa
          fetchBorrowings(currentPage, limit);
        }
      } catch (error) {
        toast.error("Lỗi khi xóa bản ghi mượn sách.");
        console.error("Lỗi khi xóa bản ghi mượn sách:", error);
      }
    }
  };

  const handleReturnBook = async (borrowing: TBorrowing): Promise<void> => {
    if (borrowing.status === "RETURNED") {
      toast.warning("Sách này đã được trả.");
      return;
    }

    if (confirm(`Xác nhận trả sách cho bản ghi ID ${borrowing.id}?`)) {
      try {
        const { results } = await BorrowingServiceApi.returnBook(borrowing.id);

        if (results === "1") {
          toast.success(`Trả sách thành công cho bản ghi ID ${borrowing.id}.`, { richColors: true });
          // Refetch data sau khi trả sách
          fetchBorrowings(currentPage, limit);
        }
      } catch (error) {
        toast.error("Lỗi khi trả sách.");
        console.error("Lỗi khi trả sách:", error);
      }
    }
  };

  const borrowingTableColumns: ColumnDef<TBorrowing>[] = getBorrowingTableColumns(
    handleEditBorrowing,
    handleDeleteBorrowing,
    handleReturnBook
  );

  const borrowingTable = useReactTable<TBorrowing>({
    data: borrowingData,
    columns: borrowingTableColumns,
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

  const fetchBorrowings = async (page: number, limit: number) => {
    try {
      const { dataPart } = await BorrowingServiceApi.getAll({ page, limit });

      setBorrowingData(dataPart.data);
      setTotalItems(dataPart.total_items);
    } catch (error) {
      console.error("Lỗi fetch bản ghi mượn sách:", error);
      setBorrowingData([]);
      setTotalItems(0);
    }
  };

  useEffect(() => {
    fetchBorrowings(currentPage, limit);
  }, [currentPage, limit]);

  return (
    <div className="w-full space-y-4 p-4 md:p-6">
      <AppHeader title="Quản lý mượn sách" sub_title="Theo dõi các bản ghi mượn và trả sách của thành viên" />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Tìm kiếm theo tên thành viên..."
            value={(borrowingTable.getColumn("member")?.getFilterValue() as string) ?? ""}
            onChange={(event) => borrowingTable.getColumn("member")?.setFilterValue(event.target.value)}
            className="h-9 w-[150px] lg:w-[250px]"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push(EAppRouter.BORROWING_MANAGEMENT_ADD_PAGE)}>
            <Plus />
            Thêm mượn sách
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto h-9">
                Cột <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {borrowingTable
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
                      {column.id === "member_id"
                        ? "ID Thành viên"
                        : column.id === "member"
                        ? "Thông tin thành viên"
                        : column.id === "member.member_type"
                        ? "Loại thành viên"
                        : column.id === "borrowing_date"
                        ? "Ngày mượn"
                        : column.id === "due_date"
                        ? "Ngày hết hạn"
                        : column.id === "returned_date"
                        ? "Ngày trả"
                        : column.id === "created_at"
                        ? "Ngày tạo"
                        : column.id === "updated_at"
                        ? "Ngày cập nhật"
                        : column.id === "created_by"
                        ? "Người tạo"
                        : column.id === "updated_by"
                        ? "Người cập nhật"
                        : column.id === "status"
                        ? "Trạng thái"
                        : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main borrowingTable */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {borrowingTable.getHeaderGroups().map((headerGroup) => (
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
            {borrowingTable.getRowModel().rows?.length ? (
              borrowingTable.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={borrowingTableColumns.length} className="h-24 text-center">
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <AppPagination
        totalSelects={borrowingTable.getFilteredSelectedRowModel().rows.length}
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
