"use client";

import DarkSwitch from "@/components/snippets/DarkSwitch";
import { Button } from "@heroui/button";
import Image from "next/image";
import { useDisclosure } from "@heroui/modal";
import { logout } from "@/services/auth";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/datadisplay/ConfirmModal";

export default function SidebarFooter() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const router = useRouter();
  return (
    /* if change h here change h in dashboard navTab ScrollArea too*/
    <div className="h-[60px] border-t-1 border-t-boxBg300 p-[5px_20px_32px_24px] max-md:p-2">
      <div>
        <div className="flex items-center justify-between">
          <Button onPress={onOpen} variant="light" className="px-2">
            <div className="flex gap-[8px]">
              <Image
                className="text-destructive-foreground"
                src={"/icons/logout.svg"}
                alt={"logout"}
                width={21}
                height={21}
              />
              <p className="font-[700] text-destructive-foreground">خروج</p>
            </div>
          </Button>
          <div className="z-50">
            <DarkSwitch type="switch" />
          </div>
        </div>
        <ConfirmModal
          size="lg"
          onClose={onClose}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          confirmText="آیا برای خروج مطمئن هستید؟"
          confirmAction={() => {
            logout(router);
          }}
        />
      </div>
    </div>
  );
}
