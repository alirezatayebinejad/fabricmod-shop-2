import { cn } from "@/utils/twMerge";
import { BadgeInfo, AlertCircle, CheckCircle } from "lucide-react";

interface InfoBoxProps {
  type?: "info" | "error" | "success";
  icon?: React.ReactNode;
  content?: React.ReactNode;
  classNames?: {
    container?: string;
    icon?: string;
    content?: string;
  };
}

const InfoBox: React.FC<InfoBoxProps> = ({
  type = "info",
  icon,
  content,
  classNames = {},
}) => {
  const defaultIcons = {
    info: <BadgeInfo className="text-boxBg100" />,
    error: <AlertCircle className="text-destructive-foreground" />,
    success: <CheckCircle className="text-success-foreground" />,
  };

  const defaultContent = {
    info: "عملیات نا مشخص",
    error: "عملیات موفقیت آمیز نبود.",
    success: "عملیات موفقیت آمیز بود.",
  };

  const defaultBgColors = {
    info: "bg-accent-2",
    error: "bg-destructive",
    success: "bg-success",
  };
  const defaultTextColors = {
    info: "text-TextReverse",
    error: "text-destructive-foreground",
    success: "text-success-foreground",
  };
  return (
    <div
      className={cn(
        `my-8 flex items-center gap-3 p-5 max-md:p-3 ${defaultBgColors[type]}`,
        classNames.container,
      )}
    >
      {icon || defaultIcons[type]}
      <h4
        className={cn(
          `!text-TextSize400 max-md:!text-TextSize300 ${defaultTextColors[type]} `,
          classNames.content,
        )}
      >
        {content || defaultContent[type]}
      </h4>
    </div>
  );
};

export default InfoBox;
