"use client";
import { useState } from "react";
import { Button } from "@heroui/button";
import ConfirmModal from "@/components/datadisplay/ConfirmModal";
import { cacheUpdator } from "@/utils/cacheUpdator";

export default function CachesControllTab() {
  const [loading, setLoading] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleRevalidate = async (tag: string) => {
    setLoading(tag);
    await cacheUpdator(tag);
    setLoading(null);
  };

  const openConfirmModal = (tag: string) => {
    setSelectedTag(tag);
    setIsModalOpen(true);
  };

  const confirmRevalidate = () => {
    if (selectedTag) {
      handleRevalidate(selectedTag);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 md:p-4">
      <h2 className="text-lg font-bold">کنترل حافظه پنهان</h2>
      <Button
        onClick={() => openConfirmModal("all")}
        color="primary"
        disabled={loading === "all"}
        isLoading={loading === "all"}
      >
        حذف همه حافظه پنهان‌ها
      </Button>
      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <Button
          onClick={() => openConfirmModal("initials")}
          color="secondary"
          disabled={loading === "initials"}
          isLoading={loading === "initials"}
        >
          {"حذف حافظه پنهان اطلاعات اولیه"}
        </Button>
        <Button
          onClick={() => openConfirmModal("theme")}
          color="secondary"
          disabled={loading === "theme"}
          isLoading={loading === "theme"}
        >
          {"حذف حافظه پنهان تم"}
        </Button>
        <Button
          onClick={() => openConfirmModal("index")}
          color="secondary"
          disabled={loading === "index"}
          isLoading={loading === "index"}
        >
          {"حذف حافظه پنهان صفحه خانه"}
        </Button>
        <Button
          onClick={() => openConfirmModal("about")}
          color="secondary"
          disabled={loading === "about"}
          isLoading={loading === "about"}
        >
          {"حذف حافظه پنهان درباره ما"}
        </Button>
        <Button
          onClick={() => openConfirmModal("contact")}
          color="secondary"
          disabled={loading === "contact"}
          isLoading={loading === "contact"}
        >
          {"حذف حافظه پنهان تماس با ما"}
        </Button>
        <Button
          onClick={() => openConfirmModal("rules")}
          color="secondary"
          disabled={loading === "rules"}
          isLoading={loading === "rules"}
        >
          {"حذف حافظه پنهان قوانین ما"}
        </Button>
        <Button
          onClick={() => openConfirmModal("allPosts")}
          color="secondary"
          disabled={loading === "allPosts"}
          isLoading={loading === "allPosts"}
        >
          {"حذف حافظه پنهان همه پست ها"}
        </Button>
        <Button
          onClick={() => openConfirmModal("allProducts")}
          color="secondary"
          disabled={loading === "allProducts"}
          isLoading={loading === "allProducts"}
        >
          {"حذف حافظه پنهان همه محصولات"}
        </Button>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onOpenChange={() => setIsModalOpen(false)}
        confirmText="آیا مطمئن هستید که می‌خواهید این حافظه پنهان را حذف کنید؟"
        confirmAction={confirmRevalidate}
        size="md"
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
