"use client";
import CommentsForm from "@/app/(website)/blog/_components/CommentsForm";
import CommentsList from "@/app/(website)/blog/_components/CommentsList";
import { PostShowSite } from "@/types/apiTypes";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { useInView } from "react-intersection-observer";

export default function PostCommentSection({ data }: { data: PostShowSite }) {
  const [page, setPage] = useState(1);
  const { mutate } = useSWRConfig();
  const { ref, inView } = useInView({
    triggerOnce: true, // Trigger just once
  });

  return (
    <div>
      <div ref={ref}>
        {inView && (
          <>
            <h3 className="text-[30px] font-bold text-TextLow max-md:text-TextSize700">
              دیدگاه های شما
            </h3>
            <CommentsForm
              postOrProductSlug={data?.slug}
              type="posts"
              mutate={() =>
                mutate(`next/posts/${data?.slug}/comments?page=${page}`)
              }
            />
            <CommentsList
              showForm={false}
              postOrProductSlug={data?.slug}
              type="posts"
              pagination={true}
              onPageChange={(p) => setPage(p)}
              mutate={() =>
                mutate(`next/posts/${data?.slug}/comments?page=${page}`)
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
