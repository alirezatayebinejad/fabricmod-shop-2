import { Index, Initials } from "@/types/apiTypes";
import { Button } from "@heroui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({
  categ,
}: {
  categ:
    | Index["categories"][number]
    | Initials["categories"][number]["childs"][number]
    | Initials["categories"][number];
}) {
  return (
    <Link
      prefetch={false}
      href={"/shop?category=" + categ.slug}
      className="group relative max-h-[270px] min-w-[270px] max-w-[270px] overflow-hidden rounded-[5px] max-md:max-h-[170px] max-md:min-w-[170px] max-md:max-w-[170px]"
    >
      <Image
        src={
          categ?.primary_image
            ? process.env.NEXT_PUBLIC_IMG_BASE + categ?.primary_image
            : "/images/imageplaceholder.png"
        }
        alt={categ.name}
        height={270}
        width={270}
        className={
          "z-0 h-full w-full object-cover transition-transform duration-400 group-hover:scale-110"
        }
      />
      <div className="absolute right-5 top-5">
        <h3 className="rounded-[6px_6px_0_6px] bg-white/20 px-1 text-TextSize700 font-bold text-TextColor max-md:text-TextSize500">
          {categ?.name}
        </h3>
        <p className="inline-block rounded-[0px_0px_6px_6px] bg-white/20 px-1 text-TextSize500 text-TextColor max-md:text-TextSize400">
          {categ?.products_count} محصولات
        </p>
      </div>
      <div className="absolute bottom-0 left-0 h-auto rounded-tr-[20px] bg-bodyBg pb-3 pl-3 pr-2 pt-2">
        <div className="relative">
          <Button
            className="h-8 w-8 !min-w-0 rounded-full bg-primary !text-TextSize400 text-primary-foreground dark md:h-10 md:w-10"
            isIconOnly
          >
            <ArrowLeft className="w-5 rotate-45" />
          </Button>
          {/* fake round corner */}
          <span className="absolute -left-3 -top-7 h-5 w-5 rounded-bl-[8px] bg-transparent shadow-[-5px_5px_0px_var(--bodyBg)]"></span>
          <span className="absolute -bottom-3 -right-7 h-5 w-5 rounded-bl-[8px] bg-transparent shadow-[-5px_5px_0px_var(--bodyBg)]"></span>
        </div>
      </div>
    </Link>
  );
}
