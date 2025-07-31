import { Button } from "@heroui/button";
import useSWR, { useSWRConfig } from "swr";
import { Spinner } from "@heroui/spinner";
import apiCRUD from "@/services/apiCRUD";
import useMyForm from "@/hooks/useMyForm";
import InputBasic from "@/components/inputs/InputBasic";
import RetryError from "@/components/datadisplay/RetryError";
import { Attributes, CategoryIndex, CategoryShow } from "@/types/apiTypes";
import SwitchWrapper from "@/components/inputs/SwitchWrapper";
import SelectSearchCustom, {
  SelectSearchItem,
} from "@/components/inputs/SelectSearchCustom";
import FileUploader from "@/components/inputs/FileUploader";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { useState } from "react";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import TextAreaCustom from "@/components/inputs/TextAreaCustom";
import Faqs from "@/app/panel/_components/Faqs";
import ConfirmModal from "@/components/datadisplay/ConfirmModal";
const TextEditorCK = dynamic(() => import("@/components/inputs/TextEditorCK"), {
  ssr: false,
});

type Props = {
  onClose: () => void;
  isEditMode?: boolean;
  isShowMode?: boolean;
  selectedData?: CategoryIndex;
};

export default function FormCategories({
  onClose,
  isEditMode = false,
  isShowMode = false,
  selectedData,
}: Props) {
  const {
    data: brandData,
    error: brandError,
    isLoading: brandLoading,
    mutate: mutateBrand,
  } = useSWR(
    isEditMode || isShowMode
      ? `admin-panel/categories/` + selectedData?.id
      : undefined,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
  );
  const { filters } = useFiltersContext();
  const { mutate } = useSWRConfig();
  const [imagePreview, setImagePreview] = useState<string | null>("");
  const [selectedAttrs, setSelectedAttrs] = useState<SelectSearchItem[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const categ: CategoryShow = brandData?.data;

  const {
    values,
    errors,
    loading,
    handleChange,
    setValues,
    handleSubmit,
    setErrors,
    setFieldError,
  } = useMyForm(
    {
      name: categ?.name || undefined,
      slug: categ?.slug || undefined,
      parent_id: categ?.parent_id || undefined,
      is_active: categ?.is_active?.toString() || "1",
      primary_image: undefined as undefined | string,
      content: categ?.content || undefined,
      description: categ?.description || undefined,
      seo_title: categ?.seo_title || undefined,
      seo_description: categ?.seo_description || undefined,
      is_important: categ?.is_important?.toString() || "0",
      priority: categ?.priority?.toString() || undefined,
      icon: categ?.icon || undefined,
      attrs: categ?.attributes?.map((a) => a.id) || undefined,
      filter_attrs: categ?.filter_attrs?.map((f) => f?.id?.toString()),
      variation_attr: categ?.variation_attr?.[0]?.id?.toString() || undefined,
      type: categ?.type || "product", //no editmode
      faqs: undefined as { subject: string; body: string }[] | undefined,
      is_set: categ?.is_set?.toString() as "0" | "1",
    },
    async (formValues) => {
      const payload = {
        ...formValues,
        slug:
          formValues?.slug === categ?.slug || !formValues?.slug
            ? undefined
            : formValues.slug,
        faqs: isEditMode || isShowMode ? undefined : formValues.faqs,
        icon: formValues?.icon ? formValues?.icon : undefined,
        priority: formValues?.priority ? formValues?.priority : undefined,
        description: formValues?.description
          ? formValues?.description
          : undefined,
      };
      const res = await apiCRUD({
        urlSuffix: `admin-panel/categories${isEditMode ? `/${selectedData?.id}` : ""}`,
        method: "POST",
        updateCacheByTag: ["initials", "index"],
        noCacheToast: true,
        data: { ...payload, _method: isEditMode ? "put" : "post" },
      });
      if (res?.message) setErrors(res.message);
      if (res?.status === "success") {
        onClose();
        mutate(`admin-panel/categories${filters ? "?" + filters : filters}`);
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

  if (brandLoading)
    return (
      <div className="grid h-[200px] w-full place-content-center">
        <Spinner />
      </div>
    );
  if (brandError) {
    return (
      <div className="h-[250px]">
        <RetryError
          onRetry={() => {
            mutateBrand();
          }}
        />
      </div>
    );
  }
  return (
    <form noValidate onSubmit={handleFormSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputBasic
          name="name"
          label="نام"
          value={values.name}
          onChange={handleChange("name")}
          errorMessage={errors.name}
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
        <InputBasic
          name="seo_title"
          label="عنوان سئو"
          value={values.seo_title}
          onChange={handleChange("seo_title")}
          errorMessage={errors.seo_title}
          isDisabled={isShowMode}
        />

        {!isEditMode && (
          <SelectSearchCustom
            title="نوع"
            options={[
              { id: "product", title: "محصول" },
              { id: "post", title: "پست" },
            ]}
            onChange={(selected) =>
              handleChange("type")(selected?.[0]?.id?.toString())
            }
            defaultValue={
              categ?.type
                ? [
                    {
                      id: categ.type,
                      title: categ.type === "product" ? "محصول" : "پست",
                    },
                  ]
                : []
            }
            errorMessage={errors.type}
            placeholder="نوع"
            isDisable={isShowMode}
          />
        )}
        <SelectSearchCustom
          title="والد"
          requestSelectOptions={async () => {
            const rolesRes = await apiCRUD({
              urlSuffix: `admin-panel/categories?per_page=all&is_parent=1&type=${values.type}`,
            });
            if (rolesRes?.status === "success") {
              return rolesRes.data?.categories?.map((item: CategoryIndex) => ({
                id: item.id,
                title: item.name,
              }));
            }
            return [];
          }}
          defaultValue={
            categ?.parent?.id
              ? [
                  {
                    id: categ?.parent?.id,
                    title: categ?.parent?.name,
                  },
                ]
              : []
          }
          onChange={(selected) =>
            setValues((prev) => ({
              ...prev,
              parent_id: selected?.[0]?.id?.toString() || "0",
            }))
          }
          isDisable={isShowMode}
          errorMessage={errors.parent_id}
          placeholder="انتخاب"
        />

        <SelectSearchCustom
          title="ویژگی ها"
          isMultiSelect
          requestSelectOptions={async () => {
            const attrsRes = await apiCRUD({
              urlSuffix: `admin-panel/attributes?per_page=all`,
            });
            if (attrsRes?.status === "success") {
              return attrsRes.data?.attributes?.map((item: Attributes) => ({
                id: item.id,
                title: item.name,
              }));
            }
            return [];
          }}
          isDisable={isShowMode}
          defaultValue={
            categ?.attributes
              ? categ.attributes?.map((m) => ({ id: m.id, title: m.name }))
              : undefined
          }
          onChange={(vals) => {
            setValues((prev) => ({
              ...prev,
              attrs: vals?.map((m) => parseInt(m.id?.toString())),
            }));
            setSelectedAttrs(vals);
          }}
          errorMessage={
            errors.attrs ||
            values.attrs
              ?.map((_: any, i: number) => (errors as any)[`attrs.${i}`])
              .filter(Boolean)
              .join(", ")
          }
          placeholder="انتخاب"
        />
        <SelectSearchCustom
          title="ویژگی های قابل فیلتر"
          isMultiSelect
          options={
            selectedAttrs.length > 0
              ? selectedAttrs
              : categ?.attributes?.map((a) => ({ id: a.id, title: a.name }))
          }
          isDisable={isShowMode}
          defaultValue={
            categ?.filter_attrs
              ? categ.filter_attrs?.map((m) => ({ id: m.id, title: m.name }))
              : undefined
          }
          onChange={(vals) =>
            setValues((prev) => ({
              ...prev,
              filter_attrs: vals?.map((m) => m.id?.toString()),
            }))
          }
          errorMessage={
            errors.filter_attrs ||
            values.filter_attrs
              ?.map((_: any, i: number) => (errors as any)[`filter_attrs.${i}`])
              .filter(Boolean)
              .join(", ")
          }
          placeholder="انتخاب"
        />
        <SelectSearchCustom
          title="ویژگی متغیر"
          options={
            selectedAttrs.length > 0
              ? selectedAttrs
              : categ?.attributes?.map((a) => ({ id: a.id, title: a.name }))
          }
          isDisable={isShowMode}
          defaultValue={
            categ?.variation_attr
              ? [
                  {
                    id: categ.variation_attr?.[0]?.id,
                    title: categ.variation_attr?.[0]?.name,
                  },
                ]
              : undefined
          }
          onChange={(vals) =>
            setValues((prev) => ({
              ...prev,
              variation_attr: vals?.[0]?.id.toString(),
            }))
          }
          errorMessage={errors.variation_attr}
          placeholder="انتخاب"
        />

        <InputBasic
          name="priority"
          label="اولویت"
          type="number"
          value={values.priority}
          onChange={handleChange("priority")}
          errorMessage={errors.priority}
          isDisabled={isShowMode}
        />
        <InputBasic
          name="icon"
          label="آیکون"
          value={values.icon}
          onChange={handleChange("icon")}
          errorMessage={errors.icon}
          isDisabled={isShowMode}
        />
        <SwitchWrapper
          label="ست:"
          onChange={handleChange("is_set")}
          isSelected={values.is_set}
          errorMessage={errors?.is_set}
          isDisabled={isShowMode}
        />
        <SwitchWrapper
          label="مهم:"
          onChange={handleChange("is_important")}
          isSelected={values.is_important}
          errorMessage={errors?.is_important}
          isDisabled={isShowMode}
        />
        <SwitchWrapper
          label="وضعیت:"
          onChange={handleChange("is_active")}
          isSelected={values.is_active}
          errorMessage={errors?.is_active}
          isDisabled={isShowMode}
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
          {(imagePreview || categ?.primary_image) && (
            <Image
              src={
                imagePreview
                  ? imagePreview
                  : categ.primary_image
                    ? process.env.NEXT_PUBLIC_IMG_BASE + categ.primary_image
                    : "/images/imageplaceholder.png"
              }
              alt="category image"
              width={82}
              height={64}
              className="max-h-[64px] rounded-[8px]"
            />
          )}
        </div>
      </div>
      <div className="mt-3">
        <TextAreaCustom
          label="توضیحات سئو"
          name="seo_description"
          isDisabled={isShowMode}
          value={values.seo_description}
          onChange={(val) => handleChange("seo_description")(val)}
          errorMessage={errors.seo_description}
        />
      </div>
      <div className="mt-3">
        <TextAreaCustom
          label="توضیحات:"
          name="description"
          isDisabled={isShowMode}
          value={values.description}
          onChange={(val) => handleChange("description")(val)}
          errorMessage={errors.description}
        />
      </div>
      <div className="mt-3">
        <TextEditorCK
          title="محتوا:"
          value={values.content || ""}
          disabled={isShowMode}
          setData={handleChange("content")}
          errorMessage={errors.content}
        />
      </div>
      <div className="mt-3">
        <Faqs
          withButton={true}
          id={categ?.id}
          onFaqsChange={(faqs) => {
            if (!isEditMode && !isShowMode)
              setValues((prev) => ({
                ...prev,
                faqs: faqs?.map((f) => ({ subject: f.subject, body: f.body })),
              }));
          }}
          onSaveStatusChange={setHasUnsavedChanges}
          type="category"
          mode={isEditMode ? "edit" : isShowMode ? "show" : "create"}
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
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onOpenChange={() => setIsConfirmModalOpen(false)}
        confirmText="تغییراتی درسوالات متداول ذخیره نکردید. نادیده گرفته شود؟"
        confirmAction={handleConfirmSubmit}
        size="sm"
        onClose={() => setIsConfirmModalOpen(false)}
      />
    </form>
  );
}
