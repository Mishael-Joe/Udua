"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  endDate: Date;
  className?: string;
}

export default function CountdownTimer({
  endDate,
  className,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false,
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.expired) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.expired) {
    return (
      <div className={cn("text-destructive font-medium", className)}>
        Deal Expired
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1 text-sm", className)}>
      <span className="text-muted-foreground">Ends in:</span>
      <div className="flex items-center gap-1">
        {timeLeft.days > 0 && (
          <>
            <span className="font-semibold">{timeLeft.days}d</span>
            <span className="text-muted-foreground">:</span>
          </>
        )}
        <span className="font-semibold">
          {String(timeLeft.hours).padStart(2, "0")}h
        </span>
        <span className="text-muted-foreground">:</span>
        <span className="font-semibold">
          {String(timeLeft.minutes).padStart(2, "0")}m
        </span>
        <span className="text-muted-foreground">:</span>
        <span className="font-semibold">
          {String(timeLeft.seconds).padStart(2, "0")}s
        </span>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { cn } from "@/lib/utils";

// interface CountdownTimerProps {
//   endDate: Date;
//   className?: string;
// }

// export default function CountdownTimer({
//   endDate,
//   className,
// }: CountdownTimerProps) {
//   const [timeLeft, setTimeLeft] = useState({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//     expired: false,
//   });

//   useEffect(() => {
//     const calculateTimeLeft = () => {
//       const now = new Date();
//       const difference = endDate.getTime() - now.getTime();

//       if (difference <= 0) {
//         return {
//           days: 0,
//           hours: 0,
//           minutes: 0,
//           seconds: 0,
//           expired: true,
//         };
//       }

//       return {
//         days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//         hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//         minutes: Math.floor((difference / 1000 / 60) % 60),
//         seconds: Math.floor((difference / 1000) % 60),
//         expired: false,
//       };
//     };

//     // Initial calculation
//     setTimeLeft(calculateTimeLeft());

//     // Update every second
//     const timer = setInterval(() => {
//       const newTimeLeft = calculateTimeLeft();
//       setTimeLeft(newTimeLeft);

//       if (newTimeLeft.expired) {
//         clearInterval(timer);
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [endDate]);

//   if (timeLeft.expired) {
//     return (
//       <div className={cn("text-destructive font-medium", className)}>
//         Deal Expired
//       </div>
//     );
//   }

//   return (
//     <div className={cn("flex items-center gap-1 text-sm", className)}>
//       <span className="text-muted-foreground">Ends in:</span>
//       <div className="flex items-center gap-1">
//         {timeLeft.days > 0 && (
//           <>
//             <span className="font-semibold">{timeLeft.days}d</span>
//             <span className="text-muted-foreground">:</span>
//           </>
//         )}
//         <span className="font-semibold">
//           {String(timeLeft.hours).padStart(2, "0")}h
//         </span>
//         <span className="text-muted-foreground">:</span>
//         <span className="font-semibold">
//           {String(timeLeft.minutes).padStart(2, "0")}m
//         </span>
//         <span className="text-muted-foreground">:</span>
//         <span className="font-semibold">
//           {String(timeLeft.seconds).padStart(2, "0")}s
//         </span>
//       </div>
//     </div>
//   );
// }
