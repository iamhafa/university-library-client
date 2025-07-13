"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TFineTicket } from "@/services/fine-ticket.service";

export const getFineTicketTableColumns = (
  onEdit: (fine: TFineTicket) => void,
  onDelete: (fine: TFineTicket) => void
): ColumnDef<TFineTicket>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "borrowing.member.name",
    header: "Thành viên",
  },
  {
    accessorKey: "total_fine_amount",
    header: "Số tiền phạt",
  },
  {
    accessorKey: "status",
    header: "Trạng thái phạt",
  },
  {
    accessorKey: "borrowing.borrowing_date",
    header: "Ngày mượn",
  },
  {
    accessorKey: "borrowing.due_date",
    header: "Hạn trả sách",
  },
  {
    accessorKey: "borrowing.status",
    header: "Trạng thái trả sách",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const fine = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(fine)}>Sửa</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(fine)}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
