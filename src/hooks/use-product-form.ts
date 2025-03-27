"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export function useProductForm<T>(
  initialState: T,
  validateFn: (data: T) => boolean,
  submitFn: (data: T) => Promise<void>
) {
  const [formData, setFormData] = useState<T>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Cleanup object URLs when the component unmounts
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateFn(formData)) {
      setIsLoading(false);
      return;
    }

    try {
      await submitFn(formData);
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      router.back();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An error occurred while submitting the form",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    setIsLoading,
    imagePreviews,
    setImagePreviews,
    handleSubmit,
  };
}
