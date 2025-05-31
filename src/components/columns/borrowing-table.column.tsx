// /components/columns/borrowing-table.column.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Edit, Trash2, CheckCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TBorrowing } from "@/services/borrowing.service";

export const getBorrowingTableColumns = (
  onEdit: (borrowing: TBorrowing) => void,
  onDelete: (borrowing: TBorrowing) => void,
  onReturn: (borrowing: TBorrowing) => void
): ColumnDef<TBorrowing>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Chọn tất cả"
      />
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Chọn dòng" />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "member_id",
    header: "ID Thành viên",
    cell: ({ row }) => <div>{row.getValue("member_id")}</div>,
  },
  {
    accessorKey: "member",
    header: "Thành viên",
    cell: ({ row }) => {
      const member = row.getValue("member") as any;
      const memberId = row.getValue("member_id") as number;

      if (member) {
        return (
          <div className="space-y-1">
            <div className="font-medium">
              {member.last_name} {member.first_name}
            </div>
            <div className="text-sm text-gray-500">ID: {memberId}</div>
            <div className="text-sm text-gray-500">{member.email}</div>
          </div>
        );
      }

      return <div>ID: {memberId}</div>;
    },
  },
  {
    accessorKey: "member.member_type",
    header: "Loại thành viên",
    cell: ({ row }) => {
      const member = row.getValue("member") as any;
      if (!member) return "-";

      const memberTypeMap = {
        UNDERGRADUATE_STUDENT: "Sinh viên đại học",
        POSTGRADUATE_STUDENT: "Sinh viên sau đại học",
        LIBRARY_STAFF: "Nhân viên thư viện",
      };

      return (
        <Badge variant="outline">{memberTypeMap[member.member_type as keyof typeof memberTypeMap] || member.member_type}</Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "BORROWING" ? "destructive" : "default"}>
          {status === "BORROWING" ? "Đang mượn" : "Đã trả"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "borrowing_date",
    header: "Ngày mượn",
    cell: ({ row }) => <div>{row.getValue("borrowing_date")}</div>,
  },
  {
    accessorKey: "due_date",
    header: "Ngày hết hạn",
    cell: ({ row }) => {
      const dueDate = row.getValue("due_date") as string;
      const isOverdue = new Date(dueDate.split("-").reverse().join("-")) < new Date() && row.getValue("status") === "BORROWING";

      return (
        <div className={isOverdue ? "text-red-600 font-semibold" : ""}>
          {dueDate}
          {isOverdue && " (Quá hạn)"}
        </div>
      );
    },
  },
  {
    accessorKey: "returned_date",
    header: "Ngày trả",
    cell: ({ row }) => {
      const returnedDate = row.getValue("returned_date") as string | null;
      return <div>{returnedDate || "Chưa trả"}</div>;
    },
  },
  {
    accessorKey: "created_by",
    header: "Người tạo",
    cell: ({ row }) => <div>{row.getValue("created_by")}</div>,
  },
  {
    accessorKey: "updated_by",
    header: "Người cập nhật",
    cell: ({ row }) => {
      const updatedBy = row.getValue("updated_by") as string | null;
      return <div>{updatedBy || "-"}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    cell: ({ row }) => <div>{row.getValue("created_at")}</div>,
  },
  {
    accessorKey: "updated_at",
    header: "Ngày cập nhật",
    cell: ({ row }) => <div>{row.getValue("updated_at")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const borrowing = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(borrowing)}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            {borrowing.status === "BORROWING" && (
              <DropdownMenuItem onClick={() => onReturn(borrowing)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Trả sách
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDelete(borrowing)} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
