import { Button } from "@heroui/button";
import { useState } from "react";
import FileUploader from "@/components/inputs/FileUploader";
import { CirclePlus, X } from "lucide-react";
import Image from "next/image";
import InputBasic from "@/components/inputs/InputBasic";
import useMyForm from "@/hooks/useMyForm";
import apiCRUD from "@/services/apiCRUD";
import { useSWRConfig } from "swr";
import { Setting } from "@/types/apiTypes";
import ProtectComponent from "@/components/wrappers/ProtectComponent";

export default function SiteContentTab({ setting }: { setting: Setting }) {
  const { mutate } = useSWRConfig();
  const { values, handleSubmit, setValues, errors, setFieldError, setErrors } =
    useMyForm(
      {
        logo: undefined as undefined | string,
        title: setting?.title || "",
        description: setting?.description || "",
        faqs: setting?.faqs || [],
        benefits: setting?.benefits_buy || [],
      },
      async (formData) => {
        const res = await apiCRUD({
          urlSuffix: `admin-panel/settings`,
          method: "POST",
          updateCacheByTag: "initials",
          data: {
            ...formData,
            _method: "put",
          },
        });
        if (res?.message) setErrors(res.message);
        if (res?.status === "success") {
          mutate("admin-panel/settings");
        }
      },
    );

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleAddField = (field: "faqs" | "benefits") => {
    setValues((prev) => ({
      ...prev,
      [field]: [
        ...(prev[field] || []),
        field === "faqs"
          ? { subject: "", body: "" }
          : { icon: "", title: "", description: "" },
      ],
    }));
  };

  const handleRemoveField = (field: "faqs" | "benefits", index: number) => {
    setValues((prev) => ({
      ...prev,
      [field]: (
        prev[field] as
          | { subject: string; body: string }[]
          | { icon: string; title: string; description: string }[]
      ).filter((_, i) => i !== index),
    }));
  };

  const handleFieldChange = (
    field: "faqs" | "benefits",
    index: number,
    key: string,
    value: string,
  ) => {
    setValues((prev) => {
      const updatedField = [...(prev[field] as any[])];
      updatedField[index] = { ...updatedField[index], [key]: value };
      return { ...prev, [field]: updatedField };
    });
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex gap-2">
          <FileUploader
            trigger={
              <div className="flex items-center gap-3">
                <p>لوگو:</p>
                <div className="grid h-[64px] w-[82px] place-content-center rounded-[8px] border-1">
                  <CirclePlus className="text-primary" />
                </div>
              </div>
            }
            onSuccess={(url) =>
              url && setValues((prev) => ({ ...prev, logo: url }))
            }
            onError={(val) => setFieldError("logo", val)}
            onFilePreview={(val) => setImagePreview(val)}
            fileType="image"
            errorMessage={errors.logo}
          />
          {(imagePreview || setting?.logo) && (
            <Image
              src={
                imagePreview
                  ? imagePreview
                  : setting.logo
                    ? process.env.NEXT_PUBLIC_IMG_BASE + setting.logo
                    : "/images/imageplaceholder.png"
              }
              alt="Logo preview"
              width={82}
              height={82}
              className="rounded-[8px]"
            />
          )}
        </div>
        <InputBasic
          name="title"
          label="عنوان"
          value={values.title}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, title: e.target.value }))
          }
          errorMessage={errors.title}
        />
        <InputBasic
          name="description"
          label="توضیحات"
          value={values.description}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, description: e.target.value }))
          }
          errorMessage={errors.description}
        />

        <ProtectComponent
          permission="faqsList"
          component={
            <>
              <h2 className="my-3 font-bold">سوالات متداول</h2>
              <div className="grid grid-cols-2 gap-2">
                {values.faqs &&
                  values.faqs?.length > 0 &&
                  values.faqs?.map((faq, index) => (
                    <div key={index} className="flex flex-col gap-2 pt-2">
                      <InputBasic
                        name={`faqs[${index}].subject`}
                        label={`سوال ${index + 1}`}
                        value={faq.subject}
                        onChange={(e) =>
                          handleFieldChange(
                            "faqs",
                            index,
                            "subject",
                            e.target.value,
                          )
                        }
                      />
                      <InputBasic
                        name={`faqs[${index}].body`}
                        label={`پاسخ ${index + 1}`}
                        value={faq.body}
                        onChange={(e) =>
                          handleFieldChange(
                            "faqs",
                            index,
                            "body",
                            e.target.value,
                          )
                        }
                      />
                      <ProtectComponent
                        permission="faqsDelete"
                        component={
                          <div className="flex justify-center">
                            <Button
                              type="button"
                              onClick={() => handleRemoveField("faqs", index)}
                              variant="light"
                              size="sm"
                              className="gap-1 font-[500] text-destructive-foreground hover:!bg-destructive"
                            >
                              <X className="w-4" />
                              حذف
                            </Button>
                          </div>
                        }
                      />
                    </div>
                  ))}
                <ProtectComponent
                  permission="faqsCreate"
                  component={
                    <Button
                      type="button"
                      onClick={() => handleAddField("faqs")}
                      className="mt-2"
                    >
                      افزودن سوال
                    </Button>
                  }
                />
              </div>
            </>
          }
        />

        <div>
          <h2 className="mb-3 font-bold">مزایای خرید</h2>
          {Array.isArray(values.benefits) &&
            values.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 pt-2">
                <InputBasic
                  name={`benefits[${index}].icon`}
                  label={`آیکون (svg) ${index + 1}`}
                  value={benefit.icon}
                  onChange={(e) =>
                    handleFieldChange("benefits", index, "icon", e.target.value)
                  }
                />
                <InputBasic
                  name={`benefits[${index}].title`}
                  label={`عنوان ${index + 1}`}
                  value={benefit.title}
                  onChange={(e) =>
                    handleFieldChange(
                      "benefits",
                      index,
                      "title",
                      e.target.value,
                    )
                  }
                />
                <div className="flex-1">
                  <InputBasic
                    name={`benefits[${index}].description`}
                    label={`توضیحات ${index + 1}`}
                    value={benefit.description}
                    onChange={(e) =>
                      handleFieldChange(
                        "benefits",
                        index,
                        "description",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => handleRemoveField("benefits", index)}
                  variant="light"
                  size="sm"
                  className="gap-1 font-[500] text-destructive-foreground hover:!bg-destructive"
                >
                  <X className="w-4" />
                  حذف
                </Button>
              </div>
            ))}
          <Button
            type="button"
            onClick={() => handleAddField("benefits")}
            className="mt-2"
          >
            افزودن مزیت
          </Button>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button type="submit" color="primary" className="rounded-lg px-6">
          ذخیره
        </Button>
      </div>
    </form>
  );
}
