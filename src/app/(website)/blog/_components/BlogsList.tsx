"use client";
import BlogCard from "@/app/(website)/_components/cards/BlogCard";
import BlogCardHoriz from "@/app/(website)/_components/cards/BlogCardHoriz";
import { useHorizOrVert } from "@/app/(website)/_contexts/HorizOrVert";
import RevealEffect from "@/components/wrappers/RevealEffect";
import { PostsIndexSite } from "@/types/apiTypes";
import { Pagination } from "@heroui/pagination";
import RetryError from "@/components/datadisplay/RetryError";
import { Skeleton } from "@/components/datadisplay/Skeleton";

export default function BlogsList({
  blogs,
  onPageChange,
  error,
  loading,
  mutate,
}: {
  blogs?: PostsIndexSite;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  error?: boolean;
  mutate?: () => void;
}) {
  const { viewMode } = useHorizOrVert();

  return (
    <section>
      {viewMode === "horiz" ? (
        <div className="flex flex-col gap-5">
          {error ? (
            <RetryError onRetry={mutate || (() => {})} />
          ) : loading ? (
            [...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-40 w-full" />
            ))
          ) : (
            <RevealEffect
              mode="fade"
              options={{
                triggerOnce: true,
                fraction: 0.1,
                cascade: true,
                damping: 0.1,
              }}
            >
              {blogs?.posts?.map((blog) => (
                <BlogCardHoriz fullSize key={blog.slug} blog={blog} />
              ))}
            </RevealEffect>
          )}
        </div>
      ) : (
        <RevealEffect
          mode="fade"
          options={{
            triggerOnce: true,
          }}
        >
          <div className="grid grid-cols-2 place-items-center gap-4 max-sm:grid-cols-1">
            {error ? (
              <div className="col-span-full">
                <RetryError onRetry={mutate || (() => {})} />
              </div>
            ) : loading ? (
              [...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-56 w-full" />
              ))
            ) : (
              blogs?.posts?.map((blog) => (
                <BlogCard fullSize key={blog.slug} blog={blog} />
              ))
            )}
          </div>
        </RevealEffect>
      )}
      <div dir="ltr" className="mt-5">
        <Pagination
          showControls
          isCompact
          color="primary"
          page={blogs?.meta.current_page}
          total={blogs?.meta.last_page || 1}
          size="sm"
          variant="bordered"
          onChange={(page) => onPageChange && onPageChange(page)}
          classNames={{
            item: "border-none text-TextColor",
            cursor: "bg-primary text-primary-foreground rounded-md",
          }}
        />
      </div>
    </section>
  );
}
