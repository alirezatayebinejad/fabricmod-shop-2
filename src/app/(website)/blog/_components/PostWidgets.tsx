"use client";
import RateIt from "@/app/(website)/blog/_components/RateIt";
import ClickToCopy from "@/components/snippets/ClickToCopy";
import { PostShowSite } from "@/types/apiTypes";
import { Button } from "@heroui/button";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import apiCRUD from "@/services/apiCRUD";

export default function PostWidgets({ data }: { data?: PostShowSite }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittedRate, setSubmittedRate] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleSubmitRate = async (rate: number) => {
    setLoading(true);
    const res = await fetch("/api/ip");
    const { ip } = await res.json();
    try {
      const response = await apiCRUD({
        urlSuffix: `next/posts/${data?.slug}/rate`,
        method: "POST",
        data: { rate, user_ip: ip },
        updateCacheByTag: `post-${data?.slug}`,
        noCacheToast: true,
      });
      if (response.status === "success") {
        setSubmittedRate(true);
      }
    } catch (error) {
      console.error("Error submitting rate:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="my-10 border-y-2 border-dashed border-border py-5">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-5">
          <div className="flex flex-wrap items-center gap-1">
            <Button
              size="sm"
              variant="light"
              className="flex cursor-auto items-center gap-2"
              disableAnimation
            >
              <MessageSquare className="w-6 text-TextLow" />
              <p className="text-TextSize300 text-TextLow">
                نظر {data?.comments_count}
              </p>
            </Button>
            {/* <Button size="sm" variant="light" className="flex items-center gap-2">
         <Share2 className="w-6 text-TextLow" />
         <p className="text-TextSize300 text-TextLow">اشتراک گزاری</p>
       </Button> */}
          </div>
          <div>
            <div className="rounded-full border-1 border-TextColor px-2 py-1">
              <ClickToCopy text={url} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <p>برچسب ها:</p>
          {data?.tags?.map((t) => (
            <span
              key={t.slug + Math.random()}
              className="rounded-md bg-boxBg300 px-2 py-2 text-TextSize400 text-TextLow transition-colors hover:bg-boxBg400"
            >
              {t.name}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h3 className="my-5 font-bold">به این نوشته امتیاز دهید</h3>
        <RateIt
          loading={loading}
          handleSubmitRate={handleSubmitRate}
          submitedRate={submittedRate}
        />
      </div>
    </>
  );
}
