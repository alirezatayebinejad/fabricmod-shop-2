"use client";
import React, { ChangeEvent, ReactNode, useState } from "react";
import { cn } from "@/utils/twMerge";
import { Frown, Search } from "lucide-react";
import InputBasic from "@/components/inputs/InputBasic";
import { Skeleton } from "@/components/datadisplay/Skeleton";
import { Pagination } from "@heroui/pagination";
import RetryError from "@/components/datadisplay/RetryError";
import SelectBox from "@/components/inputs/SelectBox";

export type TableGenerateData = {
  headers: {
    content: ReactNode;
    className?: string;
  }[];
  body?: {
    cells: {
      data: ReactNode;
      className?: string;
    }[];
    className?: string;
  }[];
};

type TableGenerateProps = {
  title?: string;
  data?: TableGenerateData;
  styles?: {
    container?: string;
    header?: string;
    row?: string;
    cell?: string;
    theads?: string;
  };
  topHeader?: boolean;
  stripedRows?: boolean;
  searchable?: boolean;
  pagination?: {
    page: number;
    total: number;
  };
  onPageChange?: (page: number) => void;
  loading?: {
    columns: number;
    rows: number;
  };
  headerLeftContent?: React.ReactNode;
  error?: boolean;
  onRetry?: () => void;
  onSearchChange?: (searchTerm: string, basedOn?: string) => void;
  onSearchSubmitted?: (searchTerm: string, basedOn?: string) => void;
  searchPlaceholder?: string;
  searchBasedOnOptions?: { key: string; label: string }[];
  onSearchBasedChange?: (basedOn: string) => void;
  beforeSearchBasedChange?: (basedOn: string | undefined) => void;
};

const TableGenerate: React.FC<TableGenerateProps> = ({
  title,
  data,
  styles,
  topHeader,
  stripedRows = false,
  searchable = false,
  pagination,
  onPageChange,
  loading,
  headerLeftContent,
  error,
  onRetry,
  onSearchChange,
  onSearchSubmitted,
  searchPlaceholder = "جستجو...",
  searchBasedOnOptions,
  onSearchBasedChange,
  beforeSearchBasedChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [basedOn, setBasedOn] = useState<string | undefined>(
    searchBasedOnOptions?.[0]?.key,
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange?.(value, basedOn);
  };

  const handleSearchSubmit = () => {
    onSearchSubmitted?.(searchTerm, basedOn);
  };

  const handleBasedOnChange = (option: ChangeEvent<HTMLSelectElement>) => {
    beforeSearchBasedChange?.(basedOn);
    const value = option.target.value;
    setBasedOn(value);
    setSearchTerm("");
    onSearchBasedChange?.(value);
  };

  const displayedBody = data?.body;

  return (
    <div
      className={cn("border-1 border-border bg-transparent", styles?.container)}
    >
      {topHeader && (
        <div className="flex items-center justify-between p-4">
          {title && (
            <div>
              <h2 className="text-TextSize700 font-[500] text-TextLow">
                {title}
              </h2>
            </div>
          )}
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <div className="flex">
              {searchBasedOnOptions && (
                <SelectBox
                  options={searchBasedOnOptions}
                  selectedKeys={basedOn ? [basedOn] : []}
                  onChange={handleBasedOnChange}
                  classNames={{
                    value: "!text-TextColor",
                    container: "min-w-[110px] max-w-[110px]",
                    trigger:
                      "!bg-boxBg100 rounded-[0px_8px_8px_0px] border-l-0",
                    popoverContent: "min-w-[130px]",
                  }}
                />
              )}
              {searchable && (
                <InputBasic
                  name="search"
                  type="search"
                  value={searchTerm}
                  placeholder={searchPlaceholder}
                  endContent={
                    <Search
                      className="cursor-pointer text-TextLow"
                      onClick={handleSearchSubmit}
                    />
                  }
                  onChange={handleSearchChange}
                  classNames={
                    searchBasedOnOptions && {
                      inputWrapper: "rounded-[8px_0_0_8px]",
                    }
                  }
                />
              )}
            </div>
            <div>{headerLeftContent}</div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-b-2xl bg-boxBg100">
          <thead className={cn("bg-boxBg250", styles?.theads)}>
            <tr>
              {data?.headers?.map((header, index) => (
                <th
                  key={index}
                  className={cn(
                    "p-4 text-start text-TextColor",
                    header.className,
                  )}
                >
                  {header.content}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: loading.rows }).map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    "border-t text-TextSize400",
                    stripedRows && rowIndex % 2 === 0 ? "" : "bg-boxBg200",
                  )}
                >
                  {Array.from({ length: loading.columns }).map(
                    (_, cellIndex) => (
                      <td key={cellIndex} className="p-4 text-TextColor">
                        <Skeleton className="h-4" />
                      </td>
                    ),
                  )}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td
                  colSpan={data?.headers.length}
                  className="py-28 text-center"
                >
                  <RetryError onRetry={onRetry!} />
                </td>
              </tr>
            ) : displayedBody?.length === 0 ? (
              <tr>
                <td
                  colSpan={data?.headers.length}
                  className="py-28 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-[12px] text-TextLow">
                    <Frown />
                    <h2 className="text-TextSize600 text-TextLow">
                      نتیجه‌ای یافت نشد
                    </h2>
                  </div>
                </td>
              </tr>
            ) : (
              displayedBody?.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    "border-t text-TextSize400",
                    stripedRows
                      ? rowIndex % 2 === 0
                        ? ""
                        : "bg-boxBg200"
                      : "",
                    row.className,
                  )}
                >
                  {row.cells?.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={cn("p-4 text-TextColor", cell.className)}
                    >
                      {cell.data}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="flex justify-end bg-boxBg300 p-4">
          <div dir="ltr" className={"flex w-full justify-start"}>
            <Pagination
              showControls
              isCompact
              color="primary"
              page={pagination.page}
              total={pagination.total}
              size="sm"
              variant="bordered"
              onChange={onPageChange}
              classNames={{
                item: "border-none text-TextColor",
                cursor: "bg-primary text-primary-foreground rounded-md",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TableGenerate;
