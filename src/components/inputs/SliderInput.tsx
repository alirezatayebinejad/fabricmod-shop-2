"use client";
import { currency } from "@/constants/staticValues";
import formatPrice from "@/utils/formatPrice";
import { cn } from "@/utils/twMerge";
import { Slider, SliderValue } from "@heroui/slider";

type Props = {
  value: SliderValue;
  onChange: (value: SliderValue) => void;
  minValue: number;
  maxValue: number;
  label?: string;
  formatOptions?: Intl.NumberFormatOptions;
  step?: number;
  valueFormat?: "price" | undefined;
  classNames?: {
    container?: string;
    slider?: string;
    label?: string;
    valueTextContainer?: string;
    valueText?: string;
    thumb?: string;
    track?: string;
  };
};

export default function SliderInput({
  value,
  onChange,
  label,
  step = 1,
  minValue = 0,
  maxValue = 100,
  classNames,
  valueFormat,
}: Props) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-start justify-center gap-2",
        classNames?.container,
      )}
    >
      {label && (
        <h3 className={cn("text-[14px] text-TextColor", classNames?.label)}>
          {label}
        </h3>
      )}
      {Array.isArray(value) ? (
        <div
          className={cn(
            "mt-1 flex w-full items-center justify-between",
            classNames?.valueTextContainer,
          )}
        >
          <p className={cn(classNames?.valueText)}>
            {valueFormat === "price"
              ? formatPrice(value[1]) + " " + currency
              : value[1]}
          </p>
          <p className={cn(classNames?.valueText)}>
            {valueFormat === "price"
              ? formatPrice(value[0]) + " " + currency
              : value[0]}
          </p>
        </div>
      ) : (
        <div
          className={cn(
            "mt-1 flex w-full items-center justify-between",
            classNames?.valueTextContainer,
          )}
        >
          <p className={cn(classNames?.valueText)}>
            {valueFormat === "price"
              ? formatPrice(value) + " " + currency
              : value}
          </p>
        </div>
      )}
      <Slider
        step={step}
        minValue={minValue}
        about="sadkjf"
        maxValue={maxValue}
        value={value}
        aria-label={label || "اسلایدر"}
        onChange={onChange}
        size="sm"
        color="foreground"
        classNames={{
          thumb: cn(
            "bg-TextColor after:border-white after:border-4 after:border-TextLow w-4 h-4",
            classNames?.thumb,
          ),
          track: cn("h-[3px]", classNames?.track),
          endContent: "bg-black",
        }}
      />
    </div>
  );
}
