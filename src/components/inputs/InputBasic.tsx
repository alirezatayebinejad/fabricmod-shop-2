"use client";
import { Input } from "@heroui/input";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/twMerge";

type InputBasicProps = {
  name: string;
  type?: string;
  label?: string;
  isDisabled?: boolean;
  defaultValue?: string;
  value?: string | (readonly string[] & string);
  errorMessage?: string;
  labelPlacement?: "inside" | "outside" | "outside-left";
  placeholder?: string;
  endContent?: React.ReactElement;
  startContent?: React.ReactElement;
  isRequired?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  classNames?: {
    label?: string;
    inputWrapper?: string;
    input?: string;
    container?: string;
  };
  ariaLable?: string;
  dir?: "rtl" | "ltr";
};

const InputBasic: React.FC<InputBasicProps> = ({
  name,
  type = "text",
  label,
  isDisabled = false,
  defaultValue = "",
  value,
  isRequired = false,
  errorMessage = "",
  endContent,
  startContent,
  labelPlacement = "outside",
  placeholder = "",
  onKeyDown,
  onChange,
  classNames,
  ariaLable,
  dir,
}) => {
  const [isPassVisible, setIsPassVisible] = useState(false);

  const handleToggleVisibility = () => {
    setIsPassVisible((prev) => !prev);
  };

  const passwordEndContent = (
    <button
      className="focus:outline-none"
      type="button"
      onClick={handleToggleVisibility}
    >
      {isPassVisible ? (
        <EyeOff className="w-[16px] text-TextColor" />
      ) : (
        <Eye className="w-[16px] text-TextColor" />
      )}
    </button>
  );

  return (
    <div className={cn("", classNames?.container)}>
      <Input
        name={name}
        type={isPassVisible ? "text" : type}
        label={
          label ? (
            <p className={"text-TextSize400 !text-TextColor"}>
              {label}
              {isRequired && (
                <span className="pr-1 !text-TextSize400 text-destructive-foreground">
                  *
                </span>
              )}
            </p>
          ) : null
        }
        dir={dir}
        aria-label={ariaLable}
        labelPlacement={labelPlacement}
        onKeyDown={onKeyDown}
        placeholder={
          labelPlacement === "outside" && !placeholder ? " " : placeholder
        }
        disabled={isDisabled}
        defaultValue={defaultValue}
        endContent={type === "password" ? passwordEndContent : endContent}
        startContent={startContent}
        value={value}
        classNames={{
          label: cn(
            "[&>p]:!text-TextColor [&>p]:text-TextSize400 after:content-['']",
            classNames?.label,
            labelPlacement === "outside" ? "-mt-0 top-[23px]" : "",
          ),
          inputWrapper: cn(
            "!bg-boxBg300 min-h-[50px] rounded-[5px] !shadow-none",
            classNames?.inputWrapper,
          ),
          input: cn("!text-TextColor", classNames?.input),
        }}
        onWheel={
          type === "number"
            ? (e) => (e.target as HTMLElement).blur()
            : undefined
        }
        isInvalid={!!errorMessage}
        errorMessage={errorMessage}
        onChange={onChange}
      />
    </div>
  );
};

export default InputBasic;
