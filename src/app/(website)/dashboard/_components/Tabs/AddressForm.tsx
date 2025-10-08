import { Button } from "@heroui/button";
import { useSWRConfig } from "swr";
import apiCRUD from "@/services/apiCRUD";
import useMyForm from "@/hooks/useMyForm";
import InputBasic from "@/components/inputs/InputBasic";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";
import { Address, City } from "@/types/apiTypes";
import provinces from "@/constants/provinces.json";
import TextAreaCustom from "@/components/inputs/TextAreaCustom";
import { useEffect, useState } from "react";

type ForOthersProps = {
  user_id: string | number;
  addressId?: string | number;
};

type Props = {
  onClose?: () => void;
  isEditMode?: boolean;
  isInModal?: boolean;
  isShowMode?: boolean;
  confirmText?: string;
  selectedData?: Address;
  onSuccess?: (addressId: number) => void;
  forOthers?: ForOthersProps;
};

export default function AddressForm({
  onClose,
  isEditMode = false,
  isInModal = true,
  isShowMode = false,
  confirmText = "ذخیره",
  selectedData,
  onSuccess,
  forOthers,
}: Props) {
  const { mutate } = useSWRConfig();
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState<boolean>(false);

  const {
    values,
    setValues,
    errors,
    loading,
    handleChange,
    handleSubmit,
    setErrors,
  } = useMyForm(
    {
      /* title: selectedData?.title, */
      province_id: selectedData?.province_id || undefined,
      city_id: selectedData?.city_id || undefined,
      address: selectedData?.address || undefined,
      /*     longitude: selectedData?.longitude || undefined,
      latitude: selectedData?.latitude || undefined, */
      /* is_me: 1, */
      receiver_name: selectedData?.receiver_name || undefined,
      cellphone: selectedData?.cellphone || undefined,
      /*  postal_code: selectedData?.postal_code || undefined, */
    },
    async (formValues) => {
      const payload = {
        ...formValues,
      };

      // Determine URL and mutate key based on forOthers
      let urlSuffix = "";
      let mutateKey = "";
      if (forOthers) {
        if (isEditMode || isShowMode) {
          // Edit or show mode: addressId is required
          urlSuffix = `admin-panel/user-addresses/${forOthers.addressId}`;
          mutateKey = `admin-panel/user-addresses/${forOthers.user_id}`;
        } else {
          // Create mode: user_id is required
          urlSuffix = `admin-panel/user-addresses/${forOthers.user_id}`;
          mutateKey = `admin-panel/user-addresses/${forOthers.user_id}`;
        }
      } else {
        urlSuffix = `next/profile/addresses${isEditMode ? `/${selectedData?.id}` : ""}`;
        mutateKey = `next/profile/addresses`;
      }

      const res = await apiCRUD({
        urlSuffix,
        method: "POST",
        data: { ...payload, _method: isEditMode ? "put" : "post" },
      });
      if (res?.message) setErrors(res.message);
      if (res?.status === "success") {
        onSuccess?.(res.data?.id);
        onClose?.();
        mutate?.(mutateKey);
      }
    },
  );

  useEffect(() => {
    if (values.province_id) {
      (async () => {
        setLoadingCities(true);
        const res = await apiCRUD({
          urlSuffix: `next/cities/${values.province_id}`,
        });
        if (res?.status === "success") {
          setCities(res?.data);
        } else {
          setValues((prev) => ({ ...prev, province_id: undefined }));
        }
        setLoadingCities(false);
      })();
    }
  }, [values.province_id, setValues]);

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/*  <InputBasic
          name="title"
          label="عنوان"
          value={values.title}
          onChange={handleChange("title")}
          errorMessage={errors.title}
          isDisabled={isShowMode}
        /> */}
        <SelectSearchCustom
          title="استان"
          options={provinces?.provinces?.map((p) => ({
            id: p.id,
            title: p.name,
          }))}
          isDisable={isShowMode}
          defaultValue={
            selectedData?.province?.id
              ? [
                  {
                    id: selectedData.province.id,
                    title: selectedData.province.name,
                  },
                ]
              : []
          }
          value={
            values.province_id
              ? [
                  {
                    id: values.province_id,
                    title:
                      provinces?.provinces?.find(
                        (p) =>
                          p.id.toString() === values?.province_id?.toString(),
                      )?.name || "",
                  },
                ]
              : undefined
          }
          onChange={(selected) =>
            handleChange("province_id")(selected?.[0]?.id.toString())
          }
          errorMessage={errors.province_id}
          placeholder="انتخاب"
        />
        <SelectSearchCustom
          title="شهر"
          options={cities?.map((city) => ({
            id: city.id,
            title: city.name,
          }))}
          isDisable={isShowMode || loadingCities || !values?.province_id}
          defaultValue={
            selectedData && values.city_id
              ? [
                  {
                    id: selectedData.city.name,
                    title: selectedData.city.name,
                  },
                ]
              : []
          }
          value={
            values.city_id
              ? [
                  {
                    id: values.city_id,
                    title:
                      cities?.find((c) => c.id == values?.city_id)?.name || "",
                  },
                ]
              : undefined
          }
          onChange={(selected) =>
            handleChange("city_id")(selected?.[0]?.id.toString())
          }
          errorMessage={errors.city_id}
          placeholder={
            !values.province_id ? "لطفا استان را انتخاب کنید" : "انتخاب"
          }
        />

        <InputBasic
          name="receiver_name"
          label="نام گیرنده"
          value={values.receiver_name}
          onChange={handleChange("receiver_name")}
          errorMessage={errors.receiver_name}
          isDisabled={isShowMode}
        />
        <InputBasic
          name="cellphone"
          type="number"
          label="شماره تماس"
          value={values.cellphone}
          onChange={handleChange("cellphone")}
          errorMessage={errors.cellphone}
          isDisabled={isShowMode}
        />
        {/*    <InputBasic
          name="postal_code"
          label="کد پستی"
          type="number"
          value={values.postal_code}
          onChange={handleChange("postal_code")}
          errorMessage={errors.postal_code}
          isDisabled={isShowMode}
        /> */}
        {/*  <div className="flex items-center">
          <SwitchWrapper
            label="آیا این آدرس برای خودتان است؟"
            onChange={(val) => {
              setValues((prev) => ({ ...prev, is_me: val === "1" ? 1 : 0 }));
            }}
            isSelected={values.is_me}
            errorMessage={errors?.is_me}
            isDisabled={isShowMode}
          />
        </div> */}
        <div className="col-span-full">
          <TextAreaCustom
            name="address"
            label="آدرس"
            type="number"
            value={values.address}
            onChange={handleChange("address")}
            errorMessage={errors.address}
            isDisabled={isShowMode}
          />
          {/* <p className="my-5">روی نقشه:</p>
          <MapCustom
            selectMode={true}
            onChange={(location) => {
              handleChange("latitude")(location.lat.toString());
              handleChange("longitude")(location.long.toString());
            }}
            markerData={
              values.latitude && values.longitude
                ? [
                    {
                      lat: parseFloat(values.latitude),
                      long: parseFloat(values.longitude),
                    },
                  ]
                : undefined
            }
            error={!!errors.latitude || !!errors.longitude}
            errorRetryFunction={() => {}}
          /> */}
        </div>
      </div>
      <div className="mb-3 mt-3 flex justify-end gap-2">
        {isInModal && (
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
            {confirmText}
          </Button>
        )}
      </div>
    </form>
  );
}
