"use client";
import CommentsList from "@/app/(website)/blog/_components/CommentsList";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";
import RetryError from "@/components/datadisplay/RetryError";
import Loader from "@/components/svg/Loader";
import { useFiltersContext } from "@/contexts/SearchFilters";
import apiCRUD from "@/services/apiCRUD";
import { CommentIndex, PaginateMeta } from "@/types/apiTypes";
import { useState } from "react";
import useSWR from "swr";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom"; // Importing SelectSearchCustom

export default function Comments() {
  const { filters, changeFilters, deleteFilter } = useFiltersContext();
  const [page, setPage] = useState(1);
  const [type, setType] = useState("post");
  const { data, error, isLoading, mutate } = useSWR(
    `admin-panel/comments?type=${type}${filters ? filters : ""}`,
    (url: string) =>
      apiCRUD({
        urlSuffix: url,
      }),
  );
  const comments: CommentIndex[] = data?.data?.comments;
  const meta: PaginateMeta = data?.data?.meta;
  const pages = meta?.last_page;

  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb items={[{ title: "پنل" }, { title: "کامنت ها" }]} />
        </div>
        <div className="mb-5">
          <h1 className="text-TextSize500 font-[500] text-secondary">
            کامنت ها
          </h1>
        </div>
        <div className="mb-5 flex flex-wrap justify-end gap-2">
          <SelectSearchCustom
            options={[
              { id: "post", title: "پست" },
              { id: "product", title: "محصول" },
            ]}
            onChange={(value) => {
              if (value?.[0]) setType(type);
              else setType(type);
            }}
            value={[{ id: type, title: type === "post" ? "پست" : "محصول" }]}
            isSearchDisable
            placeholder="نوع"
            classNames={{
              base: "max-w-[150px]",
              container: "border-1 border-accent-1",
            }}
          />
          <SelectSearchCustom
            options={[
              { id: "approved", title: "تأیید شده" },
              { id: "rejected", title: "رد شده" },
              { id: "pending", title: "در انتظار" },
            ]}
            onChange={(value) => {
              if (value?.[0]) changeFilters("status=" + value?.[0]?.id);
              else deleteFilter("status");
            }}
            placeholder="وضعیت"
            classNames={{
              base: "max-w-[150px]",
              container: "border-1 border-accent-1",
            }}
          />
        </div>
        <div>
          {isLoading ? (
            <div className="flex h-[300px] w-full items-center justify-center">
              <Loader />
            </div>
          ) : error ? (
            <div className="h-[250px]">
              <RetryError onRetry={() => mutate()} />
            </div>
          ) : (
            <div>
              <CommentsList
                type={type === "post" ? "posts" : "products"}
                comments={comments}
                isLoading={isLoading}
                mutate={mutate}
                page={page}
                lastPage={pages}
                onPageChange={(page) => {
                  setPage(page);
                  changeFilters(`page=${page}`);
                }}
                showForm={false}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
