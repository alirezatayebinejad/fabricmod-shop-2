"use client";

import { Button } from "@heroui/button";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { useDisclosure } from "@heroui/modal";
import FormAttributes from "@/app/panel/attributes/_components/FormAttributes";
import ProtectComponent from "@/components/wrappers/ProtectComponent";

export default function HeaderAttributes() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-5">
      <ProtectComponent
        permission="attributesCreate"
        component={
          <Button
            onPress={onOpen}
            className="h-[40px] rounded-[5px] bg-accent-2 p-[0_30px] text-[16px] font-[600] text-accent-1-foreground"
          >
            ساخت ویژگی جدید
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
        modalHeader={<h2>ساخت ویژگی جدید</h2>}
        modalBody={<FormAttributes onClose={onOpenChange} />}
      />
      <div></div>
    </div>
  );
}
