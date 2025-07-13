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

import FineTicketApiService, { type TFineTicket } from "@/services/fine-ticket.service";
import { AppHeader } from "@/components/common/app-header";
import { EAppRouter } from "@/constants/app-router.enum";
import { usePagination } from "@/hooks/use-pagination";
import { getFineTicketTableColumns } from "@/components/columns/fine-ticket-table.column";
import { toast } from "sonner";
import { AppPagination } from "@/components/common/app-pagination";

export default function FineTicketManagementPage() {
  const router = useRouter();
  const [fineTicketData, setFineTicketData] = useState<TFineTicket[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);

  const { currentPage, limit, totalPages, changePage, changeLimit } = usePagination({ totalItems: totalItems });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    member_id: false,
    created_at: false,
    updated_at: false,
    created_by: false,
    updated_by: false,
  });

  const handleEditFineTicket = (fine: TFineTicket): void => {
    router.push(`${EAppRouter.FINE_TICKET_MANAGEMENT_EDIT_PAGE}/${fine.id}`);
  };

  const handleDeleteFineTicket = async (fine: TFineTicket): Promise<void> => {
    if (confirm(`Bạn có chắc chắn muốn xóa vé phạt ID ${fine.id} không?`)) {
      try {
        await FineTicketApiService.deleteById(fine.id);
        toast.success(`Xóa vé phạt ID ${fine.id} thành công.`, { richColors: true });
        fetchFineTickets(currentPage, limit);
      } catch (error) {
        toast.error("Lỗi khi xóa vé phạt.");
        console.error("Lỗi khi xóa vé phạt:", error);
      }
    }
  };

  const fineTicketTableColumns: ColumnDef<TFineTicket>[] = getFineTicketTableColumns(
    handleEditFineTicket,
    handleDeleteFineTicket
  );

  const fineTicketTable = useReactTable<TFineTicket>({
    data: fineTicketData,
    columns: fineTicketTableColumns,
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

  const fetchFineTickets = async (page: number, limit: number) => {
    try {
      const { dataPart } = await FineTicketApiService.getAll({ page, limit });

      setFineTicketData(dataPart.data);
      setTotalItems(dataPart.total_items);
    } catch (error) {
      console.error("Lỗi fetch vé phạt:", error);
      setFineTicketData([]);
      setTotalItems(0);
    }
  };

  useEffect(() => {
    fetchFineTickets(currentPage, limit);
  }, [currentPage, limit]);

  return (
    <div className="w-full space-y-4 p-4 md:p-6">
      <AppHeader title="Quản lý vé phạt" sub_title="Theo dõi các vé phạt của thành viên" />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Tìm kiếm theo tên thành viên..."
            value={(fineTicketTable.getColumn("member")?.getFilterValue() as string) ?? ""}
            onChange={(event) => fineTicketTable.getColumn("member")?.setFilterValue(event.target.value)}
            className="h-9 w-[150px] lg:w-[250px]"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push(EAppRouter.FINE_TICKET_MANAGEMENT_ADD_PAGE)}>
            <Plus />
            Thêm vé phạt
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto h-9">
                Cột <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {fineTicketTable
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
      </div>

      {/* Main fineTicketTable */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {fineTicketTable.getHeaderGroups().map((headerGroup) => (
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
            {fineTicketTable.getRowModel().rows?.length ? (
              fineTicketTable.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={fineTicketTableColumns.length} className="h-24 text-center">
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <AppPagination
        totalSelects={fineTicketTable.getFilteredSelectedRowModel().rows.length}
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
