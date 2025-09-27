"use client";
import { faqJsonLd } from "@/constants/jsonlds";
import { useGlobalData } from "@/contexts/GlobalData";
import {
  PostShowSite,
  ProductCategoryShowSite,
  ProductShowSite,
} from "@/types/apiTypes";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Minus, Plus } from "lucide-react";

export default function FaqsList({
  mode = "others",
  faqslist,
}: {
  mode?: "faqsPage" | "others";
  faqslist?:
    | PostShowSite["faqs"]
    | ProductShowSite["faqs"]
    | ProductCategoryShowSite["faqs"];
}) {
  const gd = useGlobalData();
  const faqs = mode === "faqsPage" ? gd?.initials?.setting?.faqs : faqslist;

  return (
    <section className="my-12">
      {mode === "faqsPage" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd(gd?.initials?.setting?.faqs)),
          }}
          className="editor_display"
        />
      )}
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
