"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel, // Cần cho pagination tích hợp
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import BookServiceApi, { type Book } from "@/services/book.service";
import AppHeader from "@/components/common/app-header";
import { EAppRouter } from "@/constants/app-router.enum";
import { usePagination } from "@/hooks/use-pagination"; // Hook này có thể cần điều chỉnh hoặc thay thế 1 phần
import { getBookTableColumns } from "@/components/columns/book-table.column";
import { toast } from "sonner";

export default function BookManagementPage() {
  const router = useRouter();
  const [bookData, setBookData] = useState<Book[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Hook usePagination của bạn có thể vẫn dùng được, nhưng cách bạn truyền page/limit
  // cho API và cách table xử lý pagination sẽ hơi khác một chút.
  // TanStack Table có thể quản lý state pagination riêng (nếu không dùng manualPagination).
  // Vì bạn dùng manualPagination, hook của bạn vẫn quan trọng.
  const { currentPage, limit, totalPages, changePage, changeLimit } = usePagination({ totalItems: totalItems });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    created_at: false,
    updated_at: false,
  });
  const [rowSelection, setRowSelection] = useState({});

  // Định nghĩa hành động cho cột actions
  const handleEditBook = (book: Book) => {
    router.push(`${EAppRouter.BOOK_MANAGEMENT_EDIT_PAGE}/${book.id}`); // Ví dụ
    // console.log("Edit book:", book.id);
    // alert(`Sửa sách: ${book.title}`);
  };

  const handleDeleteBook = async (book: Book) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sách "${book.title}" không?`)) {
      try {
        const { results } = await BookServiceApi.deleteById(book.id); // Gọi API xóa

        if (results === "1") {
          toast.success(`Xóa sách ${book.title} có ISBN ${book.ISBN} thành công.`, { richColors: true });
          // Refetch data sau khi xóa
          fetchBooks(currentPage, limit);
        }
      } catch (error) {
        toast.error("Lỗi khi xóa sách.");
        console.error("Lỗi khi xóa sách:", error);
        alert("Đã có lỗi xảy ra khi xóa sách.");
      }
    }
  };

  const bookTableColumns: ColumnDef<Book>[] = getBookTableColumns(handleEditBook, handleDeleteBook);

  const bookTable = useReactTable<Book>({
    data: bookData,
    columns: bookTableColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    manualPagination: true, // QUAN TRỌNG: vì bạn fetch API theo page/limit
    pageCount: totalPages, // QUAN TRỌNG: tổng số trang từ API
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Cần thiết cho pagination UI
  });

  const fetchBooks = async (page: number, limit: number) => {
    try {
      const { dataPart } = await BookServiceApi.getAll({ page, limit });

      setBookData(dataPart.data);
      setTotalItems(dataPart.total_items);
    } catch (error) {
      console.error("Lỗi fetch sách:", error);
      setBookData([]); // Reset data nếu có lỗi
      setTotalItems(0);
    }
  };

  useEffect(() => {
    fetchBooks(currentPage, limit);
  }, [currentPage, limit]);

  return (
    <div className="w-full space-y-4 p-4 md:p-6">
      <AppHeader title="Sách thư viện" sub_title="Quản lý sách trong thư viện và theo dõi trạng thái" />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Lọc theo tiêu đề..."
            value={(bookTable.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) => bookTable.getColumn("title")?.setFilterValue(event.target.value)}
            className="h-9 w-[150px] lg:w-[250px]"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push(EAppRouter.BOOK_MANAGEMENT_ADD_PAGE)}>Thêm sách</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto h-9">
                Cột <ChevronDownIcon className="ml-2 h-4 w-4" />
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
                      {/* Thay thế id bằng một tên thân thiện hơn nếu cần */}
                      {column.id === "genre.name"
                        ? "Thể loại"
                        : column.id === "publisher.name"
                        ? "Nhà xuất bản"
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

      {/* Main bookTable */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {bookTable.getHeaderGroups().map((headerGroup) => (
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
            {bookTable.getRowModel().rows?.length ? (
              bookTable.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={bookTableColumns.length} className="h-24 text-center">
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {bookTable.getFilteredSelectedRowModel().rows.length} của {bookTable.getFilteredRowModel().rows.length} dòng được chọn.
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm">
            Trang {currentPage} của {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newPage = currentPage - 1;
              changePage(newPage);
              // bookTable.previousPage() // Không dùng khi manualPagination true và API call
            }}
            disabled={currentPage <= 1}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newPage = currentPage + 1;
              changePage(newPage);
              bookTable.nextPage(); // Không dùng khi manualPagination true và API call
            }}
            disabled={currentPage >= totalPages}
          >
            Sau
          </Button>
          {/* Select page size */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {limit} / trang
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[10, 20, 30, 40, 50].map((pageSize: number) => (
                <DropdownMenuItem key={pageSize} onSelect={() => changeLimit(pageSize)}>
                  {pageSize}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
