import BlogCard from "@/app/(website)/_components/cards/BlogCard";
import EditPostButton from "@/app/(website)/blog/_components/EditPostButton";
import PostCommentSection from "@/app/(website)/blog/_components/PostCommentSection";
import PostWidgets from "@/app/(website)/blog/_components/PostWidgets";
import Carousel from "@/components/datadisplay/Carousel";
import { serverCacheDynamic } from "@/constants/cacheNames";
import {
  blogFaqJsonLd,
  blogPostJsonLd,
  postBreadcrumbJsonLd,
  relatedPostsJsonLd,
} from "@/constants/jsonlds";
import apiCRUD from "@/services/apiCRUD";
import { PostShowSite } from "@/types/apiTypes";
import { dateConvert } from "@/utils/dateConvert";
import { Eye, MessageCircle, Star } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const slugString = (await params).slug[0];
  const dataRes = await apiCRUD({
    urlSuffix: "next/posts/" + slugString,
    requiresToken: false,
    ...serverCacheDynamic(slugString).post,
  });
  const data: PostShowSite = dataRes?.data;

  return {
    title:
      data?.seo_title ?? `مقاله ${data?.title} |  - خرید آنلاین باتری ماشین`,
    description:
      data?.seo_description ?? data?.description?.slice(0, 160) + "...",
    openGraph: {
      title: data?.seo_title ?? data?.title,
      description: data?.seo_description ?? data?.description,
      images: data?.primary_image
        ? `${process.env.NEXT_PUBLIC_IMG_BASE}${data?.primary_image}`
        : "/default-og-image.png",
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const slugString = (await params).slug[0];
  const dataRes = await apiCRUD({
    urlSuffix: "next/posts/" + slugString,
    requiresToken: false,
    ...serverCacheDynamic(slugString).post,
  });
  const data: PostShowSite = dataRes?.data;

  return (
    <main className="min-h-dvh">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostJsonLd(data)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(postBreadcrumbJsonLd(data)),
        }}
      />
      {data?.faqs && data.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogFaqJsonLd(data)),
          }}
        />
      )}
      {data?.related_posts && data.related_posts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(relatedPostsJsonLd(data)),
          }}
        />
      )}
      <div className="mx-auto max-w-[1000px]">
        <div className="flex flex-col gap-5 py-16">
          <h1 className="text-[40px] font-bold max-md:text-[26px]">
            {data?.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4">
              <p>در {dateConvert(data?.created_at, "persian")} آپدیت شد</p>
              <EditPostButton postId={data?.id} />
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 rounded-[12px] bg-boxBg300 px-2 py-0.5">
                <Eye className="h-4 w-4 text-TextLow" />
                <p className="text-TextSize300 text-TextLow">
                  {data?.views_count} بازدید
                </p>
              </span>
              <span className="flex items-center gap-1 rounded-[12px] bg-boxBg300 px-2 py-0.5">
                <Star className="h-4 w-4 text-TextLow" />
                <p className="text-TextSize300 text-TextLow">
                  {data?.rate} امتیاز
                </p>
              </span>
              <span className="flex items-center gap-1 rounded-[12px] bg-boxBg300 px-2 py-0.5">
                <MessageCircle className="h-4 w-4 text-TextLow" />
                <p className="text-TextSize300 text-TextLow">
                  {data?.comments_count} نظر
                </p>
              </span>
            </div>
          </div>
        </div>
        <div>
          <Image
            src={
              data?.primary_image
                ? process.env.NEXT_PUBLIC_IMG_BASE + data?.primary_image
                : "/images/imageplaceholder.png"
            }
            alt={"post image"}
            width={1150}
            height={600}
            className="h-auto w-full rounded-[12px]"
            priority
          />
        </div>
        <div className="mt-10 flex flex-col gap-8">
          <p className="text-TextSize500 leading-8 text-TextColor">
            {data?.description}
          </p>
          <div
            dangerouslySetInnerHTML={{ __html: data?.body }}
            className="pages_content text-TextSize500 leading-8 text-TextColor"
          ></div>
          <div>
            <PostWidgets data={data} />
          </div>
          <PostCommentSection data={data} />
        </div>
        <Carousel
          title="شاید از این نوشته‌ها نیز خوشتان بیاید"
          cards={data?.related_posts?.map((p) => (
            <BlogCard blog={p} key={p.slug} />
          ))}
        />
      </div>
    </main>
  );
}
