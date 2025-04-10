"use client";

import { motion } from "framer-motion";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PercentIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TagIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CountUp from "react-countup";

type IconType =
  | "shopping-bag"
  | "tag"
  | "trending-up"
  | "percent"
  | "shopping-cart"
  | "users";

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  trend?: number;
  icon: IconType;
}

export default function MetricCard({
  title,
  value,
  description,
  trend = 0,
  icon,
}: MetricCardProps) {
  const isPositiveTrend = trend >= 0;

  const getIcon = () => {
    switch (icon) {
      case "shopping-bag":
        return <ShoppingBagIcon className="h-5 w-5" />;
      case "tag":
        return <TagIcon className="h-5 w-5" />;
      case "trending-up":
        return <TrendingUpIcon className="h-5 w-5" />;
      case "percent":
        return <PercentIcon className="h-5 w-5" />;
      case "shopping-cart":
        return <ShoppingCartIcon className="h-5 w-5" />;
      case "users":
        return <UsersIcon className="h-5 w-5" />;
      default:
        return <ShoppingBagIcon className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{title}</span>
          <div className="rounded-full bg-muted p-2">{getIcon()}</div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold">
            {typeof value === "number" ? (
              <CountUp end={value} duration={2} separator="," />
            ) : (
              value
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        {/* {trend !== undefined && (
          <div className="mt-4 flex items-center">
            <div
              className={`flex items-center text-xs ${
                isPositiveTrend ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositiveTrend ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {Math.abs(trend).toFixed(1)}%
              </motion.span>
            </div>
            <span className="text-xs text-muted-foreground ml-1">
              vs. last period
            </span>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}
