import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { TBook } from "@/services/book.service";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { currencyFormat } from "@/helpers/currency.format";
import { EAppRouter } from "@/constants/app-router.enum";

export const getBookTableColumns = (onEdit: (book: TBook) => void, onDelete: (book: TBook) => void): ColumnDef<TBook>[] => [
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
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Tiêu đề
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Link
        href={`${EAppRouter.BOOK_MANAGEMENT_DETAIL_PAGE}/${row.original.id}`}
        className="capitalize hover:underline hover:text-blue-600"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "ISBN",
    header: "ISBN",
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Giá</div>,
    cell: ({ row }) => {
      const formatted: string = currencyFormat(row.getValue("price"));
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
