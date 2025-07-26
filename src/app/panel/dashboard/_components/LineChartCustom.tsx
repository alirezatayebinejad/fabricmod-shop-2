import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DashboardPanel } from "@/types/apiTypes";

interface LineChartCustomProps {
  data: DashboardPanel["chart_transactions"];
}

export default function LineChartCustom({ data }: LineChartCustomProps) {
  // eslint-disable-next-line
  const formattedData = Object.entries(data).map(([key, values]) => ({
    name: values.month,
    pv: values.total_pay,
  }));

  return (
    <div dir="ltr">
      <ResponsiveContainer
        width="100%"
        height={350}
        className={"mx-auto max-w-[900px]"}
      >
        <LineChart
          width={500}
          height={320}
          data={formattedData}
          margin={{
            top: 20,
            right: 5,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="4 3"
            strokeWidth={1}
            stroke="var(--boxBg500)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            fontSize={12}
            stroke="var(--TextColor)"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            fontSize={12}
            stroke="var(--TextColor)"
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="pv"
            stroke="var(--primary)"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="uv"
            stroke="var(--boxBg500)"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
