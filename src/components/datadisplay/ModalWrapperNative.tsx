"use client";
import React, { ReactNode, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { cn } from "@/utils/twMerge";
import { X } from "lucide-react";

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
    onOpenChange?: (isOpen: boolean) => void;
    isControlled?: boolean;
    getButtonProps?: (props?: any) => any;
    getDisclosureProps?: (props?: any) => any;
  };
};

const sizeClasses: Record<string, string> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  full: "w-full h-full",
};

const ModalWrapperNative: React.FC<ModalWrapperProps> = ({
  modalClassNames = {},
  modalBody,
  modalHeader,
  disclosures,
  size,
  isDismissable = false,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  const isOpen = disclosures?.isOpen ?? false;

  // ESC to close
  useEffect(() => {
    if (!isOpen || !isDismissable) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disclosures?.onClose?.();
        disclosures?.onOpenChange?.(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line
  }, [isOpen, isDismissable]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDismissable && e.target === overlayRef.current) {
      disclosures?.onClose?.();
      disclosures?.onOpenChange?.(false);
    }
  };

  const content = (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        className={cn(
          "relative max-h-[calc(100vh-4rem)] w-full overflow-y-auto rounded-[12px] bg-boxBg100 shadow-lg",
          sizeClasses[size || "4xl"],
          modalClassNames.content,
        )}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => {
            disclosures?.onClose?.();
            disclosures?.onOpenChange?.(false);
          }}
          className={cn(
            "absolute !left-[23px] right-auto top-[20px]",
            modalClassNames.closeButton,
          )}
        >
          <X />
        </button>

        {/* Header */}
        {modalHeader && (
          <div
            className={cn(
              "mt-2 px-4 text-[14px] font-[600]",
              modalClassNames.header,
            )}
          >
            {modalHeader}
          </div>
        )}

        {/* Body */}
        <div className={cn("px-4 py-5", modalClassNames.body)}>{modalBody}</div>
      </div>
    </div>
  );

  // Render portal into body
  return ReactDOM.createPortal(content, document.body);
};

export default ModalWrapperNative;
