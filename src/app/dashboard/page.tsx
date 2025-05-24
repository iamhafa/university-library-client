"use client";

import AppHeader from "@/components/common/app-header";
import TopBorrowedBooksChart from "./components/TopBorrowedBooksChart";
import BorrowingTrendsChart from "./components/BorrowingTrendsChart";
import BooksByCategoryChart from "./components/BooksByCategoryChart";
import AvailableBorrowedChart from "./components/AvailableBorrowedChart";
import ActiveUsersChart from "./components/ActiveUsersChart";
import OverdueBooksChart from "./components/OverdueBooksChart";
import NewBooksChart from "./components/NewBooksChart";

/**
 * Component App chính chứa tất cả các biểu đồ.
 * Sử dụng Tailwind CSS để tạo bố cục dashboard.
 */
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans antialiased">
      <AppHeader title="Dashboard Quản Lý Thư Viện" sub_title="Tổng quan về hoạt động thư viện" />

      <main className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {/* Biểu đồ 1: Top Sách Được Mượn Nhiều Nhất */}
        <TopBorrowedBooksChart />

        {/* Biểu đồ 4: Sách Khả Dụng vs. Đã Mượn */}
        <AvailableBorrowedChart />

        {/* Biểu đồ 3: Phân Loại Sách Theo Thể Loại */}
        <BooksByCategoryChart />

        {/* Biểu đồ 2: Xu Hướng Mượn Sách Theo Thời Gian */}
        <BorrowingTrendsChart />

        <ActiveUsersChart />

        <OverdueBooksChart />

        {/* <NewBooksChart /> */}
      </main>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>&copy; 2025 Dashboard Thư Viện. Tất cả quyền được bảo lưu.</p>
      </footer>
    </div>
  );
}
