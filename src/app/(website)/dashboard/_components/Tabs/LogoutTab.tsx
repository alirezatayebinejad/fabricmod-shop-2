"use client";
import { logout } from "@/services/auth";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

export default function LogoutTab() {
  const router = useRouter();
  return (
    <div className="flex h-[75vh] items-center justify-center">
      <div className="bg-boxBg450 flex w-full max-w-[400px] flex-col items-center justify-center gap-12 rounded-[32px] px-3 py-16">
        <h2>از حساب کاربری خود خارج شوید ؟</h2>
        <Button
          className="w-full max-w-[256px] bg-failure text-destructive-foreground"
          onPress={() => logout(router)}
        >
          خروج
        </Button>
      </div>
    </div>
  );
}
