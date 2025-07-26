"use client";

import { Button } from "@heroui/button";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { useDisclosure } from "@heroui/modal";
import FormPages from "@/app/panel/pages/_components/FormPages";
import ProtectComponent from "@/components/wrappers/ProtectComponent";

export default function HeaderPages() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-5">
      <ProtectComponent
        permission="pagesCreate"
        component={
          <Button
            onPress={onOpen}
            color="secondary"
            className="h-[40px] rounded-[5px] bg-accent-2 p-[0_30px] text-[16px] font-[600] text-accent-2-foreground"
          >
            ساخت صفحه جدید
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
        modalHeader={<h2>ساخت صفحه جدید</h2>}
        modalBody={<FormPages onClose={onOpenChange} />}
      />
      <div></div>
    </div>
  );
}
