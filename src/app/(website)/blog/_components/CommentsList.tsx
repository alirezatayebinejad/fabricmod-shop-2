"use client";
import CommentCard from "@/app/(website)/blog/_components/CommentCard";
import CommentsForm from "@/app/(website)/blog/_components/CommentsForm";
import { CommentIndex, CommentsIndexSite } from "@/types/apiTypes";
import { Pagination } from "@heroui/pagination";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { useEffect, useState } from "react";

type Props = {
  postOrProductSlug?: string;
  comments?: CommentIndex[] | CommentsIndexSite["comments"];
  type: "products" | "posts";
  page?: number;
  onPageChange?: (page: number) => void;
  lastPage?: number;
  isLoading?: boolean;
  showForm?: boolean;
  mutate?: () => void;
  pagination?: boolean;
  childsReplyDisable?: boolean;
};

export default function CommentsList({
  postOrProductSlug,
  comments,
  type,
  page,
  onPageChange,
  lastPage,
  isLoading = false,
  showForm = true,
  mutate,
  pagination = true,
  childsReplyDisable,
}: Props) {
  const [pageVal, setPageVal] = useState(1);
  const { data } = useSWR(
    !comments
      ? `next/${type}/${postOrProductSlug}/comments?page=${page || pageVal}`
      : null,
    (url: string) => url && apiCRUD({ urlSuffix: url, requiresToken: false }),
  );
  const fetchedComments: CommentsIndexSite = data?.data;
  const [lastPageVal, setLastPageVal] = useState<number>(1);
  useEffect(() => {
    if (fetchedComments) setLastPageVal(fetchedComments.meta?.last_page);
  }, [fetchedComments]);
  const displayComments: typeof comments =
    comments && comments.length > 0
      ? comments
      : fetchedComments?.comments || [];

  return (
    <section className="my-10">
      {showForm && postOrProductSlug && (
        <div>
          <CommentsForm
            postOrProductSlug={postOrProductSlug}
            mutate={mutate}
            type={type}
          />
        </div>
      )}
      {displayComments && displayComments.length > 0 ? (
        <>
          {!isLoading ? (
            <div className="mt-[45px] flex flex-col gap-[24px]">
              {displayComments.map((item) => (
                <CommentCard
                  postOrProductSlug={postOrProductSlug}
                  type={type}
                  replyDisable={childsReplyDisable}
                  key={item.id}
                  comment={item}
                  mutate={mutate}
                />
              ))}
            </div>
          ) : (
            <p>درحال بارگزاری ... </p>
          )}
          <div dir="ltr" className={"mt-5 flex w-full justify-center"}>
            {pagination && lastPage && lastPage?.toString() !== "1" && (
              <Pagination
                showControls
                isCompact
                color="primary"
                page={page || pageVal}
                total={lastPage || lastPageVal}
                size="sm"
                variant="bordered"
                onChange={(page) => {
                  onPageChange?.(page);
                  setPageVal(page);
                }}
                classNames={{
                  item: "border-none text-TextColor",
                  cursor: "bg-primary text-primary-foreground rounded-md",
                }}
              />
            )}
          </div>
        </>
      ) : (
        <div className="flex justify-center py-5">
          <p>نظری وجود ندارد</p>
        </div>
      )}
    </section>
  );
}
