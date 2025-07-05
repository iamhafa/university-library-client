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

import { getPublisherTableColumns } from "@/components/columns/publisher-table.column";
import { AppHeader } from "@/components/common/app-header";
import { AppPagination } from "@/components/common/app-pagination";
import { EAppRouter } from "@/constants/app-router.enum";
import { usePagination } from "@/hooks/use-pagination";
import PublisherApiService, { type TPublisher } from "@/services/publisher.service";
import { toast } from "sonner";

export default function PublisherManagementPage() {
  const router = useRouter();
  const [publisherData, setPublisherData] = useState<TPublisher[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);

  const { currentPage, limit, totalPages, changePage, changeLimit } = usePagination({ totalItems: totalItems });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    created_at: false,
    updated_at: false,
  });

  const handleEditPublisher = (publisher: TPublisher): void => {
    router.push(`${EAppRouter.PUBLISHER_MANAGEMENT_EDIT_PAGE}/${publisher.id}`);
  };

  const handleDeletePublisher = async (publisher: TPublisher): Promise<void> => {
    if (confirm(`Bạn có chắc chắn muốn xóa nhà xuất bản "${publisher.name}" không?`)) {
      try {
        const { results } = await PublisherApiService.deleteById(publisher.id);

        if (results === "1") {
          toast.success(`Xóa nhà xuất bản ${publisher.name} thành công.`, { richColors: true });
          // Refetch data sau khi xóa
          fetchPublishers(currentPage, limit);
        }
      } catch (error) {
        toast.error("Lỗi khi xóa nhà xuất bản.");
        console.error("Lỗi khi xóa nhà xuất bản:", error);
      }
    }
  };

  const publisherTableColumns: ColumnDef<TPublisher>[] = getPublisherTableColumns(handleEditPublisher, handleDeletePublisher);

  const publisherTable = useReactTable<TPublisher>({
    data: publisherData,
    columns: publisherTableColumns,
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

  const fetchPublishers = async (page: number, limit: number) => {
    try {
      const { dataPart } = await PublisherApiService.getAll({ page, limit });

      setPublisherData(dataPart.data);
      setTotalItems(dataPart.total_items);
    } catch (error) {
      console.error("Lỗi fetch nhà xuất bản:", error);
      setPublisherData([]);
      setTotalItems(0);
    }
  };

  useEffect(() => {
    fetchPublishers(currentPage, limit);
  }, [currentPage, limit]);

  return (
    <div className="w-full space-y-4 p-4 md:p-6">
      <AppHeader title="Quản lý nhà xuất bản" sub_title="Quản lý thông tin nhà xuất bản và thông tin liên hệ" />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Lọc theo tên nhà xuất bản..."
            value={(publisherTable.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => publisherTable.getColumn("name")?.setFilterValue(event.target.value)}
            className="h-9 w-[150px] lg:w-[250px]"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push(EAppRouter.PUBLISHER_MANAGEMENT_ADD_PAGE)}>
            <Plus />
            Thêm nhà xuất bản
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto h-9">
                Cột <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {publisherTable
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
                        ? "Tên nhà xuất bản"
                        : column.id === "contact_number"
                        ? "Số điện thoại"
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

      {/* Main publisherTable */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {publisherTable.getHeaderGroups().map((headerGroup) => (
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
            {publisherTable.getRowModel().rows?.length ? (
              publisherTable.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={publisherTableColumns.length} className="h-24 text-center">
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <AppPagination
        totalSelects={publisherTable.getFilteredSelectedRowModel().rows.length}
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
