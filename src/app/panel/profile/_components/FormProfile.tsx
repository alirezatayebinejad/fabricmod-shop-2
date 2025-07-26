"use client";
import { useState } from "react";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { Profile } from "@/types/apiTypes";
import Avatar from "@/components/snippets/Avatar";
import FileUploader from "@/components/inputs/FileUploader";
import InputBasic from "@/components/inputs/InputBasic";
import { Button } from "@heroui/button";
import useMyForm from "@/hooks/useMyForm";
import { Pencil } from "lucide-react";
import { Spinner } from "@heroui/spinner";
import RetryError from "@/components/datadisplay/RetryError";
import { dateConvert } from "@/utils/dateConvert";
import Edit from "@/components/svg/Edit";

export default function FormProfile() {
  const [imagePreview, setImagePreview] = useState<string | null>("");

  const { data, error, isLoading, mutate } = useSWR(
    `admin-panel/profile`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
  );

  const profile: Profile = data?.data;

  const {
    values,
    errors,
    loading,
    handleChange,
    handleSubmit,
    setErrors,
    setValues,
    setFieldError,
  } = useMyForm(
    {
      name: profile?.user?.name || "",
      cellphone: profile?.user?.cellphone || "",
      email: profile?.user?.email || "",
      primary_image: undefined as string | undefined,
    },
    async (formdata) => {
      const res = await apiCRUD({
        urlSuffix: "admin-panel/profile",
        method: "POST",
        data: { ...formdata, _method: "put" },
      });
      if (res?.message) setErrors(res.message);
    },
  );

  if (isLoading)
    return (
      <div className="grid h-[300px] place-self-center">
        <Spinner color="primary" />
      </div>
    );
  if (error) {
    return (
      <div className="h-[250px]">
        <RetryError onRetry={() => mutate()} />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center">
      <div className="bg-boxBg450 w-full max-w-[944px] rounded-[32px] p-3 pb-12">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="mx-auto max-w-[944px] px-[20px]"
        >
          <div className="mt-[-80px] flex flex-col items-center justify-center">
            <div>
              <Avatar
                imgSrc={
                  imagePreview
                    ? imagePreview
                    : profile?.user?.primary_image
                      ? process.env.NEXT_PUBLIC_IMG_BASE +
                        profile?.user?.primary_image
                      : null
                }
                width={120}
                height={120}
              />
            </div>
            <div className="w-[140px]">
              <FileUploader
                trigger={
                  <div className="relative z-20 mx-auto mt-[-25px] h-[40px] w-[40px] cursor-pointer rounded-full border-[4px] border-boxBg100 bg-primary p-[6px]">
                    <Edit
                      width="22"
                      height="22"
                      color="var(--primary-foreground)"
                    />
                  </div>
                }
                fileType="image"
                onSuccess={(val) =>
                  setValues((prev) => ({ ...prev, primary_image: val }))
                }
                onError={(val) => setFieldError("primary_image", val)}
                onFilePreview={(val) => setImagePreview(val)}
                errorMessage={errors.primary_image}
              />
            </div>
          </div>
          <div className="m-[0_auto] mt-10 flex max-w-[550px] flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputBasic
                name="name"
                label="نام"
                placeholder=" "
                endContent={<Pencil className="w-5 text-TextColor" />}
                value={values?.name}
                onChange={handleChange("name")}
                errorMessage={errors?.name}
              />
              <InputBasic
                name="email"
                label="ایمیل"
                placeholder=" "
                endContent={<Pencil className="w-5 text-TextColor" />}
                value={values?.email}
                onChange={handleChange("email")}
                errorMessage={errors?.email}
              />
              <InputBasic
                name="cellphone"
                type="number"
                label="شماره تلفن"
                placeholder=" "
                endContent={<Pencil className="w-5 text-TextColor" />}
                value={values?.cellphone}
                onChange={handleChange("cellphone")}
                errorMessage={errors?.cellphone}
              />
              <InputBasic
                name=""
                type="text"
                label="تاریخ ایجاد"
                placeholder=" "
                isDisabled
                value={dateConvert(profile?.user.created_at, "persian")}
              />
              <InputBasic
                name=""
                type="text"
                label="نقش ها"
                placeholder=" "
                isDisabled
                value={profile?.user?.roles
                  ?.map((r) => r.display_name)
                  .join(", ")}
              />
              <InputBasic
                name=""
                type="text"
                label="دپارتمان"
                placeholder=" "
                isDisabled
                value={Object.keys(profile?.departments || {}).join(", ")}
              />
            </div>
          </div>
          <div className="mt-[48px] text-center">
            <Button
              type="submit"
              isLoading={loading}
              color="primary"
              className="w-full rounded-lg py-[25px] text-primary-foreground md:w-[360px]"
            >
              ذخیره تغییرات
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
