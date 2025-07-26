"use client";
import RevealEffect from "@/components/wrappers/RevealEffect";
import { useGlobalData } from "@/contexts/GlobalData";

export default function Features() {
  const globalData = useGlobalData();
  const setting = globalData?.initials?.setting;

  return (
    <section className="flex flex-wrap justify-between gap-3 py-5">
      <RevealEffect
        mode="customFadeUp"
        options={{
          triggerOnce: true,
          fraction: 0.3,
          cascade: true,
          damping: 0.3,
        }}
      >
        {setting?.benefits_buy.map((benefit, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full border-1 border-boxBg400">
              <div
                dangerouslySetInnerHTML={{ __html: benefit.icon }}
                className="benefit_icon"
              ></div>
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-TextSize600 font-bold">{benefit.title}</h4>
              <p className="font-bold text-TextMute">{benefit.description}</p>
            </div>
          </div>
        ))}
      </RevealEffect>
    </section>
  );
}
