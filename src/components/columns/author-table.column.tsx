import Link from "next/link";
import { Author } from "@/services/author.service";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/ui/button";
import { Checkbox } from "@/ui/checkbox";
import { EAppRouter } from "@/constants/app-router.enum";

// define columns for Author page
export const authorTableColumns: ColumnDef<Author>[] = [
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
    id: "name",
    accessorKey: "name",
    header: "Tên tác giả",
    cell: ({ row }) => (
      <Link
        href={`${EAppRouter.AUTHOR_PAGE}/${row.original.id}`}
        className="capitalize hover:underline hover:text-blue-600"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    id: "bio",
    accessorKey: "bio",
    header: "Tiểu sử",
    cell: ({ row }) => <div className="line-clamp-2 max-w-[400px]">{row.original.bio}</div>,
  },
  {
    id: "edit",
    cell: () => <Button>Chỉnh sửa</Button>,
  },
];
