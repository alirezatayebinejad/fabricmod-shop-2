import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/button";
import apiCRUD from "@/services/apiCRUD";
import useMyForm from "@/hooks/useMyForm";
import InputBasic from "@/components/inputs/InputBasic";
import SelectSearchCustom, {
  SelectSearchItem,
} from "@/components/inputs/SelectSearchCustom";
import TextAreaCustom from "@/components/inputs/TextAreaCustom";
import useSWR, { useSWRConfig } from "swr";
import SwitchWrapper from "@/components/inputs/SwitchWrapper";
import AddressTab from "@/app/(website)/dashboard/_components/Tabs/AddressTab";
import {
  Address,
  AddressUser,
  OrderIndex,
  OrderShow,
  ProductsWithVariationIndex,
  ShippingmethodIndex,
  UserIndex,
} from "@/types/apiTypes";
import RetryError from "@/components/datadisplay/RetryError";
import { Spinner } from "@heroui/spinner";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { dateConvert } from "@/utils/dateConvert";
import { weight } from "@/constants/staticValues";

type Props = {
  onClose: () => void;
  selectedData?: OrderIndex;
  isShowMode?: boolean;
  isEditMode?: boolean;
};

interface ProductWithQty {
  variation_id: string;
  qty: string;
}

// Helper to safely render variation description
function getVariationDescription(
  variation?:
    | ProductsWithVariationIndex["variations"][number]
    | OrderShow["items"][number]["variation"]
    | null,
) {
  if (!variation) return "";
  const attr =
    typeof variation.attribute?.name === "string"
      ? variation.attribute.name
      : "";
  const val = typeof variation.value === "string" ? variation.value : "";
  if (!attr && !val) return "";
  return attr && val ? `${attr}: ${val}` : attr || val;
}

export default function FormOrders({
  onClose,
  selectedData,
  isShowMode,
  isEditMode,
}: Props) {
  const { filters } = useFiltersContext();
  const { mutate } = useSWRConfig();
  const {
    data: orderData,
    error: orderError,
    isLoading: orderLoading,
    mutate: mutateorder,
  } = useSWR(
    isEditMode || isShowMode
      ? `admin-panel/orders/` + selectedData?.id
      : undefined,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
  );
  const order: OrderShow | undefined = orderData?.data;

  // Always start at step 2 in edit mode
  const [step, setStep] = useState(isEditMode ? 2 : isShowMode ? 2 : 0);
  const [selectedUser, setSelectedUser] = useState<SelectSearchItem | null>(
    null,
  );
  const [selectedAddress, setSelectedAddress] = useState<
    AddressUser | Address | OrderShow["address"] | null
  >(null);
  const [selectedProducts, setSelectedProducts] = useState<SelectSearchItem[]>(
    [],
  );

  const addressRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditMode && order) {
      if (order.user) {
        setSelectedUser({
          id: order.user.id,
          title: order.user.name + " - " + order.user.cellphone,
        });
      }
      if (order.address) {
        setSelectedAddress({
          ...order.address,
        });
      }
      if (order.items) {
        setSelectedProducts(
          order.items.map((p: OrderShow["items"][number]) => ({
            id: p.variation_id,
            title: p.product.name,
            description: getVariationDescription(p.variation),
          })),
        );
      }
      // Always set step to 2 in edit mode
      setStep(2);
    }
    if (!isEditMode) {
      setSelectedUser(null);
      setSelectedAddress(null);
      setSelectedProducts([]);
    }
    // eslint-disable-next-line
  }, [isEditMode, order]);

  const editAndShow = isEditMode || isShowMode;
  const {
    values,
    errors,
    loading,
    handleChange,
    handleSubmit,
    setErrors,
    setValues,
  } = useMyForm(
    {
      user_id: editAndShow ? undefined : "",
      is_whole: order?.is_whole_sale ?? 0,
      address_id: editAndShow ? order?.address?.id : "",
      status: editAndShow ? (order?.status ?? "pending") : "pending",
      description: editAndShow ? (order?.description ?? "") : "",
      delivery_amount: editAndShow ? (order?.delivery_amount ?? "") : "",
      delivery_serial: editAndShow ? (order?.delivery_serial ?? "") : "",
      products: editAndShow
        ? (order?.items?.map((p) => ({
            variation_id: p.variation_id,
            qty: p.quantity?.toString() ?? "1",
          })) ?? [])
        : ([] as ProductWithQty[]),
      shipping_method: editAndShow ? order?.shipping.code : "",
      coupon_amount: editAndShow ? (order?.coupon_amount ?? "") : "",
      total_weight: editAndShow ? (order?.total_weight ?? "") : "",
    },
    async (formValues) => {
      const dataToSend = {
        ...formValues,
        user_id: isEditMode ? order?.user?.id : selectedUser?.id,
        address_id: isEditMode ? formValues.address_id : selectedAddress?.id,
        products: selectedProducts.map((product, index) => ({
          variation_id: product.id,
          qty: (formValues.products as ProductWithQty[])?.[index]?.qty || "1",
        })),
        _method: isEditMode ? "put" : undefined,
      };
      const res = await apiCRUD({
        urlSuffix: selectedData?.id
          ? `admin-panel/orders/${selectedData.id}`
          : "admin-panel/orders",
        method: "POST",
        data: dataToSend,
      });
      if (res?.message) setErrors(res.message);
      if (res?.status === "success") {
        onClose();
        mutate(`admin-panel/orders${filters ? "?" + filters : "?"}`);
      }
    },
  );

  // Step 2: Address selection
  const handleAddressSelect = (address: AddressUser | Address) => {
    setSelectedAddress(address);
    setValues((prev: any) => ({
      ...prev,
      address_id: address?.id,
    }));
    setStep(2);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Step 3: Product selection
  const handleProductSelect = (selected: SelectSearchItem[]) => {
    setSelectedProducts(selected);
    setValues((prev: any) => ({
      ...prev,
      products: selected.map((s) => {
        // If in edit mode and we have previous qty, use it
        if (isEditMode && prev.products && Array.isArray(prev.products)) {
          const found = (prev.products as ProductWithQty[])?.find(
            (p) => p.variation_id?.toString() === s.id.toString(),
          );
          return {
            variation_id: s.id,
            qty: found?.qty || "1",
          };
        }
        return { variation_id: s.id, qty: "1" };
      }),
    }));
  };

  // Step 3: Product qty change
  const handleProductQtyChange = (index: number, qty: string) => {
    // Allow empty string so user can clear the input and re-enter
    let safeQty = qty.replace(/[^0-9]/g, "");
    // If user is deleting, allow empty string
    if (qty === "") {
      safeQty = "";
    } else if (safeQty !== "" && parseInt(safeQty) < 1) {
      safeQty = "1";
    }
    setValues((prev: any) => ({
      ...prev,
      products: (prev.products as ProductWithQty[])?.map(
        (product: ProductWithQty, i: number) =>
          i === index ? { ...product, qty: safeQty } : product,
      ),
    }));
  };

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
            mutateorder();
          }}
        />
      </div>
    );
  }

  // Step 0: User selection (skip in edit mode)
  if (!isEditMode && step === 0) {
    return (
      <form noValidate>
        <div>
          <SelectSearchCustom
            title="انتخاب کاربر"
            placeholder="براساس نام، شماره یا ایمیل"
            isSearchFromApi
            requestSelectOptions={async (search) => {
              const res = await apiCRUD({
                urlSuffix: `admin-panel/users?${search ? `search=${search}` : "per_page=15"}`,
              });
              return (
                res?.data?.users?.map((u: UserIndex) => ({
                  id: u.id,
                  title: (u.name ? u.name + " - " : "") + u.cellphone,
                })) || []
              );
            }}
            showNoOneOption={false}
            onChange={(selected: SelectSearchItem[]) => {
              setSelectedUser(selected?.[0]);
              setValues((prev: any) => ({
                ...prev,
                user_id: selected?.[0]?.id,
              }));
              setStep(1);
              setTimeout(() => {
                addressRef.current?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            isDisable={isShowMode}
            value={selectedUser ? [selectedUser] : []}
            errorMessage={errors.user_id}
          />
        </div>
        <div className="mb-3 mt-3 flex justify-end gap-2">
          <Button
            type="button"
            className="rounded-[8px] border-1 border-border bg-transparent px-6 text-[14px] font-[500] text-TextColor"
            variant="light"
            onPress={onClose}
          >
            لغو
          </Button>
        </div>
      </form>
    );
  }

  // Step 1: Address selection (do NOT skip in edit mode)
  if (step === 1) {
    return (
      <form noValidate>
        <div ref={addressRef}>
          <AddressTab
            user_id={
              isEditMode
                ? selectedData?.user?.id
                  ? +selectedData?.user?.id
                  : undefined
                : selectedUser?.id
                  ? +selectedUser?.id
                  : undefined
            }
            onSelect={handleAddressSelect}
            isSelectable
          />
        </div>
        <div className="mb-3 mt-3 flex justify-end gap-2">
          {!isEditMode && (
            <Button
              type="button"
              className="rounded-[8px] border-1 border-border bg-transparent px-6 text-[14px] font-[500] text-TextColor"
              variant="light"
              onPress={() => setStep(0)}
            >
              بازگشت
            </Button>
          )}
          <Button
            type="button"
            className="rounded-[8px] px-10 text-[14px] font-[500] text-primary-foreground"
            color="primary"
            onPress={() => {
              if (selectedAddress) setStep(2);
            }}
            isDisabled={!selectedAddress}
          >
            ادامه
          </Button>
        </div>
      </form>
    );
  }

  // Step 2: Main form (always shown in edit mode after address selection)
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        // Fix: Prevent submit if no products selected
        if (
          (!selectedProducts || selectedProducts.length === 0) &&
          (!isEditMode || !order?.items || order?.items.length === 0)
        ) {
          setErrors((prev: any) => ({
            ...prev,
            products: "حداقل یک محصول انتخاب کنید",
          }));
          return;
        }
        handleSubmit(e);
      }}
    >
      <div ref={formRef} />
      <div className="mb-4">
        <div className="mb-2">
          <b>کاربر:</b>
          {selectedUser?.title
            ? selectedData?.user
              ? (order?.user?.name ? order.user.name + " - " : "") +
                order?.user?.cellphone
              : ""
            : ""}
        </div>
        <div className="mb-2 flex items-center gap-2">
          <b>آدرس:</b>

          {selectedAddress || order?.address ? (
            <div className="flex flex-wrap gap-1">
              {(selectedAddress?.receiver_name ||
                order?.address?.receiver_name) && (
                <span>
                  گیرنده:
                  {selectedAddress?.receiver_name ||
                    order?.address?.receiver_name ||
                    "-"}
                </span>
              )}
              {(selectedAddress?.cellphone || order?.address?.cellphone) && (
                <span>
                  تلفن:
                  {selectedAddress?.cellphone ||
                    order?.address?.cellphone ||
                    "-"}
                </span>
              )}
              <span>
                {selectedAddress?.title || order?.address?.title || ""}
              </span>
              {(selectedAddress?.province?.name ||
                order?.address?.province?.name) && (
                <span>
                  {" - " +
                    (selectedAddress?.province.name ||
                      order?.address.province.name ||
                      "")}
                </span>
              )}
              {(selectedAddress?.city.name || order?.address?.city.name) && (
                <span>
                  {" - " +
                    (selectedAddress?.city.name ||
                      order?.address?.city.name ||
                      "")}
                </span>
              )}
              {(selectedAddress?.address || order?.address?.address) && (
                <span>
                  {" - " +
                    (selectedAddress?.address || order?.address?.address || "")}
                </span>
              )}
              {(selectedAddress?.postal_code ||
                order?.address?.postal_code) && (
                <span>
                  کد پستی:
                  {selectedAddress?.postal_code ||
                    order?.address?.postal_code ||
                    "-"}
                </span>
              )}

              {(selectedAddress?.city?.name || order?.address?.city?.name) && (
                <span>
                  شهر:
                  {selectedAddress?.city?.name ||
                    order?.address?.city?.name ||
                    "-"}
                </span>
              )}
              {(selectedAddress?.province?.name ||
                order?.address?.province?.name) && (
                <span>
                  استان:
                  {selectedAddress?.province?.name ||
                    order?.address?.province?.name ||
                    "-"}
                </span>
              )}
            </div>
          ) : (
            <span>-</span>
          )}
          {isEditMode && (
            <Button
              type="button"
              size="sm"
              className="ml-2 rounded-[6px] border-1 border-border bg-transparent px-3 py-1 text-[13px] font-[500] text-primary"
              variant="light"
              onPress={() => setStep(1)}
            >
              تغییر آدرس
            </Button>
          )}
        </div>
        {isShowMode && (
          <div className="mb-2 flex flex-col gap-1 text-xs text-gray-500">
            <div>
              <span>تاریخ ایجاد: </span>
              <span>
                {order?.created_at
                  ? dateConvert(order.created_at, "persian", "english", {
                      withTime: true,
                    })
                  : "-"}
              </span>
            </div>
            <div>
              <span>آخرین بروزرسانی: </span>
              <span>
                {order?.updated_at
                  ? dateConvert(order.updated_at, "persian", "english", {
                      withTime: true,
                    })
                  : "-"}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SwitchWrapper
          label="سفارش عمده"
          isSelected={values.is_whole}
          onChange={(val) => handleChange("is_whole")(val === "1" ? "1" : "0")}
          isDisabled={isShowMode}
        />
        <InputBasic
          name="delivery_amount"
          label="هزینه ارسال"
          type="number"
          value={values.delivery_amount}
          onChange={isShowMode ? undefined : handleChange("delivery_amount")}
          errorMessage={errors.delivery_amount}
          isDisabled={isShowMode}
        />
        <InputBasic
          name="delivery_serial"
          label="سریال تحویل"
          value={values.delivery_serial}
          onChange={isShowMode ? undefined : handleChange("delivery_serial")}
          errorMessage={errors.delivery_serial}
          isDisabled={isShowMode}
        />
        <InputBasic
          name="total_weight"
          label={"مجموع وزن" + " " + weight}
          type="number"
          value={values.total_weight}
          onChange={isShowMode ? undefined : handleChange("total_weight")}
          errorMessage={errors.total_weight}
          isDisabled={isShowMode}
        />
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
            { id: "pending", title: "در انتظار پرداخت" },
            { id: "payout", title: "پرداخت" },
            { id: "prepare", title: "آماده‌سازی" },
            { id: "send", title: "ارسال" },
            { id: "end", title: "پایان" },
            { id: "cancel", title: "لغو" },
          ].filter((o) => o.id === values.status)}
          onChange={
            isShowMode
              ? undefined
              : (selected) =>
                  handleChange("status")(selected?.[0]?.id?.toString() || "")
          }
          errorMessage={errors.status}
          placeholder="انتخاب"
          isDisable={isShowMode}
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
      <div className="mt-4">
        {isShowMode ? (
          <div>
            {order?.items?.map((item, idx) => (
              <div
                key={item.id || idx}
                className="mt-1 flex flex-col gap-4 rounded-lg border border-border bg-boxBg100 p-4 md:flex-row md:items-center"
              >
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">
                      محصول:
                    </span>
                    <span className="text-base text-TextColor">
                      {item.product?.name}
                    </span>
                  </div>
                  {item.variation ? (
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">
                        تنوع: ({item.variation?.attribute?.name || "-"})
                      </span>
                      <span className="text-base text-TextColor">
                        {typeof item.variation.value === "string"
                          ? item.variation.value
                          : "-"}
                      </span>
                    </div>
                  ) : (
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">
                        تنوع:
                      </span>
                      <span className="text-base text-TextColor">-</span>
                    </div>
                  )}
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">
                      تعداد:
                    </span>
                    <span className="text-base text-TextColor">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">
                      قیمت واحد:
                    </span>
                    <span className="text-base text-TextColor">
                      {Number(item.price).toLocaleString()} تومان
                    </span>
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">
                      قیمت پرداختی:
                    </span>
                    <span className="text-base text-TextColor">
                      {Number(item.paying_price).toLocaleString()} تومان
                    </span>
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">
                      جمع جزء:
                    </span>
                    <span className="text-base text-TextColor">
                      {Number(item.sub_total).toLocaleString()} تومان
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <SelectSearchCustom
            title="محصولات"
            placeholder="جستجو و انتخاب محصولات"
            isSearchFromApi
            isMultiSelect
            requestSelectOptions={async (search) => {
              const res = await apiCRUD({
                urlSuffix: `admin-panel/product/variations?${search ? `search=${search}&per_page=all` : "per_page=10"}`,
              });
              // The API should return products, each with a variations array
              // Each variation should have an id and a name
              // We want to flatten all variations of all products into the select options
              const products: ProductsWithVariationIndex[] =
                res?.data?.products?.data || [];
              const options: SelectSearchItem[] = [];
              products?.forEach((product: ProductsWithVariationIndex) => {
                if (
                  Array.isArray(product.variations) &&
                  product.variations.length > 0
                ) {
                  product.variations.forEach((variation) => {
                    options.push({
                      id: variation?.id,
                      title: product.name,
                      description: getVariationDescription(variation),
                    });
                  });
                }
              });
              return options;
            }}
            onChange={(vs) =>
              handleProductSelect(
                vs?.map((v) => ({
                  id: v.id,
                  title: v.title,
                  description: v.description,
                })) || [],
              )
            }
            isDisable={isShowMode}
            value={
              selectedProducts && selectedProducts.length > 0
                ? selectedProducts?.map((s) => ({
                    id: s.id,
                    title: s.title,
                    description: s.description,
                  }))
                : isEditMode && order?.items
                  ? order.items?.map((p) => ({
                      id: p.variation_id,
                      title: p.product.name,
                      description: getVariationDescription(p.variation),
                    }))
                  : []
            }
            errorMessage={errors["products"]}
          />
        )}
      </div>

      {/* Product quantities */}
      {(selectedProducts.length > 0 ||
        (isEditMode && order?.items && order.items.length > 0)) && (
        <div className="mt-4">
          <h4 className="mb-3 text-sm font-medium">تعداد محصولات:</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {(selectedProducts.length > 0
              ? selectedProducts
              : isEditMode && order?.items
                ? order.items.map((p) => ({
                    id: p.variation_id,
                    title: p.product?.name,
                    description: getVariationDescription(p.variation),
                  }))
                : []
            ).map((product, index) => (
              <InputBasic
                key={product.id}
                name={`products.${index}.qty`}
                label={`تعداد ${product.title}${product.description ? " - " + product.description : ""}`}
                type="number"
                value={
                  (values.products as ProductWithQty[])?.[index]?.qty !==
                  undefined
                    ? (values.products as ProductWithQty[])?.[index]?.qty
                    : (isEditMode &&
                        order?.items?.[index]?.quantity?.toString()) ||
                      ""
                }
                onChange={(e) => handleProductQtyChange(index, e.target.value)}
                errorMessage={
                  errors[`products.${index}.qty` as keyof typeof errors]
                }
                isDisabled={isShowMode}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <SelectSearchCustom
          title="روش ارسال"
          isSearchFromApi
          requestSelectOptions={async () => {
            const res = await apiCRUD({
              urlSuffix: `admin-panel/shipping-methods?per_page=20`,
            });
            return (
              res?.data?.shipping_methods?.map((d: ShippingmethodIndex) => ({
                id: d.id,
                title: d.name,
                helperValue: d.code,
              })) || []
            );
          }}
          showNoOneOption={false}
          onChange={(selected) => {
            setValues((prev) => ({
              ...prev,
              shipping_method: selected?.[0]?.helperValue,
            }));
          }}
          isDisable={isShowMode}
          defaultValue={
            values.shipping_method && order?.shipping?.id
              ? [
                  {
                    id: order.shipping?.id,
                    title: order.shipping?.name,
                    helperValue: order.shipping?.code,
                  },
                ]
              : []
          }
          errorMessage={errors.shipping_method}
        />
        <InputBasic
          name="coupon_amount"
          label="مقدار تخفیف"
          type="number"
          value={values.coupon_amount}
          onChange={isShowMode ? undefined : handleChange("coupon_amount")}
          errorMessage={errors.coupon_amount}
          isDisabled={isShowMode}
        />
      </div>
      <div className="mb-3 mt-6 flex justify-end gap-2">
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
