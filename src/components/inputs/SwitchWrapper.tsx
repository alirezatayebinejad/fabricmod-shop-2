import React from "react";
import { Spinner } from "@heroui/spinner";
import { cn } from "@/utils/twMerge";

type SwitchWrapperProps = {
  label?: string;
  isSelected?: number | string | boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  onChange: (val: "0" | "1") => void;
  styles?: {
    wrapper?: string;
    thumb?: string;
    startContent?: string;
    endContent?: string;
    label?: string;
  };
  errorMessage?: string;
};

const SwitchWrapper: React.FC<SwitchWrapperProps> = ({
  label,
  isSelected,
  isDisabled,
  isLoading,
  startContent = <div className="text-[12px] text-white">فعال</div>,
  endContent = <div className="text-[12px] text-white">غیرفعال</div>,
  onChange,
  styles = {},
  errorMessage,
}) => {
  const positives = ["1", 1, true];

  // Determine if the switch is selected or not
  const selected = isSelected && positives.includes(isSelected);

  const defaultStyles = {
    wrapper:
      "relative inline-flex items-center h-[24px] w-[68px] rounded-full cursor-pointer transition-all",
    track: selected ? `bg-primary` : `bg-boxBg500`,
    thumb: selected ? "translate-x-[48px] bg-white" : "translate-x-1 bg-white",
    startContent: `text-[12px] text-TextColor absolute left-2 ${selected ? "" : "hidden"}`,
    endContent: `text-[12px] text-TextColor absolute right-1.5 ${selected ? "hidden" : ""}`,
    label: "flex gap-1",
  };

  // Handle switch value change
  const handleSwitch = () => {
    if (isDisabled || isLoading) return;
    onChange(selected ? "0" : "1");
  };

  return (
    <div>
      {/* Label */}
      <label className={cn(defaultStyles.label, styles.label)}>
        {label ? label : ""}
        <div
          dir="ltr"
          onClick={handleSwitch}
          className={cn("flex items-center")}
        >
          {/* Custom Switch */}
          <div
            className={cn(defaultStyles.wrapper, styles.wrapper, {
              "cursor-not-allowed opacity-50": isDisabled || isLoading,
            })}
          >
            {/* Track */}
            <div
              className={cn(
                "absolute h-full w-full rounded-full transition-all duration-200 ease-in-out",
                defaultStyles.track,
              )}
            />
            {/* Thumb */}
            <div
              className={cn(
                "relative h-[16px] w-[16px] rounded-full transition-transform duration-200 ease-in-out",
                defaultStyles.thumb,
                styles.thumb,
              )}
            />
            <div className={cn(defaultStyles.endContent, styles.endContent)}>
              {isLoading ? (
                <div className="mr-3 mt-1.5">
                  <Spinner color="white" size="sm" />
                </div>
              ) : (
                endContent
              )}
            </div>
            <div
              className={cn(defaultStyles.startContent, styles.startContent)}
            >
              {isLoading ? (
                <div className="ml-3 mt-1.5">
                  <Spinner color="white" size="sm" />
                </div>
              ) : (
                startContent
              )}
            </div>
          </div>
          {/* End Content */}
        </div>
      </label>
      {/* Error Message */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};
export default SwitchWrapper;
