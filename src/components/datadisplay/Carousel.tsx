"use client";
import { useCallback } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@heroui/button";
import RevealEffect from "@/components/wrappers/RevealEffect";
import Link from "next/link";

type Props = {
  cards: React.ReactNode[];
  title: string;
  moreButton?: boolean;
  ButtonLink?: string;
  autoplay?: boolean;
  loop?: boolean;
};

export default function Carousel({
  cards,
  title,
  moreButton,
  ButtonLink = "#",
  autoplay = false,
  loop = false,
}: Props) {
  const options: EmblaOptionsType = {
    align: "center",
    direction: "rtl",
    dragFree: true,
    loop: loop,
  };

  const plugins = autoplay ? [Autoplay({ playOnInit: true, delay: 5000 })] : [];
  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const isEmpty = !cards || cards.length === 0;

  return (
    <section className="relative flex w-full flex-col py-8">
      <div
        className={`${
          moreButton
            ? "flex flex-wrap justify-between gap-3 text-center"
            : "text-center"
        }`}
      >
        <h2 className="text-TextSize600 font-bold md:text-[32px]">{title}</h2>
        {moreButton && (
          <Link prefetch={false} href={ButtonLink}>
            <Button
              variant="flat"
              className="!text-TextSize400 text-TextLow md:text-TextSize500"
              size="sm"
            >
              مشاهده همه
              <ChevronLeft className="w-4" />
            </Button>
          </Link>
        )}
      </div>
      {!isEmpty && (
        <>
          <Button
            onClick={scrollPrev}
            variant="flat"
            size="sm"
            isIconOnly
            className="absolute -right-3 top-[50%] z-10 h-8 min-w-5 rounded-full bg-boxBg200 px-0 text-TextLow shadow-md md:h-10 md:min-w-10"
          >
            <ChevronRight />
          </Button>
          <Button
            variant="flat"
            onClick={scrollNext}
            size="sm"
            isIconOnly
            className="absolute -left-3 top-[50%] z-10 h-8 min-w-5 rounded-full bg-boxBg200 px-0 text-TextLow shadow-md md:h-10 md:min-w-10"
          >
            <ChevronLeft />
          </Button>
        </>
      )}
      <RevealEffect
        mode="customFadeUp"
        options={{ triggerOnce: true, fraction: 0.3 }}
      >
        <div
          className="embla__viewport relative overflow-hidden py-10"
          ref={emblaRef}
        >
          <div className="embla__container flex gap-1.5 md:mr-5 md:gap-[15px]">
            {isEmpty ? (
              <div className="w-full py-8 text-center text-lg text-TextLow">
                موردي نيست
              </div>
            ) : (
              cards?.map((card) => card)
            )}
          </div>
        </div>
      </RevealEffect>
    </section>
  );
}
