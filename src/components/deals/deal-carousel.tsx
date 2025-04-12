"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DealCard from "./deal-card";
import { cn } from "@/lib/utils";
import { Deal } from "@/types";

interface DealCarouselProps {
  deals: Deal[];
}

export default function DealCarousel({ deals }: DealCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [containerWidth, setContainerWidth] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);

    return () => {
      window.removeEventListener("resize", updateItemsPerView);
    };
  }, []);

  // Calculate container and item widths
  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      setContainerWidth(width);
      setItemWidth(width / itemsPerView);
    }
  }, [containerRef, itemsPerView]);

  // Update translateX when currentIndex changes
  useEffect(() => {
    setTranslateX(-currentIndex * itemWidth);
  }, [currentIndex, itemWidth]);

  const totalSlides = Math.ceil(deals.length / itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev < deals.length - itemsPerView ? prev + 1 : prev
    );
  };

  return (
    <div className="relative">
      <div ref={containerRef} className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {deals.map((deal, index) => (
            <div
              key={deal._id}
              className="shrink-0 px-2"
              style={{ width: itemWidth ? `${itemWidth}px` : "100%" }}
            >
              <DealCard deal={deal} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-background shadow-md",
          currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "opacity-100"
        )}
        onClick={handlePrev}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-background shadow-md",
          currentIndex >= deals.length - itemsPerView
            ? "opacity-50 cursor-not-allowed"
            : "opacity-100"
        )}
        onClick={handleNext}
        disabled={currentIndex >= deals.length - itemsPerView}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Pagination indicators */}
      <div className="flex justify-center mt-4 gap-1">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <Button
            key={index}
            className={cn(
              "w-2 h-2 p-0 rounded-full transition-all",
              index === Math.floor(currentIndex / itemsPerView)
                ? "bg-udua-orange-primary w-4"
                : "bg-muted"
            )}
            onClick={() => setCurrentIndex(index * itemsPerView)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
