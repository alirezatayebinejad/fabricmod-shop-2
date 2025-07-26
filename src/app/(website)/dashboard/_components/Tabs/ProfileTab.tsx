import { useState } from "react";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { ProfileSite } from "@/types/apiTypes";
import Avatar from "@/components/snippets/Avatar";
import FileUploader from "@/components/inputs/FileUploader";
import InputBasic from "@/components/inputs/InputBasic";
import { Button } from "@heroui/button";
import useMyForm from "@/hooks/useMyForm";
import { Pencil } from "lucide-react";
import { Spinner } from "@heroui/spinner";
import RetryError from "@/components/datadisplay/RetryError";

export default function ProfileTab() {
  const [imagePreview, setImagePreview] = useState<string | null>("");

  const { data, error, isLoading, mutate } = useSWR(`next/profile`, (url) =>
    apiCRUD({
      urlSuffix: url,
    }),
  );

  const profile: ProfileSite = data?.data;

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
        urlSuffix: "next/profile",
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
      <div className="bg-boxBg450 w-full max-w-[700px] rounded-[32px] p-3 pb-12">
        <div className="flex flex-col items-center justify-center gap-3">
          <Avatar
            imgSrc={
              imagePreview
                ? imagePreview
                : profile?.user?.primary_image
                  ? process.env.NEXT_PUBLIC_IMG_BASE +
                    profile?.user?.primary_image
                  : null
            }
            width={108}
            height={108}
            styles={{
              icon: { width: "67", height: "68" },
            }}
          />
          <FileUploader
            trigger={
              <h3 className="text-TextSize500 font-[500]">
                انتخاب تصویر پروفایل
              </h3>
            }
            fileType="image"
            formatLimit={["image/jpeg", "image/png", "image/webp", "image/jpg"]}
            onSuccess={(val) =>
              setValues((prev) => ({ ...prev, primary_image: val }))
            }
            onError={(val) => setFieldError("primary_image", val)}
            errorMessage={errors.primary_image}
            onFilePreview={(val) => setImagePreview(val)}
          />
        </div>
        <form
          noValidate
          onSubmit={handleSubmit}
          className="m-[0_auto] mt-10 flex max-w-[550px] flex-col gap-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputBasic
              name="name"
              label="نام"
              labelPlacement="inside"
              endContent={<Pencil className="w-5 text-TextColor" />}
              classNames={{ inputWrapper: "rounded-[8px]" }}
              value={values?.name}
              onChange={handleChange("name")}
              errorMessage={errors?.name}
            />
            <InputBasic
              name="cellphone"
              type="number"
              label="شماره موبایل"
              labelPlacement="inside"
              endContent={<Pencil className="w-5 text-TextColor" />}
              classNames={{ inputWrapper: "rounded-[8px]" }}
              value={values?.cellphone}
              onChange={handleChange("cellphone")}
              errorMessage={errors?.cellphone}
            />
            <div className="md:col-span-2">
              <InputBasic
                name="email"
                type="email"
                label="ایمیل"
                labelPlacement="inside"
                endContent={<Pencil className="w-5 text-TextColor" />}
                classNames={{ inputWrapper: "rounded-[8px]" }}
                value={values?.email}
                onChange={handleChange("email")}
                errorMessage={errors?.email}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              isLoading={loading}
              className="h-[45px] rounded-[6px] bg-primary px-6 text-primary-foreground hover:bg-TextColor hover:text-TextReverse"
            >
              ذخیره اطلاعات
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
