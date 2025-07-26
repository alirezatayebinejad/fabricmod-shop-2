"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { PostIndex, PaginateMeta } from "@/types/apiTypes";
import TableGenerate, {
  TableGenerateData,
} from "@/components/datadisplay/TableGenerate";
import { useFiltersContext } from "@/contexts/SearchFilters";
import Edit from "@/components/svg/Edit";
import Eye from "@/components/svg/Eye";
import { Button } from "@heroui/button";
import Image from "next/image";
import SwitchWrapper from "@/components/inputs/SwitchWrapper";
import Link from "next/link";
import { dateConvert } from "@/utils/dateConvert";
import TooltipCustom from "@/components/datadisplay/TooltipCustom";
import shortenString from "@/utils/shortenString";
import StatusBadge from "@/components/datadisplay/StatusBadge";
import ConfirmModal from "@/components/datadisplay/ConfirmModal";
import { Trash2 } from "lucide-react";
import ProtectComponent from "@/components/wrappers/ProtectComponent";

export default function TablePosts() {
  const { filters, changeFilters } = useFiltersContext();
  const { data, error, isLoading, mutate } = useSWR(
    `admin-panel/posts${filters ? "?" + filters : ""}`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
    { keepPreviousData: true },
  );
  const [page, setPage] = useState(1);
  const [switchLoading, setSwitchLoading] = useState<number | undefined>();
  const [posts, setProducts] = useState<PostIndex[]>();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<PostIndex | null>(null);

  useEffect(() => {
    if (data) {
      setPage(data.data?.meta?.current_page);
      setProducts(data.data?.posts);
    }
  }, [data]);

  const meta: PaginateMeta = data?.data?.meta;
  const pages = meta?.last_page;

  const updateProdState = (updatedItem?: PostIndex) => {
    if (!updatedItem) return;
    setProducts((prevBrands) =>
      prevBrands?.map((post) =>
        post.id === updatedItem.id ? updatedItem : post,
      ),
    );
  };

  const handleSwitchChange = async (post: PostIndex) => {
    setSwitchLoading(post.id);
    const res = await apiCRUD({
      urlSuffix: `admin-panel/posts/${post.id}`,
      method: "POST",
      data: {
        title: post.title,
        is_active: post.is_active == 1 ? 0 : 1,
        _method: "put",
      },
    });
    setSwitchLoading(undefined);
    if (res?.status === "success")
      updateProdState({
        ...post,
        is_active: post.is_active == 0 ? 1 : 0,
      });
    else updateProdState({ ...post, is_active: post.is_active });
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    const res = await apiCRUD({
      urlSuffix: `admin-panel/posts/${postToDelete.id}`,
      method: "DELETE",
    });
    if (res?.status === "success") {
      setProducts((prevPosts) =>
        prevPosts?.filter((post) => post.id !== postToDelete.id),
      );
    }
    setDeleteModalOpen(false);
    setPostToDelete(null);
  };

  const tableData: TableGenerateData = {
    headers: [
      { content: "عکس" },
      { content: "موضوع" },
      { content: "ویرایش" },
      { content: "فعال" },
      { content: "وضعیت" },
      { content: <div></div> },
    ],
    body: posts?.map((post) => ({
      cells: [
        {
          data: (
            <div className="flex justify-center">
              <Image
                src={
                  post.primary_image
                    ? process.env.NEXT_PUBLIC_IMG_BASE + post.primary_image
                    : "/images/imageplaceholder.png"
                }
                alt={post.title}
                width={82}
                height={64}
                className="rounded-[8px]"
              />
            </div>
          ),
        },
        {
          data: (
            <div>
              {
                <TooltipCustom content={post.title}>
                  {shortenString(post.title, 35, "after")}
                </TooltipCustom>
              }
            </div>
          ),
        },
        { data: <p>{dateConvert(post.updated_at, "persian")}</p> },
        {
          data: (
            <SwitchWrapper
              isSelected={post.is_active}
              onChange={() => handleSwitchChange(post)}
              isLoading={switchLoading === post.id}
            />
          ),
        },
        {
          data: (
            <StatusBadge
              title={
                post.status === "approved"
                  ? "منشر شده"
                  : post.status === "draft"
                    ? "پیش نویس"
                    : "در حال انتضار"
              }
              mode={
                post.status === "approved"
                  ? "success"
                  : post.status === "draft"
                    ? "error"
                    : "pending"
              }
            />
          ),
        },
        {
          data: (
            <div className="flex min-w-[40px] justify-end gap-1">
              <Button
                isIconOnly
                size="sm"
                as={Link}
                href={`/panel/posts/show/${post.id}`}
                className="bg-boxBg300"
              >
                <Eye color="var(--TextColor)" />
              </Button>
              <ProtectComponent
                permission="postsEdit"
                component={
                  <Button
                    isIconOnly
                    size="sm"
                    as={Link}
                    href={`/panel/posts/edit/${post.id}`}
                    className="bg-boxBg300"
                  >
                    <Edit color="var(--TextColor)" />
                  </Button>
                }
              />
              <ProtectComponent
                permission="postsDelete"
                component={
                  <Button
                    isIconOnly
                    size="sm"
                    className="group bg-boxBg300 hover:bg-destructive"
                    onClick={() => {
                      setPostToDelete(post);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 text-TextLow group-hover:text-destructive-foreground" />
                  </Button>
                }
              />
            </div>
          ),
        },
      ],
    })),
  };

  return (
    <>
      <TableGenerate
        data={tableData}
        stripedRows
        pagination={{ page, total: pages }}
        onPageChange={(page) => {
          setPage(page);
          changeFilters(`page=${page}`);
        }}
        loading={isLoading ? { columns: 6, rows: 5 } : undefined}
        error={error}
        onRetry={() => mutate()}
      />
      {isDeleteModalOpen && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onOpenChange={() => setDeleteModalOpen(false)}
          confirmText="آیا مطمئن هستید که می‌خواهید این پست را حذف کنید؟"
          confirmAction={handleDeletePost}
          size="md"
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
    </>
  );
}
