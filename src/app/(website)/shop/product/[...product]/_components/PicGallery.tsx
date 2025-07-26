"use client";
import React from "react";
import { useState, useEffect, useCallback } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

export default function PicGallery({
  sources,
  options,
}: {
  sources: string[];
  options?: EmblaOptionsType;
}) {
  return (
    <div>
      <EmblaCarousel slides={sources} options={options} />
    </div>
  );
}

type EmblaCarouselType = {
  slides: string[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<EmblaCarouselType> = (props) => {
  const { slides, options } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();

    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  return (
    <div className="embla mx-auto max-w-[48rem]" dir="ltr">
      <div className="embla__viewport overflow-hidden" ref={emblaMainRef}>
        <div className="embla__container flex w-full touch-pan-y touch-pinch-zoom">
          {slides?.map((src, index) => (
            <div
              className="embla__slide min-w-0 flex-[0_0_100%] translate-x-0"
              key={index}
            >
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                width={571}
                height={571}
                className="h-full w-full rounded-[5px] object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="embla-thumbs mt-[0.8rem]">
        <div
          className="embla-thumbs__viewport overflow-hidden"
          ref={emblaThumbsRef}
        >
          <div className="embla-thumbs__container flex flex-row gap-3">
            {slides?.map((slide, index) => (
              <Thumb
                key={index}
                onClick={() => onThumbClick(index)}
                selected={index === selectedIndex}
                slide={slide}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

type ThumbType = {
  selected: boolean;
  slide: string;
  onClick: () => void;
};

const Thumb: React.FC<ThumbType> = (props) => {
  const { selected, slide, onClick } = props;

  return (
    <div
      className={`embla-thumbs__slide h-[90px] w-[90px] ${selected ? "embla-thumbs__slide--selected" : ""}`}
    >
      <Image
        onClick={onClick}
        src={slide}
        alt={slide}
        width={150}
        height={150}
        className={`h-full w-full cursor-pointer rounded-[10px] object-cover ${selected ? "border-2 border-primary" : ""}`}
      />
    </div>
  );
};
