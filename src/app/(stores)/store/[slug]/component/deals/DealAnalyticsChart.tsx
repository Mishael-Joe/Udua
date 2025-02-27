// components/deals/DealAnalyticsChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DealAnalyticsChartProps {
  data: {
    title: string;
    redemptionCount: number;
    revenueGenerated: number;
  }[];
}

export const DealAnalyticsChart = ({ data }: DealAnalyticsChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="title" />
        <YAxis className="pl-0" />
        <Tooltip />
        <Legend />
        <Bar dataKey="redemptionCount" fill="#8884d8" name="Redemptions" />
        <Bar dataKey="revenueGenerated" fill="#82ca9d" name="Revenue ($)" />
      </BarChart>
    </ResponsiveContainer>
  );
};
