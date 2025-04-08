"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { format, parseISO } from "date-fns";
import { Card } from "@/components/ui/card";

interface RedemptionChartProps {
  data: Array<{
    date: string;
    redemptions: number;
  }>;
}

export default function RedemptionChart({ data }: RedemptionChartProps) {
  const [hoveredData, setHoveredData] = useState<any>(null);

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
          <p className="text-sm text-primary">
            <span className="font-medium">{payload[0].value}</span> redemptions
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          onMouseMove={(e) => {
            if (e.activePayload) {
              setHoveredData(e.activePayload[0]?.payload);
            }
          }}
          onMouseLeave={() => setHoveredData(null)}
        >
          <defs>
            <linearGradient id="redemptionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickCount={5}
            domain={[0, "auto"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="redemptions"
            stroke="#f97316"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#redemptionGradient)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
