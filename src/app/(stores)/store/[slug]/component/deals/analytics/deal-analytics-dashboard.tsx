"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format, subDays } from "date-fns";
import { CalendarIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { formatNaira } from "@/lib/utils";
import DealStatusBadge from "./deal-status-badge";
import MetricCard from "./metric-card";
import RedemptionChart from "./redemption-chart";
import RevenueChart from "./revenue-chart";
import ProductDistributionChart from "./product-distribution-chart";
import { Deal } from "@/types";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function DealAnalyticsDashboard({ deal }: { deal: Deal }) {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Calculate key metrics
  const {
    redemptionCount = 0,
    totalDiscountAmount = 0,
    revenueGenerated = 0,
    uniqueUsersUsed = [],
    averageOrderValue = 0,
  } = deal.analytics || {};

  // Calculate conversion rate (example calculation)
  const viewCount = deal.analytics?.viewCount || 100; // Fallback to 100 if not available
  const conversionRate =
    viewCount > 0 ? (redemptionCount / viewCount) * 100 : 0;

  // Generate sample product distribution data
  const productDistributionData = [
    { name: "Product A", value: 35 },
    { name: "Product B", value: 25 },
    { name: "Product C", value: 20 },
    { name: "Product D", value: 15 },
    { name: "Others", value: 5 },
  ];

  // // Handle date range selection
  // const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
  //   if (range.from && range.to) {
  //     setDateRange({ from: range.from, to: range.to });
  //   }
  // };

  // Handle export data
  // const handleExportData = () => {
  //   alert("Exporting data... This would download a CSV in a real application.");
  // };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {deal.name} Analytics
          </h1>
          <p className="text-muted-foreground">
            Track the performance of your promotional deal
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {/* <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto justify-start"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                {format(dateRange.to, "MMM dd, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={handleDateRangeChange}
                initialFocus
              />
            </PopoverContent>
          </Popover> */}
          {/* <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button> */}
        </div>
      </motion.div>

      {/* Deal Info Card */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Deal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Status
                </h3>
                <div className="mt-1">
                  <DealStatusBadge
                    startDate={deal.startDate}
                    endDate={deal.endDate}
                    isActive={deal.isActive}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Date Range
                </h3>
                <p className="mt-1 font-medium">
                  {format(new Date(deal.startDate), "MMM dd, yyyy")} -{" "}
                  {format(new Date(deal.endDate), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Deal Type
                </h3>
                <p className="mt-1 font-medium capitalize">
                  {deal.dealType.replace(/_/g, " ")} (
                  {deal.dealType === "percentage" ||
                  deal.dealType === "flash_sale"
                    ? `${deal.value}%`
                    : deal.dealType === "fixed"
                    ? formatNaira(deal.value)
                    : deal.dealType}
                  )
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <MetricCard
          title="Total Redemptions"
          value={redemptionCount}
          description="Times this deal was used"
          // trend={7.2}
          icon="shopping-bag"
        />
        <MetricCard
          title="Total Discount"
          value={formatNaira(totalDiscountAmount)}
          description="Amount discounted"
          // trend={-2.5}
          icon="tag"
        />
        <MetricCard
          title="Revenue Generated"
          value={formatNaira(revenueGenerated)}
          description="Total revenue from this deal"
          // trend={12.3}
          icon="trending-up"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${conversionRate.toFixed(1)}%`}
          description="Views to redemptions"
          // trend={3.8}
          icon="percent"
        />
        <MetricCard
          title="Avg. Order Value"
          value={formatNaira(averageOrderValue)}
          description="Average per order"
          // trend={5.1}
          icon="shopping-cart"
        />
        <MetricCard
          title="Unique Users"
          value={uniqueUsersUsed.length}
          description="Distinct customers"
          // trend={9.4}
          icon="users"
        />
      </motion.div>

      {/* Charts */}
      {/* <motion.div variants={itemVariants}>
        <Tabs defaultValue="redemptions">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="redemptions">Redemptions</TabsTrigger>
            <TabsTrigger value="revenue">Revenue & Discount</TabsTrigger>
            <TabsTrigger value="products">Product Distribution</TabsTrigger>
          </TabsList>
          <TabsContent value="redemptions" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Redemption Trend</CardTitle>
                <CardDescription>
                  Number of times this deal was used over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <RedemptionChart data={chartData} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="revenue" className="mt-0" forceMount>
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs. Discount</CardTitle>
                <CardDescription>
                  Comparison of revenue generated and discount provided
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <RevenueChart data={chartData} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="products" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Product Distribution</CardTitle>
                <CardDescription>
                  Which products were purchased with this deal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ProductDistributionChart data={productDistributionData} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div> */}
    </motion.div>
  );
}
