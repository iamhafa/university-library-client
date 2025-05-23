"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronDownIcon,
  MoreHorizontal, // Ví dụ icon cho actions
  ArrowUpDown, // Ví dụ icon cho sorting
} from "lucide-react";

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
  Table as TanstackTable, // Đổi tên để tránh xung đột với component Table của shadcn/ui
} from "@tanstack/react-table";

// shadcn/ui components
import { Button } from "@/components/ui/button"; // Đảm bảo đường dẫn đúng
import { Checkbox } from "@/components/ui/checkbox"; // Đảm bảo đường dẫn đúng
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Đảm bảo đường dẫn đúng
import { Input } from "@/components/ui/input"; // Đảm bảo đường dẫn đúng
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Đảm bảo đường dẫn đúng

import BookServiceApi, { type Book } from "@/services/book.service";
import AppHeader from "@/components/common/app-header";
import { EAppRouter } from "@/constants/app-router.enum"; // Đảm bảo đường dẫn đúng
import { usePagination } from "@/hooks/use-pagination"; // Hook này có thể cần điều chỉnh hoặc thay thế 1 phần
import { Badge } from "@/components/ui/badge";

// --- BẮT ĐẦU: Định nghĩa lại Columns với shadcn/ui style ---
// Bạn sẽ cần di chuyển và tùy chỉnh phần này
const getBookColumns = (onEdit: (book: Book) => void, onDelete: (book: Book) => void): ColumnDef<Book>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Tiêu đề
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "ISBN",
    header: "ISBN",
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Giá</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "quantity",
    header: "Số lượng",
  },
  {
    accessorKey: "genre.name", // Ví dụ nếu bạn muốn hiển thị tên thể loại
    header: "Thể loại",
    cell: ({ row }) => {
      const genre = row.original.genre; // Truy cập object genre gốc
      return <Badge>{genre?.name || "N/A"}</Badge>;
    },
  },
  {
    accessorKey: "publisher.name", // Ví dụ nếu bạn muốn hiển thị tên NXB
    header: "Nhà xuất bản",
    cell: ({ row }) => {
      const publisher = row.original.publisher;
      return <div>{publisher?.name || "N/A"}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const book = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(book)}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(book.ISBN)}>Copy ISBN</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(book)} className="text-red-600">
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  // Thêm các cột ẩn mặc định nếu cần (giống như created_at, updated_at của bạn)
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    enableHiding: true, // Cho phép ẩn
  },
  {
    accessorKey: "updated_at",
    header: "Ngày cập nhật",
    enableHiding: true, // Cho phép ẩn
  },
];
// --- KẾT THÚC: Định nghĩa Columns ---

export default function BookPage() {
  const router = useRouter();
  const [bookData, setBookData] = useState<Book[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Hook usePagination của bạn có thể vẫn dùng được, nhưng cách bạn truyền page/limit
  // cho API và cách table xử lý pagination sẽ hơi khác một chút.
  // TanStack Table có thể quản lý state pagination riêng (nếu không dùng manualPagination).
  // Vì bạn dùng manualPagination, hook của bạn vẫn quan trọng.
  const {
    page,
    limit,
    totalPages,
    changePage,
    changeLimit,
    // calculateTotalPages, // Cần hàm này từ hook của bạn
  } = usePagination({ totalItems: 0 }); // Khởi tạo totalItems là 0

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    created_at: false,
    updated_at: false,
  });
  const [rowSelection, setRowSelection] = useState({});

  // Định nghĩa hành động cho cột actions
  const handleEditBook = (book: Book) => {
    // router.push(`${EAppRouter.LIBRARY_BOOK_PAGE_EDIT_BOOK}/${book.id}`); // Ví dụ
    console.log("Edit book:", book.id);
    alert(`Sửa sách: ${book.title}`);
  };

  const handleDeleteBook = async (book: Book) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sách "${book.title}" không?`)) {
      try {
        // await BookServiceApi.deleteById(book.id); // Gọi API xóa
        console.log("Delete book:", book.id);
        alert(`Xóa sách: ${book.title}`);
        // Refetch data sau khi xóa
        fetchBooks(page, limit);
      } catch (error) {
        console.error("Lỗi khi xóa sách:", error);
        alert("Đã có lỗi xảy ra khi xóa sách.");
      }
    }
  };

  const bookTableColumns = getBookColumns(handleEditBook, handleDeleteBook);

  const table = useReactTable<Book>({
    data: bookData,
    columns: bookTableColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        // Quản lý state pagination cho table
        pageIndex: page - 1, // TanStack Table dùng 0-based index
        pageSize: limit,
      },
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

  const fetchBooks = async (currentPage: number, currentLimit: number) => {
    try {
      const { dataPart } = await BookServiceApi.getAll({ page: currentPage, limit: currentLimit });
      setBookData(dataPart.data);
      setTotalItems(dataPart.total_items);
      // Tính toán lại totalPages trong hook usePagination
      // (Hoặc table.setPageCount có thể được dùng nếu hook usePagination không tự cập nhật)
      // table.setPageCount(calculateTotalPages(dataPart.total_items, currentLimit));
    } catch (error) {
      console.error("Lỗi fetch sách:", error);
      setBookData([]); // Reset data nếu có lỗi
      setTotalItems(0);
    }
  };

  useEffect(() => {
    fetchBooks(page, limit);
  }, [page, limit]);

  // Cập nhật table pageCount khi totalPages từ hook usePagination thay đổi
  useEffect(() => {
    if (table && totalPages !== undefined) {
      table.setPageCount(totalPages);
    }
  }, [totalPages, table]);

  return (
    <div className="w-full space-y-4 p-4 md:p-6">
      <AppHeader title="Sách thư viện" sub_title="Quản lý sách trong thư viện và theo dõi trạng thái" />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Lọc theo tiêu đề..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
            className="h-9 w-[150px] lg:w-[250px]"
          />
          {/* Thêm các filter khác nếu cần, ví dụ:
          {table.getColumn("genre") && (
            <DataTableFacetedFilter
              column={table.getColumn("genre")}
              title="Genre"
              options={genres} // genres là một mảng { label: string, value: string, icon?: React.ComponentType<{ className?: string }> }
            />
          )}
          */}
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push(EAppRouter.LIBRARY_BOOK_PAGE_ADD_BOOK)}>Thêm sách</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto h-9">
                Cột <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
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

      {/* Main table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
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
          {table.getFilteredSelectedRowModel().rows.length} của {table.getFilteredRowModel().rows.length} dòng được
          chọn.
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm">
            Trang {table.getState().pagination.pageIndex + 1} của {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newPage = page - 1;
              changePage(newPage);
              // table.previousPage() // Không dùng khi manualPagination true và API call
            }}
            disabled={page <= 1}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newPage = page + 1;
              changePage(newPage);
              // table.nextPage() // Không dùng khi manualPagination true và API call
            }}
            disabled={page >= totalPages}
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
              {[10, 20, 30, 40, 50].map((pageSize) => (
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
