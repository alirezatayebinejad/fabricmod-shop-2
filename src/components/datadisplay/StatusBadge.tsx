import React from "react";
import { cn } from "@/utils/twMerge";

type StatusBadgeProps = {
  title: string;
  mode?: "success" | "pending" | "error";
  classname?: string;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  title,
  mode,
  classname,
}) => {
  const modeClasses = {
    success: "bg-success text-success-foreground",
    pending: "bg-accent-2 text-TextReverse",
    error: "bg-destructive text-destructive-foreground",
  };

  return (
    <div
      className={cn(
        "inline-block rounded-[4px] px-2 py-1 text-TextSize400 font-[400]",
        mode ? modeClasses[mode] : "",
        classname,
      )}
    >
      {title}
    </div>
  );
};

export default StatusBadge;
