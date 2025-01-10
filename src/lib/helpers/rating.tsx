"use client";

import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import React, { useState } from "react";

function Rating() {
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2 items-center justify-center w-full h-fit py-5">
      <div className="flex items-center justify-center gap-2 w-full">
        {Array.from({ length: 5 }, (_, i) => {
          const currentRating = i + 1;
          return (
            <label key={i}>
              <Star
                width={25}
                height={25}
                className={`cursor-pointer ${
                  currentRating <= (hover ?? rating ?? 0)
                    ? `text-yellow-500 fill-yellow-500`
                    : `dark:text-white dark:fill-white fill-gray-500 text-gray-500`
                }`}
                onMouseEnter={() => setHover(currentRating)}
                onMouseLeave={() => setHover(null)}
              />
              <input
                type="radio"
                name="rating"
                value={currentRating}
                onClick={() => setRating(currentRating)}
                className="hidden"
              />
            </label>
          );
        })}
      </div>

      <div className="w-full p-4">
        <Textarea 
          className="block w-full  mt-5 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
    </div>
  );
}

export default Rating;
