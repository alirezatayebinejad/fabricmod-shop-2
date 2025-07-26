import { cn } from "@/utils/twMerge";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-boxBg500", className)}
      {...props}
    />
  );
}

export { Skeleton };
