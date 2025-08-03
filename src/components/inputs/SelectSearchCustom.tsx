"use client";
import Loader from "@/components/svg/Loader";
import { cn } from "@/utils/twMerge";
import { Check, ChevronDown, RefreshCw, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

export type SelectSearchItem<T = string> = {
  id: number | string;
  title: string;
  description?: string;
  helperValue?: T;
};

export type SelectSearchCustomProps<T = string> = {
  options?: SelectSearchItem<T>[]; // for static options
  requestSelectOptions?: (
    searchQuery?: string,
  ) => Promise<SelectSearchItem<T>[] | undefined>; // for dynamic options (api)
  isSearchFromApi?: boolean;
  isSearchDisable?: boolean;
  placeholder?: string;
  onChange?: (option: SelectSearchItem<T>[]) => void;
  isMultiSelect?: boolean;
  isDisable?: boolean;
  title?: string;
  defaultValue?: SelectSearchItem<T>[];
  value?: SelectSearchItem<T>[];
  errorMessage?: string;
  endContent?: React.ReactNode;
  isRequired?: boolean;
  classNames?: {
    base?: string;
    inputWrapper?: string;
    container?: string;
    icon?: string;
  };
  showNoOneOption?: boolean;
  revalidatorValue?: any; // new prop
};

const SelectSearchCustom = <T = string,>({
  options,
  requestSelectOptions,
  isSearchFromApi = false,
  isSearchDisable = false,
  placeholder = "انتخاب کنید",
  onChange,
  isMultiSelect = false,
  isDisable = false,
  title,
  defaultValue,
  value,
  errorMessage = "",
  endContent,
  isRequired = false,
  classNames,
  showNoOneOption = true,
  revalidatorValue, // new prop
}: SelectSearchCustomProps<T>) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [optionsList, setOptionsList] = useState<
    SelectSearchItem<T>[] | null | undefined
  >(options);
  const [filteredOptions, setFilteredOptions] = useState<
    SelectSearchItem<T>[] | null | undefined
  >(optionsList);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<SelectSearchItem<T>[]>(
    defaultValue || value || [],
  );

  const [dropdownDirection, setDropdownDirection] = useState("bottom");
  const selectRef = useRef<HTMLDivElement>(null);
  const isFirstOpen = useRef(true);
  const inputChangeTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (value) setSelectedOptions(value || []);
  }, [value]);

  useEffect(() => {
    if (options) setOptionsList(options);
    if (options) setFilteredOptions(options);
    if (optionsList) setFilteredOptions(optionsList);
    if (isFirstOpen.current && !options && requestSelectOptions && open) {
      fetchData();
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event?.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
    // eslint-disable-next-line
  }, [open, options]);

  useEffect(() => {
    if (revalidatorValue !== undefined) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [revalidatorValue]);

  const fetchData = async (searchQuery?: string) => {
    if (!requestSelectOptions) return;

    setLoadingOptions(true);

    const dynamicOptions = await requestSelectOptions(
      isSearchFromApi ? searchQuery : undefined,
    );
    setFilteredOptions(dynamicOptions);
    setOptionsList(dynamicOptions);
    setLoadingOptions(false);
    isFirstOpen.current = false;
  };

  const toggleDropdown = () => {
    if (isDisable) return;

    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const dropdownHeight = 250; // approximate height of the dropdown

      if (rect.bottom + dropdownHeight > windowHeight) {
        setDropdownDirection("top");
      } else {
        setDropdownDirection("bottom");
      }
    }

    setOpen((prev) => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e?.target?.value);
    const searchQuery = e?.target?.value?.toLowerCase();

    //clear timeout for the last letter types
    if (inputChangeTimeout.current) {
      clearTimeout(inputChangeTimeout.current);
    }

    if (isSearchFromApi) {
      // search from api
      inputChangeTimeout.current = setTimeout(() => {
        fetchData(searchQuery);
      }, 1000);
    } else {
      // search locally
      const filtered = optionsList?.filter((option) =>
        option.title.toLowerCase().includes(searchQuery),
      );
      setFilteredOptions(filtered);
    }
  };

  const handleOptionClick = (option: SelectSearchItem<T>) => {
    if (option.title === "no one") {
      setSelectedOptions([]);
      setSearchTerm("");
      setOpen(false);
      if (onChange) {
        onChange([]);
      }
    } else if (!isMultiSelect) {
      setSelectedOptions([option]);
      setSearchTerm("");
      setOpen(false);
      if (onChange) {
        onChange([option]);
      }
    } else {
      const selectedIndex = selectedOptions.findIndex(
        (selectedOption) =>
          selectedOption.id?.toString() === option.id?.toString(),
      );
      if (selectedIndex > -1) {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions.splice(selectedIndex, 1);
        setSelectedOptions(newSelectedOptions);
        if (onChange) {
          onChange(newSelectedOptions);
        }
      } else {
        const newSelectedOptions = [...selectedOptions, option];
        setSelectedOptions(newSelectedOptions);
        if (onChange) {
          onChange(newSelectedOptions);
        }
      }
    }
  };
  const clearSelection = (id: number | string) => {
    if (isDisable) {
      return;
    }

    if (id) {
      const newOptions = selectedOptions.filter((option) => id !== option.id);
      setSelectedOptions(newOptions);
      if (onChange) {
        onChange(newOptions);
      }
    } else {
      setSelectedOptions([]);
      setSearchTerm("");
      setOpen(false);
      if (onChange) {
        onChange([]);
      }
    }
  };

  return (
    <div ref={selectRef} className={cn("relative w-full", classNames?.base)}>
      {title && (
        <p className="z-10 -mt-0.5 mb-1.5 pr-1 text-TextSize400 text-TextColor">
          {title}
          {isRequired && (
            <span className="pr-1 !text-TextSize400 text-destructive-foreground">
              *
            </span>
          )}
        </p>
      )}
      <div
        className={cn(
          "flex min-h-[50px] items-center justify-between rounded-[5px] bg-boxBg300 px-3 py-2 text-TextColor",
          classNames?.container,
        )}
        onClick={toggleDropdown}
        style={{ cursor: isDisable ? "default" : "pointer" }}
      >
        {selectedOptions?.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1 text-[14px] text-TextColor">
            {isMultiSelect ? (
              selectedOptions?.map((option) => (
                <span
                  key={option.id}
                  className="flex cursor-pointer items-center gap-0 rounded-[5px] bg-primary-100 p-[0px_3px]"
                >
                  <p className="text-[12px]">{option.title}</p>
                  <X
                    className="h-3 w-3 text-primary"
                    onClick={(e) => {
                      clearSelection(option.id);
                      e.stopPropagation();
                    }}
                  />
                </span>
              ))
            ) : (
              <div>
                <p className="mr-2">{selectedOptions[0].title}</p>
                {selectedOptions[0]?.description && (
                  <p className="mr-2 text-[12px] text-TextLow">
                    {selectedOptions[0].description}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <span className="text-[14px] text-TextColor">{placeholder}</span>
        )}
        <div>
          {endContent ? (
            endContent
          ) : (
            <ChevronDown
              className={cn(
                `h-[16px] w-[16px] text-TextColor duration-100 ${open ? "rotate-180" : ""}`,
                classNames?.icon,
              )}
              style={{ display: isDisable ? "none" : "block" }}
            />
          )}
        </div>
      </div>
      {open && (
        <div
          className={`absolute ${dropdownDirection === "top" ? "bottom-[45px]" : "top-full mt-1"} z-[50] w-full rounded-[5px] border-1 border-border bg-boxBg200 shadow-lg`}
        >
          <div className="relative">
            {!isSearchDisable && (
              <input
                type="text"
                placeholder="جستجو..."
                aria-label="حستجو"
                className="w-full rounded-t-[8px] border-b-1 border-border bg-transparent p-2 text-TextSize400 text-TextColor placeholder:text-[12px] focus:outline-none"
                value={searchTerm}
                onChange={handleInputChange}
              />
            )}
            {requestSelectOptions && !loadingOptions && (
              <div
                onClick={() => fetchData(searchTerm)}
                className="absolute bottom-0 left-0 flex cursor-pointer items-center gap-1 rounded-[0_8px_0_8px] bg-primary-100 p-1 transition-colors hover:bg-primary-200"
              >
                <RefreshCw className="h-[12px] w-[12px] text-TextColor" />
                <p className="text-[12px]">بروزرسانی</p>
              </div>
            )}
            <ul className="max-h-[300px] overflow-y-auto p-3">
              {showNoOneOption &&
              filteredOptions &&
              filteredOptions.length > 0 ? (
                <li
                  className={`mb-1 flex cursor-pointer items-center justify-between rounded-[8px] px-3 py-2 text-[14px] text-TextColor hover:bg-boxBg300`}
                  onClick={() => handleOptionClick({ id: -1, title: "no one" })}
                >
                  <p>هیچ کدام</p>
                </li>
              ) : filteredOptions && filteredOptions.length === 0 ? (
                <div>
                  <p>موردی پیدا نشد</p>
                </div>
              ) : null}
              {filteredOptions && !loadingOptions ? (
                filteredOptions.map((option) => (
                  <li
                    key={option.id}
                    className={`mb-1 flex cursor-pointer items-center justify-between rounded-[8px] px-3 py-2 text-[14px] text-TextColor hover:bg-boxBg500 ${
                      selectedOptions.find(
                        (o) => o.id?.toString() === option.id?.toString(),
                      ) && "bg-boxBg500"
                    }`}
                    onClick={() => handleOptionClick(option)}
                  >
                    <div>
                      <p>{option.title}</p>
                      {option?.description && (
                        <p className="mr-2 text-[12px] text-TextLow">
                          {option.description}
                        </p>
                      )}
                    </div>
                    {selectedOptions.find(
                      (o) => o.id?.toString() === option.id?.toString(),
                    ) && <Check className={`h-[16px] w-[16px]`} />}
                  </li>
                ))
              ) : loadingOptions ? (
                <div className="grid h-full w-full place-content-center">
                  <Loader />
                </div>
              ) : (
                <div>
                  {isSearchFromApi ? <p>جستجو کنید</p> : <p>موردی پیدا نشد</p>}
                </div>
              )}
            </ul>
          </div>
        </div>
      )}
      {errorMessage && (
        <p className="h-[24px] text-[0.75rem] text-destructive-foreground">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default SelectSearchCustom;
