import { cn } from "@/utils/twMerge";
import React from "react";

type Props = {
  title: string;
  styles?: {
    container?: string;
    hr?: string;
    title?: string;
  };
};

export default function Title({ title, styles = {} }: Props) {
  return (
    <div
      className={cn("gap my-5 flex flex-col items-center", styles.container)}
    >
      <div>
        <h1 className={cn("mb-3 text-[24px]", styles.title)}>{title} </h1>
        <div className="mr-5">
          <hr
            className={cn(
              "h-[10px] w-[70px] rounded-full bg-primary-200",
              styles.hr,
            )}
          />
          <hr
            className={cn(
              "z-10 mr-[-8px] mt-[-16px] h-[10px] w-[50px] rounded-full bg-primary",
              styles.hr,
            )}
          />
        </div>
      </div>
    </div>
  );
}
