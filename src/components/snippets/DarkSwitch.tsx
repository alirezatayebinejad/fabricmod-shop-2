"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@heroui/button";
import { Moon, Sun } from "lucide-react";

type DarkSwitchProps = {
  type: "button" | "switch";
};

export default function DarkSwitch({ type }: DarkSwitchProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [isChecked, setIsChecked] = useState(resolvedTheme === "dark");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleToggle = () => {
    setIsChecked((prev) => !prev);
    setTheme(isChecked ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <div>
      {type === "button" ? (
        <Button variant="light" onPress={handleToggle} isIconOnly>
          {isChecked ? (
            <Moon className="w-5 text-TextColor" />
          ) : (
            <Sun className="w-5 text-TextColor" />
          )}
        </Button>
      ) : (
        <div
          onClick={handleToggle}
          className="relative flex h-[24px] w-[58px] cursor-pointer items-center justify-around rounded-full bg-primary-200 p-1"
        >
          <Image src={"/icons/sun.svg"} alt="sun" width={16} height={16} />
          <Image src={"/icons/moon.svg"} alt="moon" width={16} height={16} />
          <span
            className="absolute left-[8px] top-[4px] h-[16px] w-[16px] rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out"
            style={{
              transform: isChecked ? "translateX(24px)" : "translateX(0)",
            }}
          ></span>
        </div>
      )}
    </div>
  );
}
