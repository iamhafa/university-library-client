import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Dữ liệu giả định cho biểu đồ Số lượng sách khả dụng/đã mượn
const availableBorrowedData = [
  { month: "Tháng 1", totalBooks: 2000, borrowedBooks: 500 },
  { month: "Tháng 2", totalBooks: 2000, borrowedBooks: 550 },
  { month: "Tháng 3", totalBooks: 2000, borrowedBooks: 600 },
  { month: "Tháng 4", totalBooks: 2000, borrowedBooks: 580 },
  { month: "Tháng 5", totalBooks: 2000, borrowedBooks: 650 },
  { month: "Tháng 6", totalBooks: 2000, borrowedBooks: 700 },
];

const AvailableBorrowedChart = () => (
  <Card className="h-[32rem] flex flex-col">
    <CardHeader>
      <CardTitle>Sách Khả Dụng vs. Đã Mượn</CardTitle>
    </CardHeader>
    <CardContent className="flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={availableBorrowedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="month" tick={{ fill: "#4a5568", fontSize: 12 }} className="font-inter" />
          <YAxis tick={{ fill: "#4a5568", fontSize: 12 }} className="font-inter" />
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
          <Legend wrapperStyle={{ paddingTop: "10px" }} className="font-inter" />
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
          <Area
            type="monotone"
            dataKey="totalBooks"
            name="Tổng số sách"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorTotal)"
          />
          <Area
            type="monotone"
            dataKey="borrowedBooks"
            name="Sách đã mượn"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorBorrowed)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default AvailableBorrowedChart;
