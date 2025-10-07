"use client";
import CommentsForm from "@/app/(website)/blog/_components/CommentsForm";
import CommentsList from "@/app/(website)/blog/_components/CommentsList";
import RateIt from "@/app/(website)/blog/_components/RateIt";
import FaqsList from "@/app/(website)/faqs/_components/FaqsList";
import { ParseHTML } from "@/components/datadisplay/ParseHtml";
import RevealEffect from "@/components/wrappers/RevealEffect";
import { currency, weight } from "@/constants/staticValues";
import apiCRUD from "@/services/apiCRUD";
import { ProductShowSite } from "@/types/apiTypes";
import { Button } from "@heroui/button";
import { useState } from "react";
import { useSWRConfig } from "swr";

export default function ProductTabsContent({
  product,
}: {
  product: ProductShowSite;
}) {
  const [activeTab, setActiveTab] = useState("description");
  const [page, setPage] = useState(1);
  const { mutate } = useSWRConfig();
  const [loadingRate, setLoadingRate] = useState(false);
  const [submittedRate, setSubmittedRate] = useState(false);
  const handleSubmitRate = async (rate: number) => {
    setLoadingRate(true);
    const res = await fetch("/api/ip");
    const { ip } = await res.json();
    try {
      const response = await apiCRUD({
        urlSuffix: `next/products/${product?.slug}/rate`,
        method: "POST",
        data: { rate, user_ip: ip },
      });
      if (response.status === "success") {
        setSubmittedRate(true);
      }
    } catch (error) {
      console.error("Error submitting rate:", error);
    } finally {
      setLoadingRate(false);
    }
  };
  return (
    <>
      <div>
        <div className="my-8 flex flex-wrap justify-center gap-2">
          <Button
            className={`rounded-none bg-boxBg300 !text-TextSize500 text-TextColor ${activeTab === "description" ? "border-b-2 border-TextColor" : ""}`}
            onPress={() => setActiveTab("description")}
          >
            توضیحات
          </Button>
          <Button
            className={`rounded-none bg-boxBg300 !text-TextSize500 text-TextColor ${activeTab === "features" ? "border-b-2 border-TextColor" : ""}`}
            onPress={() => setActiveTab("features")}
          >
            ویژگی ها
          </Button>
          <Button
            className={`rounded-none bg-boxBg300 !text-TextSize500 text-TextColor ${activeTab === "reviews" ? "border-b-2 border-TextColor" : ""}`}
            onPress={() => setActiveTab("reviews")}
          >
            نظرات
          </Button>
          <Button
            className={`rounded-none bg-boxBg300 !text-TextSize500 text-TextColor ${activeTab === "faqs" ? "border-b-2 border-TextColor" : ""}`}
            onPress={() => setActiveTab("faqs")}
          >
            سوالات متداول
          </Button>
        </div>
        <div className="tab-content">
          {activeTab === "description" ? (
            <RevealEffect
              key={"1"}
              mode="customFadeUp"
              options={{ triggerOnce: true }}
            >
              <div className="editor_display overflow-hidden">
                <ParseHTML htmlContent={product.content} />
              </div>
            </RevealEffect>
          ) : activeTab === "features" ? (
            <RevealEffect
              key={"2"}
              mode="customFadeUp"
              options={{ triggerOnce: true }}
            >
              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                {product?.attributes_value?.map((attribute) => {
                  const variation = product?.variations?.find(
                    (v) => v.attribute_id === attribute.id,
                  );
                  return (
                    <div
                      key={attribute.id}
                      className="flex justify-between border-b border-border2 px-4 py-2"
                    >
                      <span className="font-bold">{attribute.name}:</span>
                      <span className="text-TextSize400">
                        {variation
                          ? product?.variations?.map((v) => v.value).join(", ")
                          : attribute.pivot.value}
                      </span>
                    </div>
                  );
                })}
                <div className="flex justify-between border-b border-border2 px-4 py-2">
                  <span className="font-bold">وزن:</span>
                  <span className="text-TextSize400">
                    {product.weight} {weight}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border2 px-4 py-2">
                  <span className="font-bold">ضمانت:</span>
                  <span className="text-TextSize400">
                    {product.garranty_type !== "none"
                      ? `${product.garranty_day} روز (${product.garranty_type === "repair" ? "تعمیر" : product.garranty_type === "replace" ? "تعویض" : "بدون گارانتی"})`
                      : "بدون گارانتی"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border2 px-4 py-2">
                  <span className="font-bold">قیمت:</span>
                  <span className="text-TextSize400">
                    {product.price_check
                      ? product.price_check.price.toLocaleString() +
                        " " +
                        currency
                      : "ناموجود"}{" "}
                  </span>
                </div>
              </div>
            </RevealEffect>
          ) : activeTab === "reviews" ? (
            <RevealEffect
              key={"3"}
              mode="customFadeUp"
              options={{ triggerOnce: true }}
            >
              <div>
                <CommentsForm
                  postOrProductSlug={product?.slug}
                  type="products"
                  mutate={() =>
                    mutate(
                      `next/products/${product?.slug}/comments?page=${page}`,
                    )
                  }
                />
                <CommentsList
                  showForm={false}
                  postOrProductSlug={product?.slug}
                  type="products"
                  pagination={true}
                  onPageChange={(p) => setPage(p)}
                  mutate={() =>
                    mutate(
                      `next/products/${product?.slug}/comments?page=${page}`,
                    )
                  }
                />
              </div>
            </RevealEffect>
          ) : (
            <FaqsList faqslist={product?.faqs} />
          )}
        </div>
      </div>
      <div>
        <div className="mt-10 flex flex-col items-center">
          <h3 className="my-5 font-bold">به این محصول امتیاز دهید</h3>
          <RateIt
            loading={loadingRate}
            handleSubmitRate={handleSubmitRate}
            submitedRate={submittedRate}
          />
        </div>
      </div>
    </>
  );
}
