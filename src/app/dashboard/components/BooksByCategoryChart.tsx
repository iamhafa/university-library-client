import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Dữ liệu giả định cho biểu đồ Phân loại sách theo thể loại
const booksByCategoryData = [
  { category: "Khoa học", bookCount: 300 },
  { category: "Lịch sử", bookCount: 200 },
  { category: "Tiểu thuyết", bookCount: 450 },
  { category: "Công nghệ thông tin", bookCount: 500 },
  { category: "Kinh tế", bookCount: 150 },
  { category: "Văn học", bookCount: 250 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF69B4"];

const BooksByCategoryChart = () => (
  <Card className="h-[32rem] flex flex-col">
    <CardHeader>
      <CardTitle>Phân Loại Sách Theo Thể Loại</CardTitle>
    </CardHeader>
    <CardContent className="flex-1">
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={booksByCategoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
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
          <Legend wrapperStyle={{ paddingTop: "10px" }} className="font-inter" />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default BooksByCategoryChart;
