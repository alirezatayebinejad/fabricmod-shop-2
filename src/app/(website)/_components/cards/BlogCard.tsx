import { Index, PostShowSite, PostsIndexSite } from "@/types/apiTypes";
import { dateConvert } from "@/utils/dateConvert";
import { Button } from "@heroui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BlogCard({
  blog,
  fullSize = false,
}: {
  blog:
    | PostsIndexSite["posts"][number]
    | Index["posts"][number]
    | PostShowSite["related_posts"][number];

  fullSize?: boolean;
}) {
  return (
    <div
      className={`group ${
        fullSize
          ? "h-full w-full"
          : "min-w-[380px] max-w-[380px] max-md:min-w-[170px] max-md:max-w-[170px]"
      }`}
    >
      <div className="relative max-h-[220px] min-h-[220px] !overflow-hidden !rounded-[10px] max-md:max-h-[120px] max-md:min-h-[120px]">
        <Link prefetch={false} href={"/blog/post/" + blog.slug}>
          <Image
            src={
              blog?.primary_image
                ? process.env.NEXT_PUBLIC_IMG_BASE + blog?.primary_image
                : "/images/imageplaceholder.png"
            }
            alt={blog.title}
            height={900}
            width={390}
            className={
              "min-h-[220px] w-full !rounded-[11px] border-1 border-border object-cover max-md:min-h-[120px]"
            }
          />
          {"category" in blog && (
            <div className="absolute right-2 top-2 rounded-[5px] bg-accent-1 px-1">
              <p className="text-TextSize300 text-accent-1-foreground">
                {blog?.category?.name}
              </p>
            </div>
          )}
        </Link>
      </div>
      <div className="flex flex-col gap-2 py-2">
        <div>
          <p className="text-TextSize300 text-TextLow">
            {dateConvert(blog?.updated_at, "persian")}
          </p>
          <h3 className="text-TextSize500 font-bold max-md:text-TextSize400">
            {blog?.title}
          </h3>
        </div>
        <p className="line-clamp-3 text-TextSize400 text-TextLow max-md:text-TextSize300">
          {blog?.description}
        </p>
        <div>
          <Button
            as={Link}
            href={"/blog/post/" + blog.slug}
            className="rounded-full border-1 border-border bg-transparent !text-TextSize400 text-TextColor group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
          >
            ادامه مطلب
            <ArrowLeft className="w-4 text-TextColor group-hover:text-primary-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
}
