import RevealEffect from "@/components/wrappers/RevealEffect";
import { Index } from "@/types/apiTypes";
import { Button } from "@heroui/button";
import Image from "next/image";
import Link from "next/link";

export default function NoticeBanner({
  data,
}: {
  data: Index["banners"]["call_to_action"][0];
}) {
  return (
    <section>
      <div className="flex justify-center gap-5 max-md:flex-col-reverse">
        <div className="flex flex-[0.5] items-center justify-center text-center max-md:flex-1">
          <div className="max-w-[440px] flex-col items-center">
            <RevealEffect
              mode="customFadeUp"
              options={{
                triggerOnce: true,
                fraction: 0.3,
                cascade: true,
                damping: 0.3,
              }}
            >
              <p className="font-[500] text-TextLow">{data.pre_title}</p>
              <h2 className="my-3 text-[36px] font-bold">{data.title}</h2>
              <p className="text-center text-TextSize300 font-[500] text-TextLow">
                {data.text}{" "}
              </p>
              {data?.url && data?.btn_text && (
                <Link prefetch={false} href={data.url}>
                  <Button
                    variant="bordered"
                    className="my-10 rounded-full border-1 border-border p-5 hover:bg-primary hover:text-primary-foreground"
                  >
                    {data.btn_text}
                  </Button>
                </Link>
              )}
            </RevealEffect>
          </div>
        </div>
        <div className="flex-[0.5] max-md:flex-1">
          <RevealEffect
            mode="fade"
            options={{
              triggerOnce: true,
              fraction: 0.3,
            }}
          >
            <Image
              src={process.env.NEXT_PUBLIC_IMG_BASE + data?.image}
              alt={data?.title || "background image"}
              width={530}
              height={740}
              className="h-auto w-full rounded-[20px]"
            />
          </RevealEffect>
        </div>
      </div>
    </section>
  );
}
