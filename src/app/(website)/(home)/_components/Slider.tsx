"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@heroui/button";
import RevealEffect from "@/components/wrappers/RevealEffect";
import { Index } from "@/types/apiTypes";
import Link from "next/link";

type Props = {
  slidesData: Index["banners"]["slider"];
};
export default function Slider({ slidesData }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ playOnInit: true, delay: 5000 }),
  ]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="relative flex items-center justify-center" dir="ltr">
      <div className="embla !m-0 mx-auto h-[700px] w-full max-md:h-[200px]">
        <div
          className="embla__viewport -mx-[20px] h-full overflow-hidden rounded-[0px]"
          ref={emblaRef}
        >
          <div className="embla__container flex h-full select-none">
            {slidesData?.map((item, i) => (
              <div
                key={item?.image}
                className="embla__slide relative flex min-w-0 flex-[0_0_100%] items-center"
              >
                <Image
                  src={process.env.NEXT_PUBLIC_IMG_BASE + item.image}
                  priority={i === 0 ? true : false}
                  alt={item?.title || "عکس بنر"}
                  fill
                  className="!h-auto w-full animate-[scaleImage_5s_ease-in-out_infinite]"
                />
                {/* content */}
                {item?.title && (
                  <div className="absolute left-[6%] top-[23%] h-[360px] w-[42%] bg-black/35 blur-[69px]"></div>
                )}

                <div
                  className="absolute left-10 top-[30%] min-w-[40%] max-w-[400px] max-md:left-2 max-md:max-w-[150px]"
                  dir="rtl"
                >
                  <RevealEffect
                    mode="fade"
                    options={{
                      cascade: true,
                      direction: "up",
                      triggerOnce: false,
                      damping: 0.5,
                    }}
                  >
                    <h3 className="text-[18px] text-white max-md:text-[12px]">
                      {item?.pre_title || " "}
                    </h3>
                    <h2 className="text-[52px] font-bold text-white max-md:text-[16px]">
                      {item?.title || " "}
                    </h2>
                    <p className="text-white/80 max-md:hidden max-md:text-[12px]">
                      {item?.text || " "}
                    </p>
                    {item.btn_text && item.url && (
                      <Link prefetch={false} href={item?.url || "#"}>
                        <Button className="mt-5 h-[45px] rounded-full bg-primary px-6 !text-TextSize600 text-primary-foreground max-md:!h-[25px] max-md:p-0 max-md:!px-0 max-md:!text-[12px]">
                          {item?.btn_text}
                        </Button>
                      </Link>
                    )}
                  </RevealEffect>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-md:hidden">
          <button
            className="absolute left-5 top-[50%] flex h-10 w-10 items-center justify-center rounded-full bg-boxBg100 p-1 px-2 text-sm text-gray-500 transition-colors hover:bg-primary hover:text-primary-foreground"
            onClick={scrollPrev}
          >
            <ChevronLeft />
          </button>
          <button
            className="absolute right-5 top-[50%] flex h-10 w-10 items-center justify-center rounded-full bg-boxBg100 p-1 px-2 text-sm text-gray-500 transition-colors hover:bg-primary hover:text-primary-foreground"
            onClick={scrollNext}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
