"use client";
import { Button } from "@heroui/button";
import useSWR, { useSWRConfig } from "swr";
import { Spinner } from "@heroui/spinner";
import apiCRUD from "@/services/apiCRUD";
import useMyForm from "@/hooks/useMyForm";
import InputBasic from "@/components/inputs/InputBasic";
import RetryError from "@/components/datadisplay/RetryError";
import { BrandsIndex, CategoryShow, ProductShow } from "@/types/apiTypes";
import SwitchWrapper from "@/components/inputs/SwitchWrapper";
import SelectSearchCustom, {
  SelectSearchItem,
} from "@/components/inputs/SelectSearchCustom";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import TextAreaCustom from "@/components/inputs/TextAreaCustom";
import DatePickerWrapper from "@/components/inputs/DatePickerWrapper";
import Faqs from "@/app/panel/_components/Faqs";
import countries from "@/constants/countries.json";
import { cn } from "@/utils/twMerge";
import InputList from "@/components/inputs/InputList"; // Importing InputList
import ConfirmModal from "@/components/datadisplay/ConfirmModal";
import { useRouter } from "next/navigation";
import DropZone from "@/components/inputs/DropZone";
import { currency, weight } from "@/constants/staticValues";
const TextEditorCK = dynamic(() => import("@/components/inputs/TextEditorCK"), {
  ssr: false,
});

type Props = {
  onClose?: () => void;
  isEditMode?: boolean;
  isShowMode?: boolean;
  productId?: string;
  isModal?: boolean;
};

export default function FormProducts({
  onClose,
  isEditMode = false,
  isShowMode = false,
  productId,
  isModal = false,
}: Props) {
  const {
    data: prodData,
    error: prodError,
    isLoading: prodLoading,
    mutate: mutateBrand,
  } = useSWR(
    isEditMode || isShowMode ? `admin-panel/products/${productId}` : null,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
  );

  const { filters } = useFiltersContext();
  const { mutate } = useSWRConfig();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const router = useRouter();
  const prod: ProductShow = prodData?.data;
  const [selectedCateg, setSelectedCateg] = useState<CategoryShow>();

  const {
    values,
    errors,
    loading,
    handleChange,
    setValues,
    handleSubmit,
    setErrors,
    clearForm,
  } = useMyForm(
    {
      /* update doesn't do faqs/images and it is handled in a separated form  */
      name: prod?.name || undefined,
      slug: prod?.slug || undefined,
      primary_image: undefined as undefined | string,
      brand_id: prod?.brand_id || undefined,
      country_id: prod?.country_id || undefined,
      details: prod?.details || undefined,
      description: prod?.description || undefined,
      seo_title: prod?.seo_title || "",
      seo_description: prod?.seo_description || "",
      content: prod?.content || undefined,
      is_send: prod?.is_send?.toString() || "0",
      is_external_service: prod?.is_external_service?.toString() || "0",
      delivery_amount_per_product:
        prod?.delivery_amount_per_product || undefined,
      is_active: prod?.is_active?.toString() || "1",
      category_id: prod?.category_id || undefined,
      weight: prod?.weight || undefined,
      attr_ids: (() => {
        const attrs: { [key: string]: string } = {};
        prod?.attributes_value?.forEach((a) => {
          attrs[a.pivot.attribute_id] = a.pivot.value;
        });
        return attrs;
      })(),
      images: undefined as undefined | string[],
      garranty_type: prod?.garranty_type || undefined,
      garranty_day: prod?.garranty_day || undefined,
      faqs: prod?.faqs?.map((f) => ({ subject: f.subject, body: f.body })) as
        | { subject: string; body: string }[]
        | undefined,
      variations:
        prod?.variations?.map((v) => ({
          id: v.id as number | null,
          value: v.value || undefined,
          quantity: v.quantity?.toString() || undefined,
          price: v.price?.toString() || undefined,
          sale_price: v.sale_price?.toString() || undefined,
          date_sale_from: v.date_sale_from || undefined,
          date_sale_to: v.date_sale_to || undefined,
          sku: v.sku || undefined,
        })) || undefined,
      tags: prod?.tags?.map((t) => t.name) || undefined,
    },
    async (formValues) => {
      const payload =
        formValues?.slug === prod?.slug
          ? { ...formValues, slug: undefined }
          : formValues;
      const res = await apiCRUD({
        urlSuffix: `admin-panel/products${isEditMode ? `/${productId}` : ""}`,
        method: "POST",
        updateCacheByTag: isEditMode ? `product-${prod.slug}` : undefined,
        data: { ...payload, _method: isEditMode ? "put" : "post" },
      });
      if (res?.message) setErrors(res.message);
      if (res?.status === "success") {
        clearForm();
        onClose?.();
        if (isModal)
          mutate(`admin-panel/products${filters ? "?" + filters : filters}`);
        else router.push("/panel/products/lists");
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

  if (prodLoading)
    return (
      <div className="grid h-[200px] w-full place-content-center">
        <Spinner />
      </div>
    );
  if (prodError) {
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
    <>
      <form noValidate onSubmit={handleFormSubmit}>
        <div
          className={cn(
            "grid grid-cols-1 gap-4 md:grid-cols-2",
            isModal ? "" : "md:grid-cols-3",
          )}
        >
          <InputBasic
            name="name"
            label="نام"
            value={values.name || ""}
            onChange={handleChange("name")}
            errorMessage={errors.name}
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
            value={values.slug || ""}
            onChange={handleChange("slug")}
            errorMessage={errors.slug}
            isDisabled={isShowMode}
          />
          <SelectSearchCustom
            title="برند"
            requestSelectOptions={async () => {
              const categsRes = await apiCRUD({
                urlSuffix: `admin-panel/brands?per_page=all`,
              });
              if (categsRes?.status === "success") {
                return categsRes.data?.brands?.map((item: BrandsIndex) => ({
                  id: item.id,
                  title: item.name,
                }));
              }
              return [];
            }}
            isDisable={isShowMode}
            defaultValue={
              prod?.brand_id
                ? [
                    {
                      id: prod?.brand.id,
                      title: prod?.brand.name,
                    },
                  ]
                : []
            }
            onChange={(selected) =>
              handleChange("brand_id")(selected?.[0]?.id.toString())
            }
            errorMessage={errors.brand_id}
            placeholder="انتخاب"
          />
          <SelectSearchCustom
            title="کشور"
            options={countries?.countries?.map((country) => ({
              id: country.id,
              title: country.fa_name,
            }))}
            isDisable={isShowMode}
            value={
              values?.country_id
                ? [
                    {
                      id: values?.country_id,
                      title:
                        countries?.countries?.find(
                          (country) =>
                            country.id?.toString() ===
                            values.country_id?.toString(),
                        )?.fa_name || "",
                    },
                  ]
                : []
            }
            onChange={(selected) =>
              handleChange("country_id")(selected?.[0]?.id.toString())
            }
            errorMessage={errors.country_id}
            placeholder="انتخاب"
          />
          <InputBasic
            name="delivery_amount_per_product"
            label={"هزینه تحویل به ازای هر محصول" + ` ${currency}`}
            type="number"
            value={values.delivery_amount_per_product?.toString() || ""}
            onChange={handleChange("delivery_amount_per_product")}
            errorMessage={errors.delivery_amount_per_product}
            isDisabled={isShowMode}
          />
          <InputBasic
            name="weight"
            label={"وزن" + ` ${weight}`}
            type="number"
            value={values.weight?.toString()}
            onChange={handleChange("weight")}
            errorMessage={errors.weight}
            isDisabled={isShowMode}
          />
          <SelectSearchCustom
            title="نوع گارانتی"
            options={[
              { id: "repair", title: "تعمیر" },
              { id: "replace", title: "تعویض" },
              { id: "none", title: "ندارد" },
            ]}
            isDisable={isShowMode}
            defaultValue={
              prod?.garranty_type
                ? [
                    {
                      id: prod?.garranty_type,
                      title:
                        prod?.garranty_type === "repair"
                          ? "تعمیر"
                          : prod?.garranty_type === "replace"
                            ? "تعویض"
                            : "ندارد",
                    },
                  ]
                : []
            }
            onChange={(selected) =>
              handleChange("garranty_type")(selected?.[0]?.id.toString())
            }
            errorMessage={errors.garranty_type}
            placeholder="انتخاب"
          />
          <InputBasic
            name="garranty_day"
            label="روزهای گارانتی"
            type="number"
            value={values.garranty_day?.toString() || ""}
            onChange={handleChange("garranty_day")}
            errorMessage={errors.garranty_day}
            isDisabled={isShowMode}
          />
          <InputList
            name="tags"
            label="برچسب‌ها"
            value={values?.tags?.map((t) => ({
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
            title="دسته‌بندی‌ها"
            requestSelectOptions={async () => {
              const categoriesRes = await apiCRUD({
                urlSuffix: `admin-panel/categories?per_page=all&type=product`,
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
              prod?.category
                ? [
                    {
                      id: prod.category.id.toString(),
                      title: prod.category.name,
                    },
                  ]
                : []
            }
            onChange={(selected) => {
              setValues((prev) => ({
                ...prev,
                category_id: selected?.[0]?.id
                  ? parseInt(selected[0].id.toString())
                  : undefined,
                attr_ids: {},
              }));
            }}
            errorMessage={errors.category_id}
            placeholder="انتخاب"
          />
          <SelectSearchCustom
            title="ویژگی ها"
            placeholder={
              values.category_id ? "انتخاب" : "دسته بندی را انتخاب کنید"
            }
            isMultiSelect
            revalidatorValue={values.category_id}
            requestSelectOptions={async () => {
              const catShowRes = await apiCRUD({
                urlSuffix: `admin-panel/categories/${values.category_id}`,
              });
              if (catShowRes?.status === "success") {
                const attrs = (catShowRes?.data as CategoryShow)?.attributes
                  ?.map((item) => {
                    if (!item.pivot.is_variation) {
                      return {
                        id: item.id.toString(),
                        title: item.name,
                      };
                    }
                    return undefined;
                  })
                  .filter(Boolean) as SelectSearchItem[];
                setSelectedCateg(catShowRes?.data);
                return attrs;
              }
              return [];
            }}
            isDisable={isShowMode || !values?.category_id}
            value={
              Object.keys(values.attr_ids)?.length > 0
                ? Object.keys(values.attr_ids).map((id) => {
                    const attribute = selectedCateg
                      ? selectedCateg.attributes.find(
                          (att) => att.id.toString() === id.toString(),
                        )
                      : prod?.attributes_value?.find(
                          (a) =>
                            a.pivot.attribute_id.toString() === id.toString(),
                        );

                    return {
                      id,
                      title: attribute ? attribute.name : "",
                    };
                  })
                : []
            }
            onChange={(selected) =>
              setValues((prev) => {
                const newAttrIds = { ...prev.attr_ids };
                const selectedIds = selected.map((a) => a.id);
                Object.keys(newAttrIds).forEach((id) => {
                  if (!selectedIds.includes(id)) {
                    delete newAttrIds[id];
                  }
                });
                selected.forEach((a) => {
                  newAttrIds[a.id] = prev.attr_ids[a.id] || "";
                });
                return {
                  ...prev,
                  attr_ids: newAttrIds,
                };
              })
            }
            errorMessage={
              errors.attr_ids ||
              Object.keys(values.attr_ids)
                .map((id) => (errors as any)[`attr_ids.${id}`])
                .filter(Boolean)
                .join(", ")
            }
          />
          <div className="col-span-full grid grid-cols-1 gap-4 rounded-lg border-1 border-border bg-boxBg200 p-5 md:grid-cols-3">
            {Object.keys(values.attr_ids).length > 0 ? (
              Object.keys(values.attr_ids)?.map((id) => (
                <InputBasic
                  key={id}
                  name={`attr_ids_${id}`}
                  label={`مقدار ${selectedCateg?.attributes?.find((a) => a.id.toString() === id.toString())?.name || values.attr_ids?.[id]}`}
                  value={values.attr_ids[id]}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      attr_ids: {
                        ...prev.attr_ids,
                        [id]: e.target.value,
                      },
                    }))
                  }
                  errorMessage={(errors as any)[`attr_ids.${id}`]}
                  isDisabled={isShowMode}
                />
              ))
            ) : (
              <p className="col-span-full w-full text-center">
                ویژگی انتخاب نشده
              </p>
            )}
          </div>
          <div className="col-span-full border-y-1 border-dashed border-border2 py-5">
            {/* currently we have one variation_attr in the selected category */}
            <h2 className="mb-2">
              متغیر ها: ({" "}
              {selectedCateg?.variation_attr?.[0]?.name ||
                prod?.variations?.[0]?.attribute?.name}{" "}
              )
            </h2>
            {values.variations?.length ? (
              values.variations?.map((v, i) => (
                <div
                  key={i}
                  className="mb-2 rounded-[8px] border-1 border-border p-3"
                >
                  <div className="mb-5 flex flex-wrap items-center justify-between">
                    <h4 className="border-r-3 border-accent-4 pr-2 text-lg font-semibold">
                      متغیر {i + 1}
                    </h4>
                    {!isShowMode && (
                      <Button
                        type="button"
                        isIconOnly
                        size="sm"
                        onPress={() =>
                          setValues((prev) => ({
                            ...prev,
                            variations: prev.variations?.filter(
                              (_, index) => index !== i,
                            ),
                          }))
                        }
                        className="bg-destructive text-destructive-foreground"
                      >
                        <X className="w-4 text-destructive-foreground" />
                      </Button>
                    )}
                  </div>
                  <div
                    className={cn(
                      "grid grid-cols-1 gap-4 md:grid-cols-2",
                      isModal ? "" : "md:grid-cols-3",
                    )}
                  >
                    <InputBasic
                      name={`value_${i}`}
                      label="نام"
                      type="text"
                      value={values.variations?.[i]?.value}
                      onChange={(e) =>
                        setValues((prev) => {
                          const variations = [...(prev.variations || [])];
                          variations[i] = {
                            ...variations[i],
                            value: e.target.value,
                          };
                          return {
                            ...prev,
                            variations,
                          };
                        })
                      }
                      errorMessage={(errors as any)[`variations.${i}.value`]}
                      isDisabled={isShowMode}
                    />
                    <InputBasic
                      name={`value_${i}`}
                      label="sku"
                      type="text"
                      value={values.variations?.[i]?.sku}
                      onChange={(e) =>
                        setValues((prev) => {
                          const variations = [...(prev.variations || [])];
                          variations[i] = {
                            ...variations[i],
                            sku: e.target.value,
                          };
                          return {
                            ...prev,
                            variations,
                          };
                        })
                      }
                      errorMessage={(errors as any)[`variations.${i}.sku`]}
                      isDisabled={isShowMode}
                    />
                    <InputBasic
                      name={`quantity_${i}`}
                      label="تعداد"
                      type="number"
                      value={values.variations?.[i]?.quantity}
                      onChange={(e) =>
                        setValues((prev) => {
                          const variations = [...(prev.variations || [])];
                          variations[i] = {
                            ...variations[i],
                            quantity: e.target.value,
                          };
                          return {
                            ...prev,
                            variations,
                          };
                        })
                      }
                      errorMessage={(errors as any)[`variations.${i}.quantity`]}
                      isDisabled={isShowMode}
                    />
                    <InputBasic
                      name={`price_${i}`}
                      label="قیمت"
                      type="number"
                      value={values.variations?.[i]?.price}
                      onChange={(e) =>
                        setValues((prev) => {
                          const variations = [...(prev.variations || [])];
                          variations[i] = {
                            ...variations[i],
                            price: e.target.value,
                          };
                          return {
                            ...prev,
                            variations,
                          };
                        })
                      }
                      errorMessage={(errors as any)[`variations.${i}.price`]}
                      isDisabled={isShowMode}
                    />
                    <InputBasic
                      name={`sale_price_${i}`}
                      label="قیمت تخفیف خورده"
                      type="number"
                      value={values.variations?.[i]?.sale_price}
                      onChange={(e) =>
                        setValues((prev) => {
                          const variations = [...(prev.variations || [])];
                          variations[i] = {
                            ...variations[i],
                            sale_price: e.target.value,
                          };
                          return {
                            ...prev,
                            variations,
                          };
                        })
                      }
                      errorMessage={
                        (errors as any)[`variations.${i}.sale_price`]
                      }
                      isDisabled={isShowMode}
                    />
                    <DatePickerWrapper
                      name={`date_sale_from_${i}`}
                      title="شروع فروش"
                      defaultValue={
                        values.variations?.[i]?.date_sale_from ?? undefined
                      }
                      isDisabled={isShowMode}
                      onChange={(e) =>
                        setValues((prev) => {
                          const variations = [...(prev.variations || [])];
                          variations[i] = {
                            ...variations[i],
                            date_sale_from: e!,
                          };
                          return {
                            ...prev,
                            variations,
                          };
                        })
                      }
                      errorMessage={
                        (errors as any)[`variations.${i}.date_sale_from`]
                      }
                    />
                    <DatePickerWrapper
                      name={`date_sale_to_${i}`}
                      title="پایان فروش"
                      defaultValue={
                        values.variations?.[i]?.date_sale_to ?? undefined
                      }
                      onChange={(e) =>
                        setValues((prev) => {
                          const variations = [...(prev.variations || [])];
                          variations[i] = {
                            ...variations[i],
                            date_sale_to: e!,
                          };
                          return {
                            ...prev,
                            variations,
                          };
                        })
                      }
                      errorMessage={
                        (errors as any)[`variations.${i}.date_sale_to`]
                      }
                      isDisabled={isShowMode}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-5 text-center">
                <p>متغیری وجود ندارد</p>
              </div>
            )}
            {errors.variations && (
              <p className="mb-5 text-destructive-foreground">
                {errors.variations}
              </p>
            )}
            {!isShowMode && (
              <Button
                type="button"
                onPress={() =>
                  setValues((prev) => ({
                    ...prev,
                    variations: [
                      ...(prev.variations || []),
                      {
                        id: null,
                        value: "",
                        quantity: "",
                        price: "",
                        sale_price: "",
                        date_sale_from: "",
                        date_sale_to: "",
                        sku: "",
                      },
                    ],
                  }))
                }
                className="bg-accent-1 text-TextSize400 font-[500] text-accent-1-foreground"
              >
                <Plus width={16} className="text-accent-1-foreground" /> اضافه
                کردن متغیر
              </Button>
            )}
          </div>
          <div className="col-span-full flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-evenly gap-5">
              <SwitchWrapper
                label="ارسال:"
                onChange={handleChange("is_send")}
                isSelected={values.is_send}
                errorMessage={errors?.is_send}
                isDisabled={isShowMode}
              />
              <SwitchWrapper
                label="خدمات خارجی:"
                onChange={handleChange("is_external_service")}
                isSelected={values.is_external_service}
                errorMessage={errors?.is_external_service}
                isDisabled={isShowMode}
              />{" "}
              <SwitchWrapper
                label="وضعیت:"
                onChange={handleChange("is_active")}
                isSelected={values.is_active}
                errorMessage={errors?.is_active}
                isDisabled={isShowMode}
              />
            </div>
            {!isEditMode && (
              <>
                <div className="col-span-full">
                  <div>
                    {isShowMode ? (
                      <>
                        <div className="my-5 flex flex-wrap gap-2">
                          <p>عکس اصلي:</p>
                          <Image
                            src={
                              prod.primary_image
                                ? process.env.NEXT_PUBLIC_IMG_BASE +
                                  prod.primary_image
                                : "/images/imageplaceholder.png"
                            }
                            alt="category image"
                            width={82}
                            height={90}
                            className="max-h-[90px] rounded-[8px]"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <p>عکس‌ها:</p>
                          {prod?.images?.map((image, index) => (
                            <Image
                              key={index}
                              src={
                                process.env.NEXT_PUBLIC_IMG_BASE + image.image
                              }
                              alt={`image-${index}`}
                              width={82}
                              height={90}
                              className="max-h-[90px] rounded-[8px]"
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <DropZone
                          type="image"
                          isMulti={false}
                          maxSize={5}
                          title="عکس اصلي:"
                          urls={
                            values.primary_image ? [values.primary_image] : []
                          }
                          onUrlChange={(urls) => {
                            setValues((prev) => ({
                              ...prev,
                              primary_image: urls?.[0],
                            }));
                          }}
                          errorMessage={errors.primary_image}
                          maxUploads={1}
                        />
                        <DropZone
                          type="image"
                          isMulti={true}
                          maxSize={5}
                          title="عکس ها:"
                          urls={values.images || []}
                          onUrlChange={(urls) => {
                            setValues((prev) => ({
                              ...prev,
                              images: urls,
                            }));
                          }}
                          maxUploads={7}
                          errorMessage={
                            Array.from(
                              { length: 8 },
                              (_, i) => (errors as any)[`images.${i}`],
                            ) as string[]
                          }
                        />
                      </div>
                    )}
                    {errors.images && (
                      <p className="text-destructive-foreground">
                        {errors.images}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-span-full border-y-1 border-dashed border-border2 py-5">
                  <Faqs
                    withButton={true}
                    id={productId ? parseInt(productId) : undefined}
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
                    faqsList={isShowMode ? prod.faqs : undefined}
                    onSaveStatusChange={setHasUnsavedChanges}
                    type="product"
                    mode={isEditMode ? "edit" : isShowMode ? "show" : "create"}
                  />
                </div>
              </>
            )}
            <TextAreaCustom
              label="جزئیات:"
              name="details"
              isDisabled={isShowMode}
              value={values.details}
              onChange={(val) => handleChange("details")(val)}
              errorMessage={errors.details}
            />
            <TextAreaCustom
              label="توضیحات سئو"
              name="seo_description"
              isDisabled={isShowMode}
              value={values.seo_description}
              onChange={(val) => handleChange("seo_description")(val)}
              errorMessage={errors.seo_description}
            />
            <TextAreaCustom
              label="توضیحات:"
              name="description"
              isDisabled={isShowMode}
              value={values.description}
              onChange={(val) => handleChange("description")(val)}
              errorMessage={errors.description}
            />
            <TextEditorCK
              title="محتوا:"
              value={values.content || ""}
              setData={handleChange("content")}
              disabled={isShowMode}
              errorMessage={errors.content}
            />
          </div>
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
