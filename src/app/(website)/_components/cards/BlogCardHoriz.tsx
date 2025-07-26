import { PostsIndexSite } from "@/types/apiTypes";
import { dateConvert } from "@/utils/dateConvert";
import { Button } from "@heroui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BlogCardHoriz({
  blog,
  fullSize = false,
  tinymode = false,
}: {
  blog: PostsIndexSite["latest_posts"][number];
  fullSize?: boolean;
  tinymode?: boolean;
}) {
  return (
    <div
      className={`group relative flex border-border ${tinymode ? "max-h-[80px] min-h-[80px] gap-2 border-b-1 py-2 last-of-type:border-0" : "gap-4 border-b-1 pb-5 max-md:pb-10"} ${
        fullSize
          ? "h-full w-full"
          : "min-w-[380px] max-w-[380px] max-md:min-w-[170px] max-md:max-w-[170px]"
      }`}
    >
      <div className="relative min-w-[33%] max-w-[33%] !overflow-hidden !rounded-[10px]">
        <Link prefetch={false} href={"/blog/post/" + blog?.slug}>
          <Image
            src={
              blog?.primary_image
                ? process.env.NEXT_PUBLIC_IMG_BASE + blog?.primary_image
                : "/images/imageplaceholder.png"
            }
            alt="banner"
            height={160}
            width={220}
            className={
              "min-h-full w-full !rounded-[11px] border-1 object-cover"
            }
          />
          {!tinymode && (
            <div className="absolute right-2 top-2 rounded-[5px] bg-accent-1 px-1">
              <p className="text-TextSize300 text-accent-1-foreground">
                {"category" in blog && blog?.category?.name}
              </p>
            </div>
          )}
        </Link>
      </div>
      <div className="flex flex-col gap-2 py-2">
        <div>
          {!tinymode && (
            <p className="text-TextSize300 text-TextLow">
              {dateConvert(blog?.updated_at, "persian")}
            </p>
          )}
          <h3
            className={`${tinymode ? "-mt-2 line-clamp-2 text-TextSize300" : "text-TextSize500 font-bold"} max-md:text-TextSize300`}
          >
            {blog?.title}
          </h3>
        </div>
        {!tinymode && (
          <p className="line-clamp-3 text-TextSize400 text-TextLow max-md:line-clamp-1 max-md:text-TextSize300">
            {blog?.description}
          </p>
        )}
      </div>
      <div
        className={`absolute left-0 ${tinymode ? `bottom-[2px] text-TextLow` : "bottom-4 max-md:bottom-0"}`}
      >
        <Link prefetch={false} href={"/blog/post/" + blog?.slug}>
          <Button
            className={`gap-1 rounded-full border-1 border-border bg-transparent text-TextColor group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground max-md:border-none ${tinymode ? "!min-w-auto max-h-[25px] border-none p-0 px-1 text-TextSize300" : "text-TextSize400"}`}
          >
            ادامه مطلب
            <ArrowLeft className="w-3 text-TextLow group-hover:text-primary-foreground" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
