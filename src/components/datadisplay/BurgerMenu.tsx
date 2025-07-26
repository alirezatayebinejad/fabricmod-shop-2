import { ScrollArea } from "@/components/snippets/scroll-area";
import { CircleX } from "lucide-react";

type props = {
  children: React.ReactNode;
  isVisible: boolean;
  closeHandler: () => void;
  position?: "left" | "right"; // Added position prop
};

export default function BurgerMenu({
  children,
  closeHandler,
  isVisible,
  position = "right",
}: props) {
  return (
    <div>
      <div
        className={`fixed bottom-0 top-0 z-50 min-w-[250px] max-w-[250px] bg-boxBg100 transition-transform ${
          position === "right"
            ? `right-0 ${isVisible ? "translate-x-0" : "translate-x-[100%]"}`
            : `left-0 ${isVisible ? "translate-x-0" : "translate-x-[-100%]"}`
        }`}
      >
        <div
          onClick={closeHandler}
          className="absolute left-2 top-2 z-50 cursor-pointer"
        >
          <CircleX className="text-TextColor" />
        </div>
        {/* content */}
        <ScrollArea dir="rtl" className="h-dvh">
          {children}
        </ScrollArea>
      </div>
      {/* backdrop */}
      <div
        onClick={() => closeHandler()}
        className={`fixed bottom-0 left-0 right-0 top-0 z-40 bg-[#00000029] ${isVisible ? "" : "hidden"}`}
      ></div>
    </div>
  );
}
