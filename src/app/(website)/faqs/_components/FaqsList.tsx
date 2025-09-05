"use client";
import { faqJsonLd } from "@/constants/jsonlds";
import { useGlobalData } from "@/contexts/GlobalData";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Minus, Plus } from "lucide-react";

export default function FaqsList() {
  const globalData = useGlobalData();
  const faqs = globalData?.initials?.setting?.faqs;

  return (
    <section className="my-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
        className="editor_display"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {faqs?.map((faq, index) => (
          <Accordion key={index} variant="splitted">
            <AccordionItem
              aria-label={faq.subject}
              title={faq.subject}
              classNames={{
                base: "rounded-[5px] shadow-none border-1 border-border",
                indicator: "text-TextLow",
                title: "text-TextColor",
                content: "text-TextLow",
              }}
              indicator={({ isOpen }) =>
                isOpen ? <Minus className="rotate-90" /> : <Plus />
              }
            >
              {faq.body}
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </section>
  );
}
