"use client";

import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";
import InputBasic from "@/components/inputs/InputBasic";
import { useFiltersContext } from "@/contexts/SearchFilters";
import apiCRUD from "@/services/apiCRUD";
import { useState } from "react";
import { Search } from "lucide-react";
import { OrderIndex, UserIndex } from "@/types/apiTypes";

export default function HeaderTransactions() {
  const { changeFilters, getFilterValue, deleteFilter } = useFiltersContext();
  const gatewayNameFilterValue = getFilterValue("gateway_name");
  const statusFilterValue = getFilterValue("status");
  const userCellphoneFilterValue = getFilterValue("user_cellphone");
  const orderUuidFilterValue = getFilterValue("order_uuid");
  const userIdFilterValue = getFilterValue("user_id");

  const [userCellphone, setUserCellphone] = useState(
    userCellphoneFilterValue || "",
  );

  const handleSearch = () => {
    if (userCellphone) {
      changeFilters("user_cellphone=" + userCellphone);
    } else {
      deleteFilter("user_cellphone");
    }
  };
  return (
    <div className="mb-6 flex flex-col gap-5">
      <div className="flex flex-wrap justify-between gap-4">
        {/* user_cellphone filter (search input) */}
        <InputBasic
          name="user_cellphone"
          type="search"
          placeholder="جستجو شماره موبایل کاربر..."
          onChange={(e) => setUserCellphone(e.target.value)}
          value={userCellphone}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          endContent={
            <Search
              className="cursor-pointer text-TextMute"
              onClick={handleSearch}
            />
          }
        />
      </div>
      <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1">
        {/* gateway_name filter */}
        <SelectSearchCustom
          options={[
            { id: "cash", title: "نقدی" },
            { id: "card", title: "کارت" },
            { id: "admin", title: "ادمین" },
          ]}
          isSearchDisable
          title="درگاه پرداخت"
          onChange={(selected) => {
            if (selected.length > 0 && selected[0].id !== undefined) {
              changeFilters("gateway_name=" + selected[0].id);
            } else {
              deleteFilter("gateway_name");
            }
          }}
          defaultValue={
            gatewayNameFilterValue
              ? [
                  {
                    id: gatewayNameFilterValue,
                    title:
                      gatewayNameFilterValue === "cash"
                        ? "نقدی"
                        : gatewayNameFilterValue === "card"
                          ? "کارت"
                          : gatewayNameFilterValue === "admin"
                            ? "ادمین"
                            : "",
                  },
                ]
              : undefined
          }
        />

        {/* status filter */}
        <SelectSearchCustom
          options={[
            { id: "pending", title: "در انتظار" },
            { id: "success", title: "موفق" },
          ]}
          isSearchDisable
          title="وضعیت"
          onChange={(selected) => {
            if (selected.length > 0 && selected[0].id !== undefined) {
              changeFilters("status=" + selected[0].id);
            } else {
              deleteFilter("status");
            }
          }}
          defaultValue={
            statusFilterValue
              ? [
                  {
                    id: statusFilterValue,
                    title:
                      statusFilterValue === "pending"
                        ? "در انتظار"
                        : statusFilterValue === "success"
                          ? "موفق"
                          : "",
                  },
                ]
              : undefined
          }
        />

        {/* order_uuid filter (select search) */}
        <SelectSearchCustom
          requestSelectOptions={async (search) => {
            const res = await apiCRUD({
              urlSuffix: `admin-panel/users?${search ? "search" + search : "per_page=10"}`,
            });
            if (res?.status === "success") {
              return res.data?.orders?.map((item: OrderIndex) => ({
                id: item.id,
                title: item.uuid,
                description: item.user.cellphone + "-" + item.user.name,
              }));
            }
            return [];
          }}
          isSearchFromApi
          isSearchDisable={false}
          title="کد سفارش"
          value={
            orderUuidFilterValue
              ? [
                  {
                    id: orderUuidFilterValue,
                    title: orderUuidFilterValue,
                  },
                ]
              : []
          }
          onChange={(selected) => {
            if (selected.length > 0 && selected[0].id !== undefined) {
              changeFilters("order_uuid=" + selected[0].id);
            } else {
              deleteFilter("order_uuid");
            }
          }}
          placeholder="جستجو کد سفارش"
        />

        {/* user_id filter (select search) */}
        <SelectSearchCustom
          requestSelectOptions={async (search) => {
            const res = await apiCRUD({
              urlSuffix: `admin-panel/users?${search ? "search" + search : "per_page=10"}`,
            });
            if (res?.status === "success") {
              return res.data?.users?.map((item: UserIndex) => ({
                id: item.id,
                title: item.name,
                description: item.cellphone,
              }));
            }
            return [];
          }}
          isSearchFromApi
          isSearchDisable={false}
          title="کاربر"
          value={
            userIdFilterValue
              ? [
                  {
                    id: userIdFilterValue,
                    title: userIdFilterValue,
                  },
                ]
              : []
          }
          onChange={(selected) => {
            if (selected.length > 0 && selected[0].id !== undefined) {
              changeFilters("user_id=" + selected[0].id);
            } else {
              deleteFilter("user_id");
            }
          }}
          placeholder="جستجو کاربر"
        />
      </div>
    </div>
  );
}
