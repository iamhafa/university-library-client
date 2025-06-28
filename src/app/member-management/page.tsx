"use client";

import { ChevronDownIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { getMemberTableColumns } from "@/components/columns/member-table.column";
import { AppHeader } from "@/components/common/app-header";
import { AppPagination } from "@/components/common/app-pagination";
import { EAppRouter } from "@/constants/app-router.enum";
import { usePagination } from "@/hooks/use-pagination";
import MemberServiceApi, { type TMember } from "@/services/member.service";
import { toast } from "sonner";

export default function MemberManagementPage() {
  const router = useRouter();
  const [memberData, setMemberData] = useState<TMember[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);

  const { currentPage, limit, totalPages, changePage, changeLimit } = usePagination({ totalItems: totalItems });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    created_at: false,
    updated_at: false,
  });

  const handleEditMember = (member: TMember): void => {
    router.push(`${EAppRouter.MEMBER_MANAGEMENT_EDIT_PAGE}/${member.id}`);
  };

  const handleDeleteMember = async (member: TMember): Promise<void> => {
    if (confirm(`Bạn có chắc chắn muốn xóa thành viên "${member.name}" không?`)) {
      try {
        const { results } = await MemberServiceApi.deleteById(member.id);

        if (results === "1") {
          toast.success(`Xóa thành viên ${member.name} thành công.`, { richColors: true });
          // Refetch data sau khi xóa
          fetchMembers(currentPage, limit);
        }
      } catch (error) {
        toast.error("Lỗi khi xóa thành viên.");
        console.error("Lỗi khi xóa thành viên:", error);
      }
    }
  };

  const memberTableColumns: ColumnDef<TMember>[] = getMemberTableColumns(handleEditMember, handleDeleteMember);

  const memberTable = useReactTable<TMember>({
    data: memberData,
    columns: memberTableColumns,
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

  const fetchMembers = async (page: number, limit: number) => {
    try {
      const { dataPart } = await MemberServiceApi.getAll({ page, limit });

      setMemberData(dataPart.data);
      setTotalItems(dataPart.total_items);
    } catch (error) {
      console.error("Lỗi fetch thành viên:", error);
      setMemberData([]);
      setTotalItems(0);
    }
  };

  useEffect(() => {
    fetchMembers(currentPage, limit);
  }, [currentPage, limit]);

  return (
    <div className="w-full space-y-4 p-4 md:p-6">
      <AppHeader title="Quản lý thành viên" sub_title="Quản lý thông tin thành viên và theo dõi hoạt động" />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Lọc theo tên thành viên..."
            value={(memberTable.getColumn("first_name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => memberTable.getColumn("first_name")?.setFilterValue(event.target.value)}
            className="h-9 w-[150px] lg:w-[250px]"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push(EAppRouter.MEMBER_MANAGEMENT_ADD_PAGE)}>
            <Plus />
            Thêm thành viên
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto h-9">
                Cột <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {memberTable
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
                      {column.id === "first_name"
                        ? "Họ và tên"
                        : column.id === "email"
                        ? "Email"
                        : column.id === "phone_number"
                        ? "Số điện thoại"
                        : column.id === "member_type"
                        ? "Loại thành viên"
                        : column.id === "address"
                        ? "Địa chỉ"
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

      {/* Main memberTable */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {memberTable.getHeaderGroups().map((headerGroup) => (
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
            {memberTable.getRowModel().rows?.length ? (
              memberTable.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={memberTableColumns.length} className="h-24 text-center">
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <AppPagination
        totalSelects={memberTable.getFilteredSelectedRowModel().rows.length}
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
