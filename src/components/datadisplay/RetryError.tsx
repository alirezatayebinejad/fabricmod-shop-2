"use client";
import { cn } from "@/utils/twMerge";
import { Button } from "@heroui/button";
import { RotateCcw } from "lucide-react";

type Props = {
  onRetry: () => void;
  classNames?: {
    button?: string;
  };
};
export default function RetryError({ onRetry, classNames }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div>
        <Button
          onPress={() => onRetry()}
          variant="bordered"
          className={cn(
            "border-1 border-destructive text-[13px] text-TextColor",
            classNames?.button,
          )}
          startContent={<RotateCcw className="w-4" />}
        >
          امتحان مجدد
        </Button>
      </div>
    </div>
  );
}
