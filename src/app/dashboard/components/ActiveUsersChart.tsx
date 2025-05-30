import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Dữ liệu giả định cho biểu đồ Số lượng sinh viên đang hoạt động
const activeUsersData = [
  { month: "Tháng 1", activeUsers: 150 },
  { month: "Tháng 2", activeUsers: 170 },
  { month: "Tháng 3", activeUsers: 190 },
  { month: "Tháng 4", activeUsers: 180 },
  { month: "Tháng 5", activeUsers: 210 },
  { month: "Tháng 6", activeUsers: 220 },
];

const ActiveUsersChart = () => (
  <Card className="h-[32rem] flex flex-col">
    <CardHeader>
      <CardTitle>Số Lượng Sinh Viên Đang Hoạt Động</CardTitle>
      <CardDescription>Thống kê số sinh viên hoạt động hàng tháng trong thư viện.</CardDescription>
    </CardHeader>
    <CardContent className="flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={activeUsersData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <Bar dataKey="activeUsers" name="Số sinh viên" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default ActiveUsersChart;
