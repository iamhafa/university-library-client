import { useState } from "react";

type Props = {
  totalItems: number;
  initialPage?: number;
  initialLimit?: number;
};

/**
 * Custom hook for handling pagination logic.
 *
 * @param {Object} props - Pagination properties
 * @param {number} props.totalItems - Total number of items (default: 0)
 * @param {number} [props.initialPage=1] - Initial page number (default: 1)
 * @param {number} [props.initialLimit=10] - Initial number of items per page (default: 10)
 * @returns {Object} Pagination state and functions
 * @returns {number} return.page - Current page number
 * @returns {number} return.limit - Number of items per page
 * @returns {number} return.totalPages - Total number of pages
 * @returns {() => void} return.goToNextPage - Function to navigate to the next page
 * @returns {() => void} return.goToPrevPage - Function to navigate to the previous page
 * @returns {(newPage: number) => void} return.changePage - Function to jump to a specific page
 * @returns {(newLimit: number) => void} return.changeLimit - Function to change items per page
 */
export const usePagination = ({ totalItems = 0, initialPage = 1, initialLimit = 10 }: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);

  const totalPages: number = Math.ceil(totalItems / limit);

  const goToNextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const goToPrevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const changePage = (newPage: number) => setCurrentPage(newPage);
  const changeLimit = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset về trang đầu khi thay đổi số lượng items mỗi trang
  };

  return {
    currentPage,
    limit,
    totalPages,
    goToNextPage,
    goToPrevPage,
    changePage,
    changeLimit,
  };
};
