import Link from "next/link";
import { Book } from "@/services/book.service";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/ui/button";
import { Checkbox } from "@/ui/checkbox";
import { EAppRouter } from "@/constants/app-router.enum";

// define columns for Book page
export const bookColumns: ColumnDef<Book>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="ml-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="ml-4"
      />
    ),
  },
  {
    id: "title",
    accessorKey: "title",
    header: "Tên sách",
    enableResizing: true,
    cell: ({ row }) => (
      <Link
        href={`${EAppRouter.LIBRARY_BOOK_PAGE}/${row.original.id}`}
        className="capitalize hover:underline hover:text-blue-600"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "ISBN",
    header: "ISBN",
    cell: ({ row }) => <div>{row.original.ISBN}</div>,
  },
  {
    accessorKey: "price",
    header: "Giá",
    cell: ({ row }) => <div className="font-medium">{`$${row.original.price}`}</div>,
  },
  {
    accessorKey: "page number",
    header: "Tổng số trang",
    cell: ({ row }) => <div className="text-center font-medium">{row.original.total_page}</div>,
  },
  {
    accessorKey: "quantity",
    header: "Số lượng",
    cell: ({ row }) => <div className="text-center">{row.original.quantity}</div>,
  },
  {
    accessorKey: "published date",
    header: "Ngày phát hành",
    cell: ({ row }) => <div>{row.original.publish_date}</div>,
  },
  {
    id: "created at",
    accessorKey: "created at",
    header: "Ngày tạo",
    cell: ({ row }) => <div>{row.original.created_at}</div>,
  },
  {
    id: "updated at",
    accessorKey: "updated at",
    header: "Ngày cập nhật",
    cell: ({ row }) => <div>{row.original.updated_at}</div>,
  },
  {
    id: "edit",
    cell: () => <Button>Chỉnh sửa</Button>,
  },
];
