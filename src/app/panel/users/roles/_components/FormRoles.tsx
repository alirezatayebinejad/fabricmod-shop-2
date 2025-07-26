import { Button } from "@heroui/button";
import { Deparment, Permission, RoleIndex, RoleShow } from "@/types/apiTypes";
import apiCRUD from "@/services/apiCRUD";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";
import useMyForm from "@/hooks/useMyForm";
import InputBasic from "@/components/inputs/InputBasic";
import RetryError from "@/components/datadisplay/RetryError";
import { Spinner } from "@heroui/spinner";
import { useTableMutateContext } from "@/app/panel/_contexts/tableMutateContext";
import useSWR from "swr";

type Props = {
  onClose: () => void;
  isEditMode?: boolean;
  isShowMode?: boolean;
  selectedData?: RoleIndex;
};

export default function FormRoles({
  onClose,
  isEditMode = false,
  isShowMode = false,
  selectedData,
}: Props) {
  const {
    data: roleData,
    error: roleError,
    isLoading: roleLoading,
    mutate: mutateRole,
  } = useSWR(
    isEditMode || isShowMode
      ? `admin-panel/user/roles/` + selectedData?.id
      : undefined,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
  );
  const { executeMutateFunction } = useTableMutateContext();
  const role: RoleShow = roleData?.data;

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
      name: role?.name || "",
      display_name: role?.display_name || "",
      access_panel: (role?.access_panel as "admin" | "user") || "",
      permissions: role?.permissions?.map((p) => p.name) || [],
      departments: role?.departments?.map((d) => d.id) || [],
    },
    async (formValues) => {
      const res = await apiCRUD({
        urlSuffix: `admin-panel/user/roles${isEditMode ? `/${selectedData?.id}` : ""}`,
        method: "POST",
        data: { ...formValues, _method: isEditMode ? "put" : "post" },
      });
      if (res?.message) setErrors(res.message);
      if (res?.status === "success") {
        onClose();
        executeMutateFunction();
      }
    },
  );
  if (roleLoading)
    return (
      <div className="grid h-[200px] w-full place-content-center">
        <Spinner />
      </div>
    );
  if (roleError) {
    return (
      <div className="h-[250px]">
        <RetryError
          onRetry={() => {
            mutateRole();
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
          name="display_name"
          label="نام نمایشی"
          placeholder=" "
          value={values.display_name}
          onChange={handleChange("display_name")}
          errorMessage={errors.display_name}
          isDisabled={isShowMode}
        />
        <SelectSearchCustom
          title="دسترسی به پنل"
          placeholder="انتخاب"
          options={[
            { id: "admin", title: "ادمين" },
            { id: "user", title: "کاربر" },
          ]}
          isMultiSelect={false}
          defaultValue={
            values.access_panel
              ? [
                  {
                    id: values.access_panel?.toString(),
                    title: values.access_panel === "admin" ? "ادمين" : "کاربر",
                  },
                ]
              : []
          }
          onChange={(vals) =>
            setValues((prev) => ({
              ...prev,
              access_panel: vals[0].id as "admin" | "user",
            }))
          }
          errorMessage={errors.access_panel}
          isDisable={isShowMode}
        />

        <SelectSearchCustom
          title="دپارتمان ها"
          placeholder="انتخاب"
          isMultiSelect={true}
          requestSelectOptions={async () => {
            const depsRes = await apiCRUD({
              urlSuffix: `admin-panel/user/departments`,
              requiresToken: true,
            });
            if (depsRes?.status === "success") {
              return depsRes.data?.map((item: Deparment) => ({
                id: item.id,
                title: item.name,
              }));
            }
            return [];
          }}
          defaultValue={
            role?.departments?.map((d) => ({
              id: d.id,
              title: d.name,
            })) || []
          }
          onChange={(vals) =>
            setValues((prev) => ({
              ...prev,
              departments: vals.map((val) => +val.id),
            }))
          }
          isDisable={isShowMode}
          errorMessage={
            errors.departments ||
            values.departments
              ?.map((_: any, i: number) => (errors as any)[`departments.${i}`])
              .filter(Boolean)
              .join(", ")
          }
        />
      </div>
      <div className="mt-3">
        <SelectSearchCustom
          title="دسترسی ها"
          placeholder="انتخاب"
          isMultiSelect={true}
          requestSelectOptions={async () => {
            const acessesRes = await apiCRUD({
              urlSuffix: `admin-panel/user/permissions`,
              requiresToken: true,
            });
            if (acessesRes?.status === "success") {
              return acessesRes.data?.map((item: Permission) => ({
                id: item.id,
                title: item.display_name,
                helperValue: item.name,
              }));
            }
            return [];
          }}
          defaultValue={
            role?.permissions?.map((p) => ({
              id: p.id,
              title: p.display_name,
              helperValue: p.name,
            })) || []
          }
          onChange={(vals) =>
            setValues((prev) => ({
              ...prev,
              permissions: vals.map((val) => val.helperValue!),
            }))
          }
          isDisable={isShowMode}
          errorMessage={
            errors.permissions ||
            values.permissions
              ?.map((_: any, i: number) => (errors as any)[`permissions.${i}`])
              .filter(Boolean)
              .join(", ")
          }
        />
      </div>
      <div className="mb-3 mt-8 flex justify-end gap-2">
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
