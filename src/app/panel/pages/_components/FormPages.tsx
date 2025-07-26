import { Button } from "@heroui/button";
import { useSWRConfig } from "swr";
import apiCRUD from "@/services/apiCRUD";
import useMyForm from "@/hooks/useMyForm";
import InputBasic from "@/components/inputs/InputBasic";
import { PageIndex } from "@/types/apiTypes";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";
import FileUploader from "@/components/inputs/FileUploader";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { useState } from "react";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import TextAreaCustom from "@/components/inputs/TextAreaCustom";
const TextEditorCK = dynamic(() => import("@/components/inputs/TextEditorCK"), {
  ssr: false,
});

type Props = {
  onClose: () => void;
  isEditMode?: boolean;
  isShowMode?: boolean;
  selectedData?: PageIndex;
};

export default function FormPages({
  onClose,
  isEditMode = false,
  isShowMode = false,
  selectedData,
}: Props) {
  const { filters } = useFiltersContext();
  const { mutate } = useSWRConfig();
  const [imagePreview, setImagePreview] = useState<string | null>("");

  const page: PageIndex | undefined = selectedData;

  const {
    values,
    errors,
    loading,
    handleChange,
    setFieldError,
    setValues,
    handleSubmit,
    setErrors,
  } = useMyForm(
    {
      title: page?.title,
      slug: page?.slug,
      description: page?.description,
      primary_image: undefined as undefined | string,
      body: page?.body,
      mode: page?.mode || "",
      status: page?.status || "draft",
      seo_title: page?.seo_title,
      seo_description: page?.seo_description,
      json: {
        ...(page?.mode === "about-us" && page.json
          ? {
              title: JSON.parse(page?.json)?.title || "",
              after_title: JSON.parse(page?.json)?.after_title || "",
              btn_text: JSON.parse(page?.json)?.btn_text || "",
              btn_link: JSON.parse(page?.json)?.btn_link || "",
            }
          : {}),
      } as { [key: string]: string },
    },
    async (formValues) => {
      const payload = {
        ...formValues,
        ...(formValues?.mode === selectedData?.mode ? { mode: undefined } : {}),
        json: JSON.stringify(formValues.json || ""),
      };
      const res = await apiCRUD({
        urlSuffix: `admin-panel/pages${isEditMode ? `/${selectedData?.id}` : ""}`,
        method: "POST",
        updateCacheByTag: ["contact", "about", "rules"],
        noCacheToast: true,
        data: { ...payload, _method: isEditMode ? "put" : "post" },
      });
      if (res?.message) setErrors(res.message);
      if (res?.status === "success") {
        onClose();
        mutate(`admin-panel/pages${filters ? "?" + filters : filters}`);
      }
    },
  );

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputBasic
          name="title"
          label="نام"
          value={values.title}
          onChange={handleChange("title")}
          errorMessage={errors.title}
          isDisabled={isShowMode}
        />
        <InputBasic
          name="seo_title"
          label="عنوان سئو"
          value={values.seo_title || ""}
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
          title="حالت"
          options={[
            { id: "about-us", title: "درباره ما" },
            { id: "contact-us", title: "تماس با ما" },
            { id: "regulations", title: "مقررات" },
          ]}
          isSearchDisable
          isDisable={isShowMode}
          value={
            values?.mode
              ? [
                  {
                    id: values?.mode,
                    title:
                      values?.mode === "about-us"
                        ? "درباره ما"
                        : values?.mode === "contact-us"
                          ? "تماس با ما"
                          : values?.mode === "regulations"
                            ? "مقررات"
                            : "",
                  },
                ]
              : []
          }
          onChange={(selected) =>
            setValues((prev) => ({
              ...prev,
              mode: selected?.[0]?.id.toString(),
            }))
          }
          errorMessage={errors.mode}
          placeholder="انتخاب"
        />
        <SelectSearchCustom
          title="وضعیت"
          options={[
            { id: "draft", title: "پیش نویس" },
            { id: "approved", title: "تأیید شده" },
            { id: "pending", title: "در حال بررسی" },
          ]}
          showNoOneOption={false}
          isSearchDisable
          isDisable={isShowMode}
          value={
            values?.status
              ? [
                  {
                    id: values?.status,
                    title:
                      values?.status === "draft"
                        ? "پیش نویس"
                        : values?.status === "approved"
                          ? "تأیید شده"
                          : values?.status === "pending"
                            ? "در حال بررسی"
                            : "",
                  },
                ]
              : []
          }
          onChange={(selected) =>
            setValues((prev) => ({
              ...prev,
              status: selected?.[0]?.id.toString(),
            }))
          }
          errorMessage={errors.status}
          placeholder="انتخاب"
        />
        <div className="flex flex-wrap gap-2">
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
          {(imagePreview || page?.primary_image) && (
            <Image
              src={
                imagePreview
                  ? imagePreview
                  : page?.primary_image
                    ? process.env.NEXT_PUBLIC_IMG_BASE + page?.primary_image
                    : "/images/imageplaceholder.png"
              }
              alt="category image"
              width={82}
              height={64}
              className="h-[64px] rounded-[8px]"
            />
          )}
        </div>
      </div>

      {values.mode === "about-us" && (
        <div className="my-4 grid grid-cols-1 gap-4 rounded-lg bg-boxBg200 p-3 md:grid-cols-2">
          <InputBasic
            name="about_title"
            label="تایتل"
            value={values.json.title || ""}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                json: {
                  ...prev.json,
                  title: e.target.value,
                },
              }))
            }
            errorMessage={(errors.json as any)?.after_title}
            isDisabled={isShowMode}
          />
          <InputBasic
            name="about_after_title"
            label="بعد از عنوان"
            value={values.json.after_title || ""}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                json: {
                  ...prev.json,
                  after_title: e.target.value,
                },
              }))
            }
            errorMessage={(errors.json as any)?.after_title}
            isDisabled={isShowMode}
          />
          <InputBasic
            name="btn_text"
            label="متن دکمه"
            value={values.json.btn_text || ""}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                json: {
                  ...prev.json,
                  btn_text: e.target.value,
                },
              }))
            }
            errorMessage={(errors.json as any)?.btn_text}
            isDisabled={isShowMode}
          />
          <InputBasic
            name="btn_link"
            label="لینک دکمه"
            value={values.json.btn_link || ""}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                json: {
                  ...prev.json,
                  btn_link: e.target.value,
                },
              }))
            }
            errorMessage={(errors.json as any)?.btn_link}
            isDisabled={isShowMode}
          />
        </div>
      )}
      <div className="mt-3">
        <TextAreaCustom
          name="description"
          label="توضیحات"
          value={values.description || undefined}
          onChange={handleChange("description")}
          errorMessage={errors.description}
          isDisabled={isShowMode}
        />
      </div>
      <div className="mt-3">
        <TextAreaCustom
          name="seo_description"
          label="توضیحات سئو"
          value={values.seo_description || ""}
          onChange={handleChange("seo_description")}
          errorMessage={errors.seo_description}
          isDisabled={isShowMode}
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

      <div className="mb-3 mt-3 flex justify-end gap-2">
        <Button
          type="button"
          className="rounded-[8px] border-1 border-border bg-transparent px-6 text-[14px] font-[500] text-TextColor"
          variant="light"
          onPress={onClose}
        >
          {isShowMode ? "بستن" : "لغو"}
        </Button>
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
  );
}
