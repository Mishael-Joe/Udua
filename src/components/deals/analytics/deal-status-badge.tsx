"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface DealStatusBadgeProps {
  startDate: string | Date;
  endDate: string | Date;
  isActive: boolean;
}

export default function DealStatusBadge({
  startDate,
  endDate,
  isActive,
}: DealStatusBadgeProps) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Determine status
  let status: "upcoming" | "active" | "expired" | "inactive" = "inactive";

  if (!isActive) {
    status = "inactive";
  } else if (now < start) {
    status = "upcoming";
  } else if (now > end) {
    status = "expired";
  } else {
    status = "active";
  }

  // Status config
  const statusConfig = {
    upcoming: {
      label: "Upcoming",
      variant: "outline" as const,
      icon: <Clock className="h-3 w-3 mr-1" />,
    },
    active: {
      label: "Active",
      variant: "success" as const,
      icon: <CheckCircle className="h-3 w-3 mr-1" />,
    },
    expired: {
      label: "Expired",
      variant: "destructive" as const,
      icon: <XCircle className="h-3 w-3 mr-1" />,
    },
    inactive: {
      label: "Inactive",
      variant: "secondary" as const,
      icon: <AlertTriangle className="h-3 w-3 mr-1" />,
    },
  };

  const { label, variant, icon } = statusConfig[status];

  return (
    <Badge variant={variant} className="flex items-center w-fit">
      {icon}
      {label}
    </Badge>
  );
}
