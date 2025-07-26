import { Button } from "@heroui/button";
import useSWR, { useSWRConfig } from "swr";
import { Spinner } from "@heroui/spinner";
import apiCRUD from "@/services/apiCRUD";
import useMyForm from "@/hooks/useMyForm";
import InputBasic from "@/components/inputs/InputBasic";
import RetryError from "@/components/datadisplay/RetryError";
import { OrderIndex, OrderShow } from "@/types/apiTypes";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";
import TextAreaCustom from "@/components/inputs/TextAreaCustom";
import { useFiltersContext } from "@/contexts/SearchFilters";
import TableGenerate from "@/components/datadisplay/TableGenerate";
import { dateConvert } from "@/utils/dateConvert";
import { currency } from "@/constants/staticValues";
import formatPrice from "@/utils/formatPrice";

type Props = {
  onClose: () => void;
  selectedData?: OrderIndex;
  isShowMode?: boolean;
};

export default function FormOrders({
  onClose,
  selectedData,
  isShowMode,
}: Props) {
  const {
    data: orderData,
    error: orderError,
    isLoading: orderLoading,
    mutate: mutateOrder,
  } = useSWR(`admin-panel/orders/` + selectedData?.id, (url) =>
    apiCRUD({
      urlSuffix: url,
    }),
  );
  const { filters } = useFiltersContext();
  const { mutate } = useSWRConfig();

  const order: OrderShow = orderData?.data;

  const { values, errors, loading, handleChange, handleSubmit, setErrors } =
    useMyForm(
      {
        status: order?.status,
        payment_status: order?.payment_status,
        total_weight: order?.total_weight,
        delivery_serial: order?.delivery_serial,
        description: order?.description,
      },
      async (formValues) => {
        const res = await apiCRUD({
          urlSuffix: `admin-panel/orders/${selectedData?.id}`,
          method: "PUT",
          data: formValues,
        });
        if (res?.message) setErrors(res.message);
        if (res?.status === "success") {
          onClose();
          mutate(`admin-panel/orders${filters ? "?" + filters : filters}`);
        }
      },
    );

  if (orderLoading)
    return (
      <div className="grid h-[200px] w-full place-content-center">
        <Spinner />
      </div>
    );
  if (orderError) {
    return (
      <div className="h-[250px]">
        <RetryError
          onRetry={() => {
            mutateOrder();
          }}
        />
      </div>
    );
  }
  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {values?.status && (
          <SelectSearchCustom
            title="وضعیت"
            options={[
              { id: "pending", title: "در انتظار پرداخت" },
              { id: "payout", title: "پرداخت" },
              { id: "prepare", title: "آماده‌سازی" },
              { id: "send", title: "ارسال" },
              { id: "end", title: "پایان" },
              { id: "cancel", title: "لغو" },
            ]}
            defaultValue={[
              {
                id: values.status,
                title:
                  values.status === "pending"
                    ? "در انتظار پرداخت"
                    : values.status === "payout"
                      ? "پرداخت"
                      : values.status === "prepare"
                        ? "آماده‌سازی"
                        : values.status === "send"
                          ? "ارسال"
                          : values.status === "end"
                            ? "پایان"
                            : values.status === "cancel"
                              ? "لغو"
                              : values.status,
              },
            ]}
            onChange={
              isShowMode
                ? undefined
                : (selected) =>
                    handleChange("status")(selected?.[0]?.id.toString())
            }
            errorMessage={errors.status}
            placeholder="انتخاب"
            isDisable={isShowMode}
          />
        )}
        {values?.payment_status && (
          <SelectSearchCustom
            title="وضعیت پرداخت"
            options={[
              { id: "pending", title: "در انتظار پرداخت" },
              { id: "success", title: "پرداخت موفق" },
              { id: "rejected", title: "پرداخت ناموفق" },
            ]}
            defaultValue={[
              {
                id: values.payment_status,
                title:
                  values.payment_status === "pending"
                    ? "در انتظار پرداخت"
                    : values.payment_status === "success"
                      ? "پرداخت موفق"
                      : values.payment_status === "rejected"
                        ? "پرداخت ناموفق"
                        : values.payment_status,
              },
            ]}
            onChange={
              isShowMode
                ? undefined
                : (selected) =>
                    handleChange("payment_status")(selected?.[0]?.id.toString())
            }
            errorMessage={errors.payment_status}
            placeholder="انتخاب"
            isDisable={isShowMode}
          />
        )}
        <InputBasic
          name="total_weight"
          label="وزن کل"
          value={values.total_weight?.toString()}
          onChange={isShowMode ? undefined : handleChange("total_weight")}
          errorMessage={errors.total_weight}
          isDisabled={isShowMode}
        />
        <InputBasic
          name="delivery_serial"
          label="سریال تحویل"
          value={values.delivery_serial || ""}
          onChange={isShowMode ? undefined : handleChange("delivery_serial")}
          errorMessage={errors.delivery_serial}
          isDisabled={isShowMode}
        />
      </div>

      <div className="mt-3">
        <TextAreaCustom
          label="توضیحات:"
          name="description"
          value={values.description || ""}
          onChange={
            isShowMode ? undefined : (val) => handleChange("description")(val)
          }
          errorMessage={errors.description}
          isDisabled={isShowMode}
        />
      </div>

      {isShowMode && (
        <>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <InputBasic
              name="user_name"
              label="نام کاربر"
              value={order?.user?.name || ""}
              isDisabled
            />
            <InputBasic
              name="user_cellphone"
              label="شماره تلفن کاربر"
              value={order?.user?.cellphone || ""}
              isDisabled
            />
            <InputBasic
              name="address"
              label="آدرس"
              value={order?.address?.address || ""}
              isDisabled
            />
            <InputBasic
              name="coupon"
              label="کد تخفیف"
              value={
                order.coupon
                  ? order?.coupon?.name +
                      "  |  " +
                      order?.coupon?.code +
                      "  |  " +
                      order?.coupon?.value || ""
                  : "-"
              }
              isDisabled
            />
          </div>
          <div className="mt-3 flex flex-col gap-3">
            <TableGenerate
              topHeader
              title="آیتم‌ها"
              data={{
                headers: [
                  { content: "نام" },
                  { content: "تعداد" },
                  { content: "قیمت" },
                  { content: "متغیر" },
                  { content: "sku" },
                ],
                body: order?.items?.map((item) => ({
                  cells: [
                    { data: item.product?.name },
                    { data: item.quantity },
                    { data: formatPrice(item.price) + " " + currency },
                    { data: item.variation.sku },
                  ],
                })),
              }}
            />
            <TableGenerate
              topHeader
              title="تراکنش‌ها"
              data={{
                headers: [
                  { content: "تاریخ ایجاد" },
                  { content: "تاریخ آپدیت" },
                  { content: "درگاه" },
                  { content: "مبلغ" },
                  { content: "وضعیت" },
                ],
                body: order?.transactions?.map((transaction) => ({
                  cells: [
                    { data: dateConvert(transaction.created_at, "persian") },
                    { data: dateConvert(transaction.updated_at, "persian") },
                    { data: transaction.gateway_name },
                    { data: formatPrice(transaction.amount) + " " + currency },
                    {
                      data:
                        transaction.status === "pending"
                          ? "در انتظار"
                          : transaction.status === "payout"
                            ? "پرداخت"
                            : transaction.status === "prepare"
                              ? "آماده سازی"
                              : transaction.status === "send"
                                ? "ارسال"
                                : transaction.status === "end"
                                  ? "پایان"
                                  : transaction.status === "cancel"
                                    ? "لغو"
                                    : transaction.status,
                    },
                  ],
                })),
              }}
            />
          </div>
        </>
      )}

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
