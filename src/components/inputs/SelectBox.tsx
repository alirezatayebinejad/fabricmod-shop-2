import { Select, SelectItem } from "@heroui/select";
import { cn } from "@/utils/twMerge";

export type SelectBoxProps = {
  name?: string;
  label?: React.ReactNode;
  isDisabled?: boolean;
  defaultSelectedKeys?: string[];
  selectedKeys?: string[];
  isRequired?: boolean;
  errorMessage?: string;
  selectionMode?: "single" | "multiple" | "none";
  labelPlacement?: "inside" | "outside" | "outside-left";
  options: {
    key: string | number;
    label: string;
  }[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  ariaLabel?: string;
  classNames?: {
    label?: string;
    selectorIcon?: string;
    value?: string;
    trigger?: string;
    listbox?: string;
    popoverContent?: string;
    innerWrapper?: string;
    mainWrapper?: string;
    base?: string;
    container?: string;
  };
};

export default function SelectBox({
  name = "",
  label,
  isDisabled = false,
  defaultSelectedKeys = [],
  selectedKeys,
  isRequired = false,
  errorMessage = "",
  labelPlacement = "outside",
  selectionMode = "single",
  options,
  onChange,
  placeholder = "انتخاب کنید",
  ariaLabel,
  classNames,
}: SelectBoxProps) {
  return (
    <div dir="rtl" className={cn("w-full", classNames?.container)}>
      <Select
        name={name}
        aria-label={ariaLabel}
        label={
          label && (
            <p
              className={cn(
                "text-TextSize400 !text-TextColor",
                classNames?.label,
              )}
            >
              {label}
              {isRequired && (
                <span className="pr-1 !text-TextSize200">(اجباری)</span>
              )}
            </p>
          )
        }
        labelPlacement={labelPlacement}
        placeholder={placeholder}
        defaultSelectedKeys={defaultSelectedKeys}
        isDisabled={isDisabled}
        selectionMode={selectionMode}
        selectedKeys={selectedKeys}
        classNames={{
          label: cn(
            "!text-TextColor text-TextSize400 -mr-2",
            classNames?.label,
          ),
          selectorIcon: cn(
            "left-3 right-auto text-TextLow",
            classNames?.selectorIcon,
          ),
          value: cn("text-right", classNames?.value),
          trigger: cn(
            "!bg-boxBg300 pl-6 min-h-[40px] h-[40px] rounded-full data-[open]:outline-primary-100 data-[open]:outline-offset-0 data-[open]:outline-4",
            classNames?.trigger,
          ),
          listbox: cn("text-TextColor", classNames?.listbox),
          popoverContent: cn("rounded-[8px]", classNames?.popoverContent),
          innerWrapper: cn(
            "[&>span]:!text-TextSize400 w-[98%] [&>span]:text-TextMute",
            classNames?.innerWrapper,
          ),
          mainWrapper: cn("", classNames?.mainWrapper),
          base: cn("", classNames?.base),
        }}
        isInvalid={!!errorMessage}
        errorMessage={errorMessage}
        onChange={(e) => (onChange ? onChange(e) : null)}
      >
        {options.map((option) => (
          <SelectItem key={option.key}>{option.label}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
