"use client";

import { Button } from "@heroui/button";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { useDisclosure } from "@heroui/modal";
import FormCoupons from "@/app/panel/coupons/_components/FormCoupons";
import ProtectComponent from "@/components/wrappers/ProtectComponent";

export default function HeaderCoupons() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-5">
      <ProtectComponent
        permission="couponsCreate"
        component={
          <Button
            onPress={onOpen}
            color="secondary"
            className="h-[40px] rounded-[5px] bg-accent-2 p-[0_30px] text-[16px] font-[600] text-accent-2-foreground"
          >
            ساخت کد تخفیف جدید
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
        modalHeader={<h2>ساخت کد تخفیف جدید</h2>}
        modalBody={<FormCoupons onClose={onOpenChange} />}
      />
      <div></div>
    </div>
  );
}
