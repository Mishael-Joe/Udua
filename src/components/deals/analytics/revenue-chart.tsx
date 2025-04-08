"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { format, parseISO } from "date-fns";
import { Card } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";

interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
    discount: number;
  }>;
}

export default function RevenueChart({ data }: RevenueChartProps) {
  // Custom tooltip component
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3 bg-background border shadow-md">
          <p className="font-medium">
            {format(parseISO(label), "MMM dd, yyyy")}
          </p>
          <p className="text-sm text-green-600 flex justify-between">
            <span>Revenue:</span>
            <span className="font-medium ml-2">
              {formatNaira(payload[0].value)}
            </span>
          </p>
          <p className="text-sm text-red-500 flex justify-between">
            <span>Discount:</span>
            <span className="font-medium ml-2">
              {formatNaira(payload[1].value)}
            </span>
          </p>
        </Card>
      );
    }
    return null;
  };

  // Format date for X-axis
  const formatXAxis = (tickItem: string) => {
    return format(parseISO(tickItem), "MMM dd");
  };

  // Format currency for Y-axis
  const formatYAxis = (value: number) => {
    return formatNaira(value).replace("₦", "");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: 10 }}
            formatter={(value) => (
              <span className="text-sm font-medium">{value}</span>
            )}
          />
          <Bar
            dataKey="revenue"
            name="Revenue"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            animationBegin={300}
          />
          <Bar
            dataKey="discount"
            name="Discount"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            animationBegin={600}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
