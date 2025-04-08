"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import type { Order } from "@/types";

/**
 * Custom hook to fetch and process order details for a store owner
 *
 * @param orderID - The ID of the order to fetch
 * @returns Object containing order details, loading state, and error state
 */
export function useStoreOrderDetails(orderID: string) {
  // Main order data
  const [orderDetails, setOrderDetails] = useState<Order | undefined>(
    undefined
  );

  // UI state management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFetchedRef = useRef(false);

  /**
   * Fetch order details from the API
   * Includes error handling and filtering for store-specific data
   */
  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/store/order-details", {
        orderID,
      });

      setOrderDetails(response.data.orderDetail);
      hasFetchedRef.current = true;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch order details");
      console.error("Failed to fetch order details:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or orderID changes
  useEffect(() => {
    if (orderID) {
      fetchOrderData();
    }

    // Set a timeout to show error message if data isn't fetched within 10 seconds
    const timeoutId = setTimeout(() => {
      if (!hasFetchedRef.current) {
        setLoading(false);
        setError("Request timed out. Please try again.");
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeoutId);
  }, [orderID]);

  return {
    orderDetails,
    loading,
    error,
    refetch: fetchOrderData,
  };
}
