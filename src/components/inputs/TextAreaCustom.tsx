"use client";
import { cn } from "@/utils/twMerge";
import { Textarea } from "@heroui/input";
import React, { ChangeEvent, forwardRef } from "react";

export type TextareaProps = {
  name?: string;
  type?: string;
  label: string;
  labelPlacement?: "inside" | "outside" | "outside-left";
  placeholder?: string;
  isDisabled?: boolean;
  defaultValue?: string;
  value?: string;
  isRequired?: boolean;
  errorMessage?: string;
  classNames?: {
    label?: string;
    inputWrapper?: string;
    input?: string;
  };
  onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
};

const TextAreaCustom = forwardRef<HTMLInputElement, TextareaProps>(
  (
    {
      name,
      type = "text",
      label,
      labelPlacement = "outside",
      placeholder = " ",
      isDisabled = false,
      value,
      defaultValue = "",
      isRequired = false,
      errorMessage = "",
      classNames,
      onChange,
    },
    ref,
  ) => {
    return (
      <div>
        <Textarea
          name={name}
          type={type}
          baseRef={ref}
          label={
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
          }
          labelPlacement={labelPlacement}
          placeholder={placeholder}
          disabled={isDisabled}
          defaultValue={defaultValue}
          value={ref ? undefined : value || ""}
          onChange={(e) => onChange && onChange(e)}
          classNames={{
            label: cn("!text-TextColor text-TextSize400", classNames?.label),
            inputWrapper: cn(
              "!bg-boxBg300 border-1 rounded-[5px] focus-within:outline-primary100 focus-within:outline-offset-0 focus-within:outline-4",
              classNames?.inputWrapper,
            ),
            input: cn("!text-TextColor", classNames?.input),
          }}
          isInvalid={!!errorMessage}
          errorMessage={errorMessage}
        />
      </div>
    );
  },
);

TextAreaCustom.displayName = "TextAreaCustom";

export default TextAreaCustom;
