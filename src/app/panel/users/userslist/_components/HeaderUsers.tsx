"use client";

import { Button } from "@heroui/button";
import { useFiltersContext } from "@/contexts/SearchFilters";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { useDisclosure } from "@heroui/modal";
import { UsersRound } from "lucide-react";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";
import UserForm from "@/app/panel/users/userslist/_components/UserForm";
import { useEffect, useState } from "react";
import { RoleIndex } from "@/types/apiTypes";
import apiCRUD from "@/services/apiCRUD";
import ProtectComponent from "@/components/wrappers/ProtectComponent";

export default function HeaderUsers() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { changeFilters, getFilterValue, deleteFilter } = useFiltersContext();
  const roleFilterValue = getFilterValue("role");
  const [roles, setRoles] = useState<RoleIndex[]>([]);

  const requestSelectOptions = async () => {
    const response = await apiCRUD({
      urlSuffix: `admin-panel/user/roles?per_page=all`,
    });
    setRoles(response?.data?.roles);
    return response?.data?.roles?.map((role: RoleIndex) => ({
      id: role.id,
      title: role.display_name,
      helperValue: role.name,
    }));
  };

  useEffect(() => {
    const fetchRoles = async () => {
      await requestSelectOptions();
    };
    fetchRoles();
  }, []);

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-5">
      <ProtectComponent
        permission="categoryCreate"
        component={
          <Button
            onPress={onOpen}
            color="secondary"
            className="h-[40px] rounded-[5px] bg-accent-2 p-[0_30px] text-[16px] font-[600] text-accent-2-foreground"
          >
            ساخت کاربر جدید
          </Button>
        }
      />
      <ModalWrapper
        disclosures={{
          isOpen,
          onOpenChange,
          onOpen,
        }}
        size="5xl"
        modalHeader={<h2>ساخت کاربر جدید</h2>}
        modalBody={<UserForm onClose={onOpenChange} />}
      />
      <div className="flex flex-wrap-reverse gap-3 md:flex-nowrap">
        <div dir="ltr" className="min-w-[200px]">
          <SelectSearchCustom
            requestSelectOptions={requestSelectOptions}
            value={
              roleFilterValue
                ? [
                    {
                      id: roleFilterValue,
                      title:
                        roles.find((role) => role.name === roleFilterValue)
                          ?.display_name || "",
                    },
                  ]
                : []
            }
            onChange={(selected) => {
              if (
                selected.length > 0 &&
                selected[0].helperValue !== undefined
              ) {
                changeFilters("role=" + selected[0].helperValue);
              } else {
                deleteFilter("role");
              }
            }}
            isSearchDisable
            placeholder="انتخاب نقش"
            endContent={<UsersRound className="w-5 text-TextLow" />}
            classNames={{
              container: "min-w-[200px] min-h-[40px]",
            }}
          />
        </div>
      </div>
    </div>
  );
}
