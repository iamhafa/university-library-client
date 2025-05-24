import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

/**
 * Biểu đồ cột hiển thị Top Sách được mượn nhiều nhất.
 * Sử dụng Recharts và Tailwind CSS.
 */
const TopBorrowedBooksChart = () => (
  <Card className="h-[32rem] flex flex-col">
    <CardHeader>
      <CardTitle>Top Sách Được Mượn Nhiều Nhất</CardTitle>
    </CardHeader>
    <CardContent className="flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={topBorrowedBooksData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey={"bookTitle"}
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fill: "#4a5568", fontSize: 12 }}
            interval={0}
            style={{ fontFamily: "Inter" }}
          />
          <YAxis tick={{ fill: "#4a5568", fontSize: 12 }} />
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
          <Bar dataKey={"borrowCount"} name="Số lượt mượn" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default TopBorrowedBooksChart;
