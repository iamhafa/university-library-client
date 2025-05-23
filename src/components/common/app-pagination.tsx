"use client";

import { Button } from "@/ui/button";

type Props = {
  totalSelects?: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newLimit: number) => void;
};

/**
 * Pagination component for handling page navigation.
 *
 * @component AppPagination
 * @param {number} props.currentPage - The current active page
 * @param {number} props.pageSize - The number of rows per page
 * @param {number} props.totalPages - The total number of pages
 * @param {(newPage: number) => void} props.onPageChange - Function to change the page
 */
export default function AppPagination({ totalSelects = 0, currentPage, pageSize, totalPages, onPageChange }: Props) {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Đã chọn {totalSelects} trong số {pageSize} hàng.
      </div>
      <div className="space-x-2">
        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          Trang trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
}
