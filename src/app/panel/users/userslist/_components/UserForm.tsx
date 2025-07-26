import { Button } from "@heroui/button";
import useSWR from "swr";
import { Spinner } from "@heroui/spinner";
import apiCRUD from "@/services/apiCRUD";
import useMyForm from "@/hooks/useMyForm";
import InputBasic from "@/components/inputs/InputBasic";
import { useTableMutateContext } from "@/app/panel/_contexts/tableMutateContext";
import RetryError from "@/components/datadisplay/RetryError";
import { RoleIndex, UserIndex, UserShow } from "@/types/apiTypes";
import SwitchWrapper from "@/components/inputs/SwitchWrapper";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";

type Props = {
  onClose: () => void;
  isEditMode?: boolean;
  isShowMode?: boolean;
  selectedData?: UserIndex;
};

export default function UserForm({
  onClose,
  isEditMode = false,
  isShowMode = false,
  selectedData,
}: Props) {
  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
    mutate: mutateUser,
  } = useSWR(
    isEditMode || isShowMode
      ? `admin-panel/users/` + selectedData?.id
      : undefined,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
  );
  const { executeMutateFunction } = useTableMutateContext();
  const user: UserShow = userData?.data;

  const {
    values,
    errors,
    loading,
    handleChange,
    handleSubmit,
    setValues,
    setErrors,
  } = useMyForm(
    {
      name: user?.name || "",
      cellphone: user?.cellphone || "",
      email: user?.email || "",
      /*  password: undefined,
      password_confirm: undefined, */
      status: user?.status || "approved",
      roles: user?.roles?.map((r) => r.name),
      is_active: user?.is_active?.toString() || "1",
    },
    async (formValues) => {
      const payload =
        formValues?.cellphone === user?.cellphone
          ? { ...formValues, cellphone: undefined }
          : formValues;
      const res = await apiCRUD({
        urlSuffix: `admin-panel/users${isEditMode ? `/${selectedData?.id}` : ""}`,
        method: "POST",
        data: { ...payload, _method: isEditMode ? "put" : "post" },
      });
      if (res?.message) setErrors(res.message);
      if (res?.status === "success") {
        onClose();
        executeMutateFunction();
      }
    },
  );

  if (userLoading)
    return (
      <div className="grid h-[200px] w-full place-content-center">
        <Spinner />
      </div>
    );
  if (userError) {
    return (
      <div className="h-[250px]">
        <RetryError
          onRetry={() => {
            mutateUser();
          }}
        />
      </div>
    );
  }
  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputBasic
          name="name"
          label="نام"
          placeholder=" "
          value={values.name}
          onChange={handleChange("name")}
          errorMessage={errors.name}
          isDisabled={isShowMode}
        />
        <InputBasic
          name="cellphone"
          type="number"
          label="شماره موبایل"
          placeholder=" "
          value={values.cellphone}
          onChange={handleChange("cellphone")}
          errorMessage={errors.cellphone}
          isDisabled={isShowMode}
        />
        <SelectSearchCustom
          title="نقش ها"
          isMultiSelect
          requestSelectOptions={async () => {
            const rolesRes = await apiCRUD({
              urlSuffix: `admin-panel/user/roles?per_page=all`,
            });
            if (rolesRes?.status === "success") {
              return rolesRes.data?.roles?.map((item: RoleIndex) => ({
                id: item.id,
                title: item.display_name,
                helperValue: item.name,
              }));
            }
            return [];
          }}
          isDisable={isShowMode}
          /* TODO these default values in select multies are not updating first time show after the form update it is in alot of forms*/
          defaultValue={
            user?.roles
              ? user.roles?.map((r) => ({
                  id: r.id,
                  title: r.display_name,
                  helperValue: r.name,
                }))
              : undefined
          }
          onChange={(vals) => {
            setValues((prev) => ({
              ...prev,
              roles: vals.map((r) => r.helperValue!),
            }));
          }}
          errorMessage={
            errors.roles ||
            values.roles
              ?.map((_: any, i: number) => (errors as any)[`roles.${i}`])
              .filter(Boolean)
              .join(", ")
          }
          placeholder="انتخاب"
        />
        <InputBasic
          name="email"
          type="email"
          label="ایمیل"
          placeholder=" "
          value={values.email}
          onChange={handleChange("email")}
          errorMessage={errors.email}
          isDisabled={isShowMode}
        />
        {!isShowMode && (
          <>
            {/* <InputBasic
              name="password"
              type="password"
              label="رمز عبور"
              placeholder=" "
              value={values.password}
              onChange={handleChange("password")}
              errorMessage={errors.password}
              isDisabled={isShowMode}
            />
            <InputBasic
              name="password_confirm"
              type="password"
              label="تایید رمز عبور"
              placeholder=" "
              value={values.password_confirm}
              onChange={handleChange("password_confirm")}
              errorMessage={errors.password_confirm}
              isDisabled={isShowMode}
            /> */}
          </>
        )}
        <SelectSearchCustom
          title="وضعیت کاربر"
          options={[
            { id: "approved", title: "تایید شده" },
            { id: "rejected", title: "رد شده" },
          ]}
          showNoOneOption={false}
          isSearchDisable
          isDisable={isShowMode}
          defaultValue={
            values?.status
              ? [
                  {
                    id: values?.status,
                    title:
                      values?.status === "approved"
                        ? "تایید شده"
                        : values?.status === "rejected"
                          ? "رد شده"
                          : "",
                  },
                ]
              : []
          }
          onChange={(selected) =>
            handleChange("status")(selected?.[0]?.id.toString())
          }
          errorMessage={errors.status}
          placeholder="انتخاب"
        />
      </div>

      <div className="mt-3">
        <SwitchWrapper
          label="وضعیت:"
          onChange={handleChange("is_active")}
          isSelected={values.is_active}
          errorMessage={errors?.is_active}
          isDisabled={isShowMode}
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
