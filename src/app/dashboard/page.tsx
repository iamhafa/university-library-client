"use client";

import AppHeader from "@/components/common/app-header";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Dữ liệu giả định cho biểu đồ Sách được mượn nhiều nhất
const topBorrowedBooksData = [
  { bookTitle: "Lập trình JavaScript", borrowCount: 120 },
  { bookTitle: "Thiết kế hệ thống", borrowCount: 95 },
  { bookTitle: "Cấu trúc dữ liệu", borrowCount: 88 },
  { bookTitle: "Thuật toán nâng cao", borrowCount: 75 },
  { bookTitle: "Mạng máy tính cơ bản", borrowCount: 60 },
  { bookTitle: "Cơ sở dữ liệu SQL", borrowCount: 55 },
  { bookTitle: "Phát triển web React", borrowCount: 50 },
  { bookTitle: "Kỹ thuật phần mềm", borrowCount: 45 },
  { bookTitle: "Trí tuệ nhân tạo", borrowCount: 40 },
  { bookTitle: "Hệ điều hành", borrowCount: 35 },
];

// Dữ liệu giả định cho biểu đồ Xu hướng mượn sách theo thời gian
const borrowingTrendsData = [
  { date: "Tháng 1", borrowCount: 200 },
  { date: "Tháng 2", borrowCount: 220 },
  { date: "Tháng 3", borrowCount: 250 },
  { date: "Tháng 4", borrowCount: 230 },
  { date: "Tháng 5", borrowCount: 280 },
  { date: "Tháng 6", borrowCount: 300 },
  { date: "Tháng 7", borrowCount: 270 },
  { date: "Tháng 8", borrowCount: 320 },
  { date: "Tháng 9", borrowCount: 350 },
  { date: "Tháng 10", borrowCount: 330 },
  { date: "Tháng 11", borrowCount: 380 },
  { date: "Tháng 12", borrowCount: 400 },
];

// Dữ liệu giả định cho biểu đồ Phân loại sách theo thể loại
const booksByCategoryData = [
  { category: "Khoa học", bookCount: 300 },
  { category: "Lịch sử", bookCount: 200 },
  { category: "Tiểu thuyết", bookCount: 450 },
  { category: "Công nghệ thông tin", bookCount: 500 },
  { category: "Kinh tế", bookCount: 150 },
  { category: "Văn học", bookCount: 250 },
];

// Màu sắc cho biểu đồ tròn
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF69B4"];

// Dữ liệu giả định cho biểu đồ Số lượng sách khả dụng/đã mượn
const availableBorrowedData = [
  { month: "Tháng 1", totalBooks: 2000, borrowedBooks: 500 },
  { month: "Tháng 2", totalBooks: 2000, borrowedBooks: 550 },
  { month: "Tháng 3", totalBooks: 2000, borrowedBooks: 600 },
  { month: "Tháng 4", totalBooks: 2000, borrowedBooks: 580 },
  { month: "Tháng 5", totalBooks: 2000, borrowedBooks: 650 },
  { month: "Tháng 6", totalBooks: 2000, borrowedBooks: 700 },
];

/**
 * Biểu đồ cột hiển thị Top Sách được mượn nhiều nhất.
 * Sử dụng Recharts và Tailwind CSS.
 */
const TopBorrowedBooksChart = () => (
  <div className="bg-white p-6 rounded-lg shadow-md h-96 flex flex-col">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Sách Được Mượn Nhiều Nhất</h2>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={topBorrowedBooksData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
          dataKey="bookTitle"
          angle={-45}
          textAnchor="end"
          height={80}
          tick={{ fill: "#4a5568", fontSize: 12 }}
          interval={0} // Hiển thị tất cả các nhãn
          style={{ fontFamily: "Inter" }}
        />
        <YAxis tick={{ fill: "#4a5568", fontSize: 12 }} style={{ fontFamily: "Inter" }} />
        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.05)" }}
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
          labelStyle={{ color: "#2d3748", fontWeight: "bold" }}
          itemStyle={{ color: "#2d3748" }}
        />
        <Legend wrapperStyle={{ paddingTop: "10px", fontFamily: "Inter" }} />
        <Bar dataKey="borrowCount" name="Số lượt mượn" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Biểu đồ đường hiển thị Xu hướng mượn sách theo thời gian.
 * Sử dụng Recharts và Tailwind CSS.
 */
const BorrowingTrendsChart = () => (
  <div className="bg-white p-6 rounded-lg shadow-md h-96 flex flex-col">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">Xu Hướng Mượn Sách Theo Thời Gian</h2>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={borrowingTrendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="date" tick={{ fill: "#4a5568", fontSize: 12 }} style={{ fontFamily: "Inter" }} />
        <YAxis tick={{ fill: "#4a5568", fontSize: 12 }} style={{ fontFamily: "Inter" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
          labelStyle={{ color: "#2d3748", fontWeight: "bold" }}
          itemStyle={{ color: "#2d3748" }}
        />
        <Legend wrapperStyle={{ paddingTop: "10px", fontFamily: "Inter" }} />
        <Line
          type="monotone"
          dataKey="borrowCount"
          name="Số lượt mượn"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Biểu đồ tròn hiển thị Phân loại sách theo thể loại.
 * Sử dụng Recharts và Tailwind CSS.
 */
const BooksByCategoryChart = () => (
  <div className="bg-white p-6 rounded-lg shadow-md h-96 flex flex-col items-center justify-center">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">Phân Loại Sách Theo Thể Loại</h2>
    <ResponsiveContainer width="100%" height="80%">
      <PieChart>
        <Pie
          data={booksByCategoryData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="bookCount"
          nameKey="category"
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {booksByCategoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
          labelStyle={{ color: "#2d3748", fontWeight: "bold" }}
          itemStyle={{ color: "#2d3748" }}
        />
        <Legend wrapperStyle={{ paddingTop: "10px", fontFamily: "Inter" }} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Biểu đồ vùng hiển thị Số lượng sách khả dụng và đã mượn.
 * Sử dụng Recharts và Tailwind CSS.
 */
const AvailableBorrowedChart = () => (
  <div className="bg-white p-6 rounded-lg shadow-md h-96 flex flex-col">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">Sách Khả Dụng vs. Đã Mượn</h2>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={availableBorrowedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="month" tick={{ fill: "#4a5568", fontSize: 12 }} style={{ fontFamily: "Inter" }} />
        <YAxis tick={{ fill: "#4a5568", fontSize: 12 }} style={{ fontFamily: "Inter" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
          labelStyle={{ color: "#2d3748", fontWeight: "bold" }}
          itemStyle={{ color: "#2d3748" }}
        />
        <Legend wrapperStyle={{ paddingTop: "10px", fontFamily: "Inter" }} />
        <Area type="monotone" dataKey="totalBooks" name="Tổng số sách" stroke="#8884d8" fillOpacity={1} fill="url(#colorTotal)" />
        <Area
          type="monotone"
          dataKey="borrowedBooks"
          name="Sách đã mượn"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorBorrowed)"
        />
        {/* Định nghĩa gradient cho các vùng */}
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorBorrowed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Component App chính chứa tất cả các biểu đồ.
 * Sử dụng Tailwind CSS để tạo bố cục dashboard.
 */
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans antialiased">
      <AppHeader title="Dashboard Quản Lý Thư Viện" sub_title="Tổng quan về hoạt động thư viện" />

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Biểu đồ 1: Top Sách Được Mượn Nhiều Nhất */}
        <TopBorrowedBooksChart />

        {/* Biểu đồ 2: Xu Hướng Mượn Sách Theo Thời Gian */}
        <BorrowingTrendsChart />

        {/* Biểu đồ 3: Phân Loại Sách Theo Thể Loại */}
        <BooksByCategoryChart />

        {/* Biểu đồ 4: Sách Khả Dụng vs. Đã Mượn */}
        <AvailableBorrowedChart />
      </main>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>&copy; 2023 Dashboard Thư Viện. Tất cả quyền được bảo lưu.</p>
      </footer>
    </div>
  );
}
