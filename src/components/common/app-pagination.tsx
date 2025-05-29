"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Props = {
  totalSelects?: number;
  totalItems?: number;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
};

const AppPagination: FC<Props> = ({ totalSelects = 0, totalItems = 0, page, limit, totalPages, onPageChange, onLimitChange }) => {
  const pageSizes: number[] = [10, 20, 30, 40, 50];

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {totalSelects} dòng đã chọn trong tổng số {totalItems} dòng.
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm">
          Trang {page} / {totalPages}
        </span>
        <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Trước
        </Button>
        <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Sau
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {limit} / trang
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {pageSizes.map((size: number) => (
              <DropdownMenuItem key={size} onSelect={() => onLimitChange(size)}>
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AppPagination;
