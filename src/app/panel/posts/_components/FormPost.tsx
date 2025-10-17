"use client";
import { Button } from "@heroui/button";
import useSWR, { useSWRConfig } from "swr";
import { Spinner } from "@heroui/spinner";
import apiCRUD from "@/services/apiCRUD";
import useMyForm from "@/hooks/useMyForm";
import InputBasic from "@/components/inputs/InputBasic";
import RetryError from "@/components/datadisplay/RetryError";
import { PostShow } from "@/types/apiTypes";
import SwitchWrapper from "@/components/inputs/SwitchWrapper";
import FileUploader from "@/components/inputs/FileUploader";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { useState } from "react";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Faqs from "@/app/panel/_components/Faqs";
import ConfirmModal from "@/components/datadisplay/ConfirmModal";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";
import { useRouter } from "next/navigation";
import InputList from "@/components/inputs/InputList";
import TextAreaCustom from "@/components/inputs/TextAreaCustom";

const TextEditorCK = dynamic(() => import("@/components/inputs/TextEditorCK"), {
  ssr: false,
});

type Props = {
  onClose?: () => void;
  isEditMode?: boolean;
  isShowMode?: boolean;
  isModal?: boolean;
  postId?: number;
};

export default function FormPost({
  onClose,
  isEditMode = false,
  isShowMode = false,
  isModal = false,
  postId,
}: Props) {
  const {
    data: postData,
    error: postError,
    isLoading: postLoading,
    mutate: mutatePost,
  } = useSWR(
    isEditMode || isShowMode ? `admin-panel/posts/` + postId : undefined,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
  );
  const { filters } = useFiltersContext();
  const { mutate } = useSWRConfig();
  const [imagePreview, setImagePreview] = useState<string | null>("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const post: PostShow = postData?.data;
  const router = useRouter();

  const {
    values,
    errors,
    loading,
    handleChange,
    setFieldError,
    setValues,
    handleSubmit,
    setErrors,
    clearForm,
  } = useMyForm(
    {
      title: post?.title,
      slug: post?.slug,
      description: post?.description,
      primary_image: undefined as undefined | string,
      seo_title: post?.seo_title || "",
      seo_description: post?.seo_description || "",
      body: post?.body,
      is_important: post?.is_important?.toString() || "1",
      is_active: post?.is_active?.toString() || "1",
      category_id: post?.category?.id || undefined,
      tags: post?.tags.map((t) => t.name),
      faqs: undefined as { subject: string; body: string }[] | undefined,
      status: post?.status || "draft",
    },
    async (formValues) => {
      const payload = {
        ...formValues,
        slug: formValues?.slug === post?.slug ? undefined : formValues.slug,
        faqs: isEditMode || isShowMode ? undefined : formValues.faqs,
      };
      const res = await apiCRUD({
        urlSuffix: `admin-panel/posts${isEditMode ? `/${postId}` : ""}`,
        method: "POST",
        updateCacheByTag: isEditMode ? `post-${post.slug}` : undefined,
        data: { ...payload, _method: isEditMode ? "put" : "post" },
      });
      if (res?.message) setErrors(res.message);
      if (res?.status === "success") {
        clearForm();
        onClose?.();
        if (isModal)
          mutate(`admin-panel/posts${filters ? "?" + filters : filters}`);
        else router.push("/panel/posts/postslist");
      }
    },
  );
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (hasUnsavedChanges) {
      setIsConfirmModalOpen(true);
    } else {
      handleSubmit();
    }
  };

  const handleConfirmSubmit = () => {
    setIsConfirmModalOpen(false);
    handleSubmit();
  };

  if (postLoading)
    return (
      <div className="grid h-[200px] w-full place-content-center">
        <Spinner />
      </div>
    );
  if (postError) {
    return (
      <div className="h-[250px]">
        <RetryError
          onRetry={() => {
            mutatePost();
          }}
        />
      </div>
    );
  }
  return (
    <>
      <form noValidate onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputBasic
            name="title"
            label="عنوان"
            value={values.title}
            onChange={handleChange("title")}
            errorMessage={errors.title}
            isDisabled={isShowMode}
          />
          <InputBasic
            name="seo_title"
            label="عنوان سئو"
            value={values.seo_title}
            onChange={handleChange("seo_title")}
            errorMessage={errors.seo_title}
            isDisabled={isShowMode}
          />
          <InputBasic
            name="slug"
            label="اسلاگ"
            value={values.slug}
            onChange={handleChange("slug")}
            errorMessage={errors.slug}
            isDisabled={isShowMode}
          />

          <SelectSearchCustom
            title="دسته‌بندی‌ها"
            requestSelectOptions={async () => {
              const categoriesRes = await apiCRUD({
                urlSuffix: `admin-panel/categories?per_page=all&type=post`,
              });
              if (categoriesRes?.status === "success") {
                return categoriesRes.data?.categories?.map((item: any) => ({
                  id: item.id,
                  title: item.name,
                }));
              }
              return [];
            }}
            isDisable={isShowMode}
            defaultValue={
              post?.category
                ? [
                    {
                      id: post.category.id.toString(),
                      title: post.category.name,
                    },
                  ]
                : []
            }
            onChange={(selected) =>
              setValues((prev) => ({
                ...prev,
                category_id: selected?.[0]?.id
                  ? parseInt(selected[0].id.toString())
                  : undefined,
              }))
            }
            errorMessage={errors.category_id}
            placeholder="انتخاب"
          />
          <InputList
            name="tags"
            label="برچسب‌ها"
            value={values.tags?.map((t) => ({
              id: t,
              name: t,
            }))}
            onChange={(newTags) =>
              setValues((prev) => ({
                ...prev,
                tags: newTags.map((nt) => nt.name),
              }))
            }
            errorMessage={errors.tags}
            isDisabled={isShowMode}
          />

          <SelectSearchCustom
            title="وضعیت پست"
            options={[
              { id: "approved", title: "تایید شده" },
              { id: "draft", title: "پیش نویس" },
              { id: "pending", title: "در انتظار" },
            ]}
            value={[
              {
                id: values.status,
                title:
                  values.status === "approved"
                    ? "تایید شده"
                    : values.status === "draft"
                      ? "پیش نویس"
                      : "در انتظار",
              },
            ]}
            onChange={(selected) =>
              setValues((prev) => ({
                ...prev,
                status: selected?.[0]?.id?.toString() || "draft",
              }))
            }
            errorMessage={errors.status}
            isDisable={isShowMode}
            placeholder="انتخاب وضعیت"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <FileUploader
              trigger={
                <div className="flex items-center gap-3">
                  <p>عکس:</p>
                  <div className="grid h-[64px] w-[82px] place-content-center rounded-[8px] border-1">
                    <CirclePlus className="text-primary" />
                  </div>
                </div>
              }
              isDisabled={isShowMode}
              onSuccess={(url) =>
                url && setValues((prev) => ({ ...prev, primary_image: url }))
              }
              onError={(val) => setFieldError("primary_image", val)}
              onFilePreview={(val) => setImagePreview(val)}
              fileType="image"
              errorMessage={errors.primary_image}
            />
            {(imagePreview || post?.primary_image) && (
              <Image
                src={
                  imagePreview
                    ? imagePreview
                    : post.primary_image
                      ? process.env.NEXT_PUBLIC_IMG_BASE + post.primary_image
                      : "/images/imageplaceholder.png"
                }
                alt="category image"
                width={82}
                height={64}
                className="max-h-[64px] rounded-[8px]"
              />
            )}
          </div>
          <SwitchWrapper
            label="وضعیت:"
            onChange={handleChange("is_active")}
            isSelected={values.is_active}
            errorMessage={errors?.is_active}
            isDisabled={isShowMode}
          />
          <SwitchWrapper
            label="مهم:"
            onChange={handleChange("is_important")}
            isSelected={values.is_important}
            errorMessage={errors?.is_important}
            isDisabled={isShowMode}
          />
        </div>
        <div className="mt-5">
          <TextAreaCustom
            label="توضیحات سئو"
            name="seo_description"
            isDisabled={isShowMode}
            value={values.seo_description}
            onChange={handleChange("seo_description")}
            errorMessage={errors.seo_description}
          />
        </div>
        <div className="mt-5">
          <TextAreaCustom
            label="توضیحات:"
            name="description"
            isDisabled={isShowMode}
            value={values.description}
            onChange={handleChange("description")}
            errorMessage={errors.description}
          />
        </div>
        <div className="mt-3">
          <TextEditorCK
            title="محتوا:"
            value={values.body || ""}
            disabled={isShowMode}
            setData={handleChange("body")}
            errorMessage={errors.body}
          />
        </div>
        <div className="mt-3">
          <Faqs
            withButton={true}
            id={postId}
            onFaqsChange={(faqs) => {
              if (!isEditMode && !isShowMode)
                setValues((prev) => ({
                  ...prev,
                  faqs: faqs?.map((f) => ({
                    subject: f.subject,
                    body: f.body,
                  })),
                }));
            }}
            onSaveStatusChange={setHasUnsavedChanges}
            type="post"
            mode={isEditMode ? "edit" : isShowMode ? "show" : "create"}
          />
        </div>
        <div className="mb-3 mt-3 flex justify-end gap-2">
          {isModal && (
            <Button
              type="button"
              className="rounded-[8px] border-1 border-border bg-transparent px-6 text-[14px] font-[500] text-TextColor"
              variant="light"
              onPress={onClose}
            >
              {isShowMode ? "بستن" : "لغو"}
            </Button>
          )}
          {!isShowMode && (
            <Button
              type="submit"
              isLoading={loading}
              color="primary"
              className="rounded-[8px] px-10 text-[14px] font-[500] text-primary-foreground"
            >
              ذخیره
            </Button>
          )}
        </div>
      </form>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onOpenChange={() => setIsConfirmModalOpen(false)}
        confirmText="تغییراتی در سوالات متداول ذخیره نکردید. نادیده گرفته شود؟"
        confirmAction={handleConfirmSubmit}
        size="sm"
        onClose={() => setIsConfirmModalOpen(false)}
      />
    </>
  );
}
