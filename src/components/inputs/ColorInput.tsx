"use client";
import React, { useEffect, useState } from "react";
import InputBasic from "./InputBasic";
import { cn } from "@/utils/twMerge";

type ColorInputProps = {
  name: string;
  label?: string;
  isDisabled?: boolean;
  defaultValue?: string;
  value?: string;
  errorMessage?: string;
  labelPlacement?: "inside" | "outside" | "outside-left";
  placeholder?: string;
  endContent?: React.ReactElement;
  startContent?: React.ReactElement;
  isRequired?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  classNames?: {
    label?: string;
    inputWrapper?: string;
    input?: string;
    container?: string;
  };
  ariaLable?: string;
  dir?: "rtl" | "ltr";
};

const ColorInput: React.FC<ColorInputProps> = ({
  name,
  label,
  isDisabled = false,
  defaultValue,
  value,
  isRequired = false,
  errorMessage = "",
  endContent,
  startContent,
  labelPlacement = "outside",
  placeholder = "",
  onChange,
  classNames = {
    container: labelPlacement === "outside" ? "" : "",
  },
  ariaLable,
  dir = "ltr",
}) => {
  const [color, setColor] = useState(defaultValue || value || "");
  useEffect(() => {
    if (value) setColor(value);
  }, [value]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={cn("flex items-center", classNames?.container)}>
      <InputBasic
        name={name}
        type="text"
        label={label}
        isDisabled={isDisabled}
        defaultValue={defaultValue}
        value={color}
        isRequired={isRequired}
        errorMessage={errorMessage}
        endContent={endContent}
        startContent={
          startContent || (
            <div
              className="ml-2 h-7 w-8 rounded-[8px] border-1 border-TextMute"
              style={{
                backgroundColor: color,
              }}
            />
          )
        }
        labelPlacement={labelPlacement}
        placeholder={placeholder}
        onChange={handleChange}
        classNames={classNames}
        ariaLable={ariaLable}
        dir={dir}
      />
    </div>
  );
};

export default ColorInput;
