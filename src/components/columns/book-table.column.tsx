import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { TBook, TBookAuthorItems } from "@/services/book.service";
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
    id: "authors",
    header: "Tác giả",
    cell: ({ row }) => {
      const authors = row.original.book_author_items as TBookAuthorItems[];

      if (authors.length === 0) {
        return <span className="text-gray-500 italic">Chưa có tác giả</span>;
      }

      // Nếu có nhiều tác giả, hiển thị dưới dạng badges
      return (
        <div className="flex flex-wrap gap-1">
          {authors.map((authorItem: TBookAuthorItems) => (
            <Badge key={authorItem.id} variant="secondary" className="text-xs">
              {authorItem.author.name}
            </Badge>
          ))}
        </div>
      );
    },
    enableSorting: false, // Vì là nested data phức tạp
  },
  {
    accessorKey: "ISBN",
    header: "ISBN",
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <div className="text-right">
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Giá
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const formatted: string = currencyFormat(row.getValue("price"));
      return <div className="text-right font-medium">{formatted}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-right">Số lượng</div>,
    cell: ({ row }) => <div className="text-right">{row.original.quantity}</div>,
  },
  {
    accessorKey: "genre.name",
    header: "Thể loại",
    cell: ({ row }) => {
      const genre = row.original.genre;
      return <Badge>{genre?.name || "N/A"}</Badge>;
    },
  },
  {
    accessorKey: "publisher.name",
    header: "Nhà xuất bản",
    cell: ({ row }) => {
      const publisher = row.original.publisher;
      return <div>{publisher?.name || "N/A"}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
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
            <DropdownMenuItem onClick={() => onEdit(book)}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(book)} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    enableHiding: true,
  },
  {
    accessorKey: "updated_at",
    header: "Ngày cập nhật",
    enableHiding: true,
  },
];
