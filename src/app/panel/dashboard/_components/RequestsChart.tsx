import { DashboardPanel } from "@/types/apiTypes";
import React from "react";
import {
  PieChart,
  Pie,
  Legend,
  Cell,
  ResponsiveContainer,
  Label,
  LabelProps,
  LegendProps,
} from "recharts";

const COLORS = [
  "rgba(0, 128, 128, 0.6)", // Teal
  "rgba(0, 128, 255, 0.4)", // Light Blue
  "rgba(0, 204, 102, 0.2)", // Light Green
  "rgba(0, 255, 204, 0.1)", // Aqua
];

interface BulletProps {
  backgroundColor: string;
  size: string;
}

const Bullet: React.FC<BulletProps> = ({ backgroundColor, size }) => (
  <div
    className="rounded-full"
    style={{
      backgroundColor,
      width: size,
      height: size,
    }}
  ></div>
);

const CustomizedLegend: React.FC<LegendProps> = (props) => {
  const { payload } = props;
  return (
    <ul className="flex list-none flex-wrap justify-center gap-5">
      {payload?.map((entry, index) => (
        <li key={`item-${index}`} className="flex flex-col items-start">
          <div className="flex items-center">
            <Bullet
              backgroundColor={(entry.payload as any)?.fill || "#000"}
              size="10px"
            />
            <span className="mr-2">
              {entry.value}: {entry.payload?.value}
            </span>
          </div>
          <span className="mr-5"></span>
        </li>
      ))}
    </ul>
  );
};

interface CustomLabelProps extends LabelProps {
  labelText: string;
  value: number;
}

const CustomLabel: React.FC<CustomLabelProps> = ({
  viewBox,
  labelText,
  value,
}) => {
  const { cx, cy } = viewBox as { cx: number; cy: number };
  return (
    <g>
      <text
        x={cx}
        y={cy}
        className="text-center font-medium"
        fill={"var(--TextColor)"}
        textAnchor="middle"
        dominantBaseline="central"
        alignmentBaseline="middle"
        fontSize="15"
      >
        {labelText}
      </text>
      <text
        x={cx}
        y={cy + 20}
        className="text-center font-semibold"
        textAnchor="middle"
        dominantBaseline="central"
        alignmentBaseline="hanging"
        fill={"var(--primary)"}
        fontSize="26"
        fontWeight="600"
      >
        {value}
      </text>
    </g>
  );
};

const TransactionsChart: React.FC<{
  chartData: DashboardPanel["orders"];
}> = ({ chartData }) => {
  const data = [
    { name: "همه", value: chartData?.total || 0 },
    { name: "درحال بررسي", value: chartData?.pending || 0 },
    { name: "آماده سازي", value: chartData?.prepare || 0 },
    { name: "تکميل شده", value: chartData?.ended || 0 },
    { name: "کنسل شده", value: chartData?.cancel || 0 },
  ];

  return (
    <div className="px-2">
      <h3 className="-mb-[80px] p-2 font-[500] text-secondary">تراکنش ها</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx={200}
              cy={200}
              innerRadius={65}
              outerRadius={100}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              <Label
                content={
                  <CustomLabel
                    labelText="تعداد کل"
                    value={chartData.total || 0}
                  />
                }
                position="center"
              />
            </Pie>
            <Legend content={<CustomizedLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionsChart;
