"use client";
import shortenString from "@/utils/shortenString";
import { cn } from "@/utils/twMerge";
import { ClipboardCheck, Copy } from "lucide-react";
import { useState } from "react";

type ClickToCopyProps = {
  text: string;
  styles?: {
    container?: string;
    text?: string;
    icon?: string;
    message?: string;
  };
};

const ClickToCopy = ({ text, styles }: ClickToCopyProps) => {
  const [message, setMessage] = useState("");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      setMessage("کپی شد");
      setTimeout(() => setMessage(""), 2000); // Clear message after 2 seconds
    });
  };

  return (
    <div className={cn("flex items-center gap-2", styles?.container)}>
      <p
        onClick={copyToClipboard}
        className={cn("cursor-pointer", styles?.text)}
      >
        {shortenString(text, 30, "before")}
      </p>
      {!message ? (
        <Copy className={cn("w-4 text-TextLow", styles?.icon)} />
      ) : (
        <span
          className={cn(
            "flex items-center gap-1 text-TextSize300",
            styles?.message,
          )}
        >
          <ClipboardCheck className={cn("w-4 text-TextLow", styles?.icon)} />{" "}
          کپی شد
        </span>
      )}
    </div>
  );
};

export default ClickToCopy;
