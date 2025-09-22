import RevealEffect from "@/components/wrappers/RevealEffect";
import { Index } from "@/types/apiTypes";
import { cn } from "@/utils/twMerge";
import { Button } from "@heroui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BannerCard({
  bgImg,
  headTitle,
  title,
  description,
  data,
  height = 280,
  containerStyle,
  fixedImage = true,
  imageWidth = 769,
  imageHeight = 325,
  imageClassName = "",
}: {
  bgImg: string;
  headTitle: string;
  title: string;
  description: string;
  data: Index["banners"]["three"][number];
  height?: number;
  containerStyle?: string;
  fixedImage?: boolean;
  imageWidth?: number;
  imageHeight?: number;
  imageClassName?: string;
}) {
  // Calculate aspect ratio for padding-bottom hack if fixedImage is true
  const aspectRatio =
    fixedImage && imageWidth && imageHeight
      ? (imageHeight / imageWidth) * 100
      : undefined;

  return (
    <RevealEffect mode="fade" options={{ triggerOnce: true, fraction: 0.3 }}>
      <div
        className={cn(
          "relative w-full",
          fixedImage ? "overflow-hidden" : "",
          containerStyle ?? "",
        )}
        style={
          fixedImage
            ? {
                // Use aspect-ratio for modern browsers, fallback to padding-bottom
                aspectRatio: `${imageWidth} / ${imageHeight}`,
                maxWidth: imageWidth,
                // fallback for older browsers
                ...(aspectRatio
                  ? { height: "auto", paddingBottom: `${aspectRatio}%` }
                  : {}),
              }
            : { height: `${height}px` }
        }
      >
        {fixedImage ? (
          <Image
            src={process.env.NEXT_PUBLIC_IMG_BASE + bgImg}
            alt={title || "background image"}
            width={imageWidth}
            height={imageHeight}
            className={cn(
              "z-0 h-full w-full rounded-[10px] object-cover",
              imageClassName,
            )}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        ) : (
          <Image
            src={process.env.NEXT_PUBLIC_IMG_BASE + bgImg}
            alt={title || "background image"}
            fill
            className={"z-0 h-full w-full rounded-[10px]"}
          />
        )}
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
            <Button
              as={Link}
              href={data.url}
              className="h-[45px] rounded-full bg-primary px-3 !text-TextSize400 text-primary-foreground"
            >
              {data.btn_text || "خرید کنید"}
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
