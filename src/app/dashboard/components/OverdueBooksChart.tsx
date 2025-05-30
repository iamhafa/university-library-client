import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Dữ liệu giả định cho biểu đồ Tỷ lệ sách trễ hạn
const overdueBooksData = [
  { name: "Đúng hạn", value: 85 },
  { name: "Quá hạn", value: 15 },
];

// Màu sắc cho biểu đồ tròn
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF69B4"];

const OverdueBooksChart = () => (
  <Card className="h-[32rem] flex flex-col">
    <CardHeader>
      <CardTitle>Tỷ Lệ Sách Trễ Hạn</CardTitle>
      <CardDescription>Phân tích tỷ lệ sách trả đúng hạn và quá hạn trong thư viện.</CardDescription>
    </CardHeader>
    <CardContent className="flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={overdueBooksData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {overdueBooksData.map((entry, index) => (
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
          <Legend className="font-inter" />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default OverdueBooksChart;
