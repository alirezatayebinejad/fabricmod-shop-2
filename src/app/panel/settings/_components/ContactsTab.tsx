import { Button } from "@heroui/button";
import InputBasic from "@/components/inputs/InputBasic";
import { X } from "lucide-react";
import useMyForm from "@/hooks/useMyForm";
import apiCRUD from "@/services/apiCRUD";
import { useSWRConfig } from "swr";
import MapCustom from "@/components/inputs/MapCustom";
import { Setting } from "@/types/apiTypes";

type Address = Setting["addresses"][number];

type Telephone = Setting["telephones"][number];

type Social = Setting["socials"][number];

export default function ContactsTab({ setting }: { setting: Setting }) {
  const { mutate } = useSWRConfig();
  const { values, handleSubmit, setValues, loading, setErrors } = useMyForm(
    {
      addresses: setting.addresses || [],
      telephones: setting.telephones || [],
      socials: setting.socials || [],
    },
    async (formData) => {
      const res = await apiCRUD({
        urlSuffix: `admin-panel/settings`,
        method: "POST",
        updateCacheByTag: "initials",
        data: { ...formData, _method: "put" },
      });
      if (res?.message) setErrors(res.message);
      if (res?.status === "success") {
        mutate("admin-panel/settings");
      }
    },
  );

  const handleAddField = (field: "addresses" | "telephones" | "socials") => {
    setValues((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field])
        ? [
            ...(prev[field] as Address[] | Telephone[] | Social[]),
            field === "addresses"
              ? { name: "", value: "", latitude: "", longitude: "" }
              : field === "socials"
                ? { name: "", value: "", icon: "" }
                : { name: "", value: null },
          ]
        : [],
    }));
  };

  const handleRemoveField = (
    field: "addresses" | "telephones" | "socials",
    index: number,
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field])
        ? (prev[field] as Address[] | Telephone[] | Social[]).filter(
            (_, i) => i !== index,
          )
        : [],
    }));
  };

  const handleFieldChange = (
    field: "addresses" | "telephones" | "socials",
    index: number,
    key: string,
    value: string,
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field])
        ? (prev[field] as Address[] | Telephone[] | Social[]).map((item, i) =>
            i === index ? { ...item, [key]: value } : item,
          )
        : [],
    }));
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4">
        {["addresses", "telephones", "socials"].map((field) => (
          <div key={field} className="border-b-2 py-5">
            <h2 className="mb-3 font-bold">
              {field === "addresses"
                ? "آدرس‌ها"
                : field === "telephones"
                  ? "تلفن‌ها"
                  : "شبکه‌های اجتماعی"}
            </h2>
            {Array.isArray(
              values[field as "addresses" | "telephones" | "socials"],
            ) &&
              (
                values[field as "addresses" | "telephones" | "socials"] as
                  | Address[]
                  | Telephone[]
                  | Social[]
              ).map((item, index) => (
                <div key={index}>
                  <div className="flex items-center gap-2 py-2">
                    <InputBasic
                      name={`${field}[${index}].name`}
                      label={"نام" + " " + (index + 1)}
                      value={item.name}
                      onChange={(e) =>
                        handleFieldChange(
                          field as "addresses" | "telephones" | "socials",
                          index,
                          "name",
                          e.target.value,
                        )
                      }
                    />
                    <div className="flex-1">
                      <InputBasic
                        name={`${field}[${index}].value`}
                        label={"مقدار" + " " + (index + 1)}
                        value={item.value || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            field as "addresses" | "telephones" | "socials",
                            index,
                            "value",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    {field === "socials" && (
                      <div className="flex-1">
                        <InputBasic
                          name={`${field}[${index}].icon`}
                          label={"آیکون" + " " + (index + 1)}
                          value={("icon" in item ? item.icon : "") || ""}
                          onChange={(e) =>
                            handleFieldChange(
                              field as "socials",
                              index,
                              "icon",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    )}
                    <Button
                      type="button"
                      onPress={() =>
                        handleRemoveField(
                          field as "addresses" | "telephones" | "socials",
                          index,
                        )
                      }
                      variant="light"
                      size="sm"
                      className="gap-1 font-[500] text-destructive-foreground hover:!bg-destructive"
                    >
                      <X className="w-4" />
                      حذف
                    </Button>
                  </div>
                  {field === "addresses" && (
                    <MapCustom
                      key={"field" + Math.random()}
                      selectMode={true}
                      onChange={({ lat, long }) => {
                        handleFieldChange(
                          field,
                          index,
                          "latitude",
                          lat.toString(),
                        );
                        handleFieldChange(
                          field,
                          index,
                          "longitude",
                          long.toString(),
                        );
                      }}
                      classNames={{ container: "max-w-[400px]" }}
                      markerData={[
                        {
                          lat: parseFloat((item as Address).latitude),
                          long: parseFloat((item as Address).longitude),
                        },
                      ]}
                    />
                  )}
                </div>
              ))}
            <Button
              type="button"
              onPress={() =>
                handleAddField(field as "addresses" | "telephones" | "socials")
              }
              className="mt-2"
            >
              افزودن{" "}
              {field === "addresses"
                ? "آدرس"
                : field === "telephones"
                  ? "تلفن"
                  : "شبکه اجتماعی"}
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-end">
        <Button
          type="submit"
          color="primary"
          isLoading={loading}
          className="rounded-lg px-6"
        >
          ذخیره
        </Button>
      </div>
    </form>
  );
}
