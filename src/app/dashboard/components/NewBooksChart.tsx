import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Dữ liệu giả định cho biểu đồ Sách mới nhập
const newBooksData = [
  { month: "Tháng 1", newBooks: 50 },
  { month: "Tháng 2", newBooks: 45 },
  { month: "Tháng 3", newBooks: 60 },
  { month: "Tháng 4", newBooks: 55 },
  { month: "Tháng 5", newBooks: 70 },
  { month: "Tháng 6", newBooks: 65 },
];

const NewBooksChart = () => (
  <Card className="h-[32rem] flex flex-col">
    <CardHeader>
      <CardTitle>Số Sách Mới Nhập Về</CardTitle>
    </CardHeader>
    <CardContent className="flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={newBooksData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <Line
            type="natural"
            dataKey="newBooks"
            name="Sách mới"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default NewBooksChart;
