// lib/utils/analytics.ts
export const getSafeAnalyticsData = (rawData: any[]) => {
  if (!rawData || rawData.length === 0) {
    return [
      {
        title: "Sample Deal",
        redemptionCount: 0,
        revenueGenerated: 0,
      },
    ];
  }
  return rawData;
};
