import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { Button } from "@heroui/button";

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
  confirmText: React.ReactNode;
  confirmAction: () => void;
  size:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "4xl"
    | "2xl"
    | "3xl"
    | "5xl"
    | "full"
    | undefined;
  onClose: () => void;
};

export default function ConfirmModal({
  isOpen,
  onOpenChange,
  confirmText,
  confirmAction,
  size = "lg",
  onClose,
}: Props) {
  const modalHeader = <h2 className="flex justify-center">تاییدیه</h2>;
  const modalBody = (
    <div className="flex flex-col gap-6 p-2">
      <div className="px-4">{confirmText}</div>
      <div className="flex justify-end gap-2">
        <Button
          color="default"
          variant="flat"
          onPress={() => onOpenChange()}
          className="rounded-[8px]"
        >
          خیر
        </Button>
        <Button
          className="rounded-[8px] bg-primary text-white"
          onPress={() => {
            onOpenChange();
            confirmAction();
          }}
        >
          بله
        </Button>
      </div>
    </div>
  );

  return (
    <ModalWrapper
      modalBody={modalBody}
      modalHeader={modalHeader}
      disclosures={{
        isOpen: isOpen,
        onOpenChange: onOpenChange,
        onClose: onClose,
      }}
      size={size}
    />
  );
}
