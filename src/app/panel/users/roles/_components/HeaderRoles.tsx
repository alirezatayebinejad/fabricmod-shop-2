"use client";

import { Button } from "@heroui/button";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { useDisclosure } from "@heroui/modal";
import FormRoles from "@/app/panel/users/roles/_components/FormRoles";

export default function HeaderRoles() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-5">
      <Button
        onPress={onOpen}
        color="secondary"
        className="h-[40px] rounded-[5px] bg-accent-2 p-[0_30px] text-[16px] font-[600] text-accent-2-foreground"
      >
        ساخت نقش جدید
      </Button>
      <ModalWrapper
        disclosures={{
          isOpen,
          onOpenChange,
          onOpen,
        }}
        size="xl"
        modalHeader={<h2>ساخت نقش جدید</h2>}
        modalBody={<FormRoles onClose={onClose} />}
      />
    </div>
  );
}
