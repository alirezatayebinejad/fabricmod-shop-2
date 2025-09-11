import RevealEffect from "@/components/wrappers/RevealEffect";
import { cn } from "@/utils/twMerge";
import { Button } from "@heroui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function BannerCard({
  bgImg,
  headTitle,
  title,
  description,
  height = 280,
  containerStyle,
}: {
  bgImg: string;
  headTitle: string;
  title: string;
  description: string;
  height?: number;
  containerStyle?: string;
}) {
  return (
    <RevealEffect mode="fade" options={{ triggerOnce: true, fraction: 0.3 }}>
      <div
        className={cn("relative w-full", containerStyle ?? "")}
        style={{ height: `${height}px` }}
      >
        <Image
          src={process.env.NEXT_PUBLIC_IMG_BASE + bgImg}
          alt={title || "background image"}
          fill
          className={"z-0 h-full w-full rounded-[10px]"}
        />
        <div className="absolute m-[20px] max-w-[50%] max-md:max-w-[80%]">
          {headTitle && (
            <h4 className="text-TextSize400 text-TextLow max-md:text-TextSize300">
              {headTitle}
            </h4>
          )}
          {title && (
            <h3 className="mb-5 mt-2 text-[24px] font-[400] max-md:text-TextSize500">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-TextSize500 text-TextLow max-md:text-TextSize400">
              {description}
            </p>
          )}
        </div>
        <div className="absolute bottom-0 right-0 h-auto rounded-tl-[33px] bg-bodyBg pl-3 pt-3">
          <div className="relative">
            <Button className="h-[45px] rounded-full bg-primary px-3 !text-TextSize400 text-primary-foreground">
              خرید کنید
              <ArrowLeft className="w-5" />
            </Button>
            {/* fake round corner */}
            <span className="absolute -left-8 bottom-0 h-5 w-5 rounded-br-full bg-transparent shadow-[5px_5px_0px_var(--bodyBg)]"></span>
            <span className="absolute -top-8 right-0 h-5 w-5 rounded-br-full bg-transparent shadow-[5px_5px_0px_var(--bodyBg)]"></span>
          </div>
        </div>
      </div>
    </RevealEffect>
  );
}
