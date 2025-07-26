"use client";
import React, { ReactNode } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { cn } from "@/utils/twMerge";

type ModalWrapperProps = {
  modalClassNames?: {
    closeButton?: string;
    content?: string;
    header?: string;
    body?: string;
    button?: string;
  };
  size?:
    | "4xl"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "5xl"
    | "full"
    | undefined;
  modalBody: ReactNode;
  modalHeader?: ReactNode;
  isDismissable?: boolean;
  disclosures?: {
    isOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onOpenChange?: () => void;
    isControlled?: boolean;
    getButtonProps?: (props?: any) => any;
    getDisclosureProps?: (props?: any) => any;
  };
};

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  modalClassNames = {},
  modalBody,
  modalHeader,
  disclosures,
  size,
  isDismissable = false,
}) => {
  return (
    <>
      <Modal
        isOpen={disclosures?.isOpen}
        onOpenChange={disclosures?.onOpenChange}
        isDismissable={isDismissable}
        size={size || "4xl"}
        placement="center"
        className={cn("rounded-[12px]", modalClassNames.content)}
        scrollBehavior="outside"
        classNames={{
          closeButton: cn(
            "!left-[23px] right-auto p-[2px] top-[20px] border-1 bg-transparent border-TextColor text-TextColor",
            modalClassNames.closeButton,
          ),
          body: cn("py-5", modalClassNames.body),
        }}
      >
        <ModalContent>
          {() => (
            <>
              {modalHeader && (
                <ModalHeader
                  className={cn(
                    "mt-2 text-[14px] font-[600]",
                    modalClassNames.header,
                  )}
                >
                  {modalHeader}
                </ModalHeader>
              )}
              <ModalBody>{modalBody}</ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalWrapper;
