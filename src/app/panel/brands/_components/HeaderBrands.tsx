"use client";

import { Button } from "@heroui/button";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { useDisclosure } from "@heroui/modal";
import FormBrands from "@/app/panel/brands/_components/FormBrands";
import ProtectComponent from "@/components/wrappers/ProtectComponent";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { useState } from "react";
import { Search } from "lucide-react";
import InputBasic from "@/components/inputs/InputBasic";

export default function HeaderBrands() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { changeFilters, deleteFilter } = useFiltersContext();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (search) {
      changeFilters("search=" + search);
    } else {
      deleteFilter("search");
    }
  };
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-5">
      <ProtectComponent
        permission="brandsCreate"
        component={
          <Button
            onPress={onOpen}
            color="secondary"
            className="h-[40px] rounded-[5px] bg-accent-2 p-[0_30px] text-[16px] font-[600] text-accent-2-foreground"
          >
            ساخت برند جدید
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
        modalHeader={<h2>ساخت برند جدید</h2>}
        modalBody={<FormBrands onClose={onOpenChange} />}
      />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-5">
        <InputBasic
          name="search"
          type="search"
          placeholder="جستجو..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
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
    </div>
  );
}
