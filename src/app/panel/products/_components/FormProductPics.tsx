import RetryError from "@/components/datadisplay/RetryError";
import apiCRUD from "@/services/apiCRUD";
import { useState } from "react";
import useSWR from "swr";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import Image from "next/image";
import { ProductImages } from "@/types/apiTypes";
import useMyForm from "@/hooks/useMyForm";
import DropZone from "@/components/inputs/DropZone";
import ConfirmModal from "@/components/datadisplay/ConfirmModal";
import { X } from "lucide-react";
import { cacheUpdator } from "@/utils/cacheUpdator";

type Props = {
  onClose?: () => void;
  productId?: string;
  productSlug?: string;
  isModal: boolean;
};

export default function FormProductPics({
  onClose,
  productId,
  productSlug,
  isModal = true,
}: Props) {
  const {
    data: prodData,
    error: prodError,
    isLoading: prodLoading,
    mutate: mutateProd,
  } = useSWR(`admin-panel/product/${productId}/images`, (url) =>
    apiCRUD({
      urlSuffix: url,
    }),
  );
  const prodImages: ProductImages = prodData?.data;
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<
    ProductImages["images"][number] | undefined
  >();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const { values, errors, handleSubmit, loading, setValues, setErrors } =
    useMyForm(
      {
        primary_image: undefined as undefined | string,
        back_image: undefined as undefined | string,
        images: undefined as undefined | string[],
      },
      async (formValues) => {
        const requests = [];
        let mutateneeded = false;
        if (formValues.primary_image || formValues.back_image) {
          requests.push(
            apiCRUD({
              urlSuffix: `admin-panel/products/${`${productId}`}`,
              method: "POST",
              data: {
                back_image: formValues.back_image || undefined,
                primary_image: formValues.primary_image || undefined,
                _method: "put",
              },
            }).then((res) => {
              if (res?.status === "success") {
                setValues((prev) => ({
                  ...prev,
                  primary_image: undefined,
                  back_image: undefined,
                }));
                mutateneeded = true;
              } else setErrors((prev) => ({ ...prev, images: res.message }));
            }),
          );
        }

        if (formValues.images) {
          requests.push(
            apiCRUD({
              urlSuffix: `admin-panel/product/${`${productId}`}/images`,
              method: "POST",
              data: { images: formValues.images },
            }).then((res) => {
              if (res?.status === "success") {
                setValues((prev) => ({ ...prev, images: undefined }));
                mutateneeded = true;
              } else setErrors((prev) => ({ ...prev, images: res.message }));
            }),
          );
        }

        await Promise.all(requests);

        cacheUpdator(`product-${productSlug}`);

        if (mutateneeded) {
          mutateProd();
        }
      },
    );

  const handleDeleteImage = async () => {
    if (imageToDelete) {
      setDeleteLoading(imageToDelete?.id.toString());
      const res = await apiCRUD({
        urlSuffix: `admin-panel/product/${productId}/images`,
        method: "POST",
        updateCacheByTag: `product-${prodData.slug}`,
        data: {
          image_id: imageToDelete.id,
          _method: "delete",
        },
      });
      setDeleteLoading(null);
      if (res?.status === "success") {
        mutateProd();
        setImageToDelete(undefined);
        setConfirmModalOpen(false);
      } else {
        setErrors(res?.message);
      }
    }
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
            mutateProd();
          }}
        />
      </div>
    );
  }
  return (
    <div>
      <form noValidate onSubmit={handleSubmit}>
        <div>
          <>
            <div className="my-5 flex flex-wrap gap-2">
              <p>عکس اصلي:</p>
              <Image
                src={
                  prodImages.primary_image
                    ? process.env.NEXT_PUBLIC_IMG_BASE +
                      prodImages.primary_image
                    : "/images/imageplaceholder.png"
                }
                alt="category image"
                width={82}
                height={90}
                className="max-h-[90px] rounded-[8px]"
              />
            </div>
            <div className="my-5 flex flex-wrap gap-2">
              <p>عکس پشت:</p>
              <Image
                src={
                  prodImages.back_image
                    ? process.env.NEXT_PUBLIC_IMG_BASE + prodImages.back_image
                    : "/images/imageplaceholder.png"
                }
                alt="back image"
                width={82}
                height={90}
                className="max-h-[90px] rounded-[8px]"
              />
            </div>
            <div className="flex flex-wrap gap-6">
              <p>عکس‌ها:</p>
              {prodImages?.images?.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={process.env.NEXT_PUBLIC_IMG_BASE + image.image}
                    alt={`image-${index}`}
                    width={82}
                    height={90}
                    className="max-h-[90px] rounded-[8px]"
                  />
                  <Button
                    type="button"
                    isIconOnly
                    size="sm"
                    isLoading={
                      deleteLoading?.toString() === image.id.toString()
                    }
                    variant="bordered"
                    onPress={() => {
                      setImageToDelete(image);
                      setConfirmModalOpen(true);
                    }}
                    className="absolute -left-5 -top-5 rounded-full border-1 p-1"
                  >
                    <X className="w-5 text-TextColor" />
                  </Button>
                </div>
              ))}
            </div>
          </>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DropZone
            type="image"
            isMulti={false}
            maxSize={5}
            title="عکس اصلي:"
            urls={values.primary_image ? [values.primary_image] : []}
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
            isMulti={false}
            maxSize={5}
            title="عکس پشت:"
            urls={values.back_image ? [values.back_image] : []}
            onUrlChange={(urls) => {
              setValues((prev) => ({
                ...prev,
                back_image: urls?.[0],
              }));
            }}
            errorMessage={errors.back_image}
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
          {(errors as any)?.image_id && (
            <p className="text-destructive-foreground">
              {(errors as any).image_id}
            </p>
          )}
        </div>
        <div className="mb-3 mt-3 flex justify-end gap-2">
          {isModal && (
            <Button
              type="button"
              className="rounded-[8px] border-1 border-border bg-transparent px-6 text-[14px] font-[500] text-TextColor"
              variant="light"
              onPress={onClose}
            >
              بستن
            </Button>
          )}
          {(values.primary_image ||
            values.back_image ||
            (values.images && values.images.length > 0)) && (
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
        isOpen={confirmModalOpen}
        onOpenChange={() => setConfirmModalOpen(false)}
        confirmText="آیا مطمئن هستید که می‌خواهید این تصویر را حذف کنید؟"
        confirmAction={handleDeleteImage}
        size="sm"
        onClose={() => setConfirmModalOpen(false)}
      />
    </div>
  );
}
