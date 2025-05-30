import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

/**
 * Biểu đồ đường hiển thị Xu hướng mượn sách theo thời gian.
 * Sử dụng Recharts và Tailwind CSS.
 */
const BorrowingTrendsChart = () => (
  <Card className="h-[32rem] flex flex-col">
    <CardHeader>
      <CardTitle>Xu Hướng Mượn Sách Theo Thời Gian</CardTitle>
      <CardDescription>Thống kê xu hướng số lượt mượn sách hàng tháng trong năm.</CardDescription>
    </CardHeader>
    <CardContent className="flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={borrowingTrendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="date" tick={{ fill: "#4a5568", fontSize: 12 }} className="font-inter" />
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
    </CardContent>
  </Card>
);

export default BorrowingTrendsChart;
