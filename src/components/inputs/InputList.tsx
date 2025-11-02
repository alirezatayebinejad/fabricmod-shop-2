"use client";
import { Input } from "@heroui/input";
import React, { useState, useEffect } from "react";
import { CirclePlus, X } from "lucide-react";
import { cn } from "@/utils/twMerge";
import { Button } from "@heroui/button";

type InputListProps = {
  name: string;
  type?: string;
  label?: string;
  isDisabled?: boolean;
  defaultValue?: { id: string; name: string }[];
  value?: { id: string; name: string }[];
  errorMessage?: string;
  labelPlacement?: "inside" | "outside" | "outside-left";
  placeholder?: string;
  endContent?: React.ReactElement;
  startContent?: React.ReactElement;
  isRequired?: boolean;
  isRepeatable?: boolean;
  onChange?: (values: { id: string; name: string }[]) => void;
  classNames?: {
    label?: string;
    inputWrapper?: string;
    input?: string;
    container?: string;
  };
  ariaLable?: string;
  dir?: "rtl" | "ltr";
};

const InputList: React.FC<InputListProps> = ({
  name,
  type = "text",
  label,
  isDisabled = false,
  defaultValue = [],
  value,
  isRequired = false,
  errorMessage = "",
  endContent,
  startContent,
  labelPlacement = "outside",
  placeholder = "",
  onChange,
  classNames,
  ariaLable,
  dir,
  isRepeatable = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState(defaultValue);

  useEffect(() => {
    if (value) {
      setItems(value);
    }
  }, [value]);

  // This function splits the input by , or ، and returns trimmed non-empty segments
  const splitInput = (input: string): string[] => {
    return input
      .split(/,|،/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  const handleAddItem = () => {
    if (inputValue.trim()) {
      // Split text on ',' or '،'
      const segments = splitInput(inputValue);

      const newItemsArr: { id: string; name: string }[] = [];
      segments.forEach((segment) => {
        // Check for duplicates if not repeatable
        if (
          isRepeatable ||
          (!items.some((item) => item.name === segment) &&
            !newItemsArr.some((item) => item.name === segment))
        ) {
          newItemsArr.push({
            id: Date.now().toString() + Math.random(),
            name: segment,
          });
        }
      });

      if (newItemsArr.length > 0) {
        const newItems = [...items, ...newItemsArr];
        setItems(newItems);
        onChange?.(newItems);
      }
      setInputValue("");
    }
  };

  const handleRemoveItem = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
    onChange?.(newItems);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div className={cn("", classNames?.container)}>
      {!isDisabled ? (
        <Input
          name={name}
          type={type}
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
          placeholder={
            labelPlacement === "outside" && !placeholder ? " " : placeholder
          }
          disabled={isDisabled}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          endContent={
            endContent ? (
              endContent
            ) : (
              <Button isIconOnly variant="light" onPress={handleAddItem}>
                <CirclePlus className="w-6 text-primary" />
              </Button>
            )
          }
          startContent={startContent}
          classNames={{
            label: cn(
              "[&>p]:!text-TextColor [&>p]:text-TextSize400 after:content-['']",
              classNames?.label,
              labelPlacement === "outside" ? "-mt-2 top-[23px]" : "",
            ),
            inputWrapper: cn(
              "!bg-boxBg300 min-h-[50px] rounded-[5px] !shadow-none",
              classNames?.inputWrapper,
            ),
            input: cn("!text-TextColor", classNames?.input),
          }}
          isInvalid={!!errorMessage}
          errorMessage={errorMessage}
        />
      ) : (
        <div>
          {label ? (
            <p className={"-mt-2 mb-4 text-TextSize400 !text-TextColor"}>
              {label}
              {isRequired && (
                <span className="pr-1 !text-TextSize400 text-destructive-foreground">
                  *
                </span>
              )}
            </p>
          ) : null}
        </div>
      )}
      <div className="mt-2 flex flex-wrap">
        {items.map((item) => (
          <div
            key={item.id}
            className="mb-2 mr-2 flex items-center rounded-full bg-boxBg300 px-1"
          >
            <span className="mr-2 text-TextSize300">{item.name}</span>
            {!isDisabled ? (
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="focus:outline-none"
              >
                <X className="mr-2 w-[13px] text-TextLow hover:text-TextColor" />
              </button>
            ) : (
              <span className="mr-2"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputList;
