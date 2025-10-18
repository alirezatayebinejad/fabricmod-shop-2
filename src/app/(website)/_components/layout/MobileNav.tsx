"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBasket, Home, User, Store, Search } from "lucide-react";
import { Button } from "@heroui/button";
import { usePathname, useRouter } from "next/navigation";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import InputBasic from "@/components/inputs/InputBasic";
import { useFiltersContext } from "@/contexts/SearchFilters";

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { changeFilters } = useFiltersContext();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    const term = searchTerm.trim();
    if (!term) return;
    if (pathname.startsWith("/shop")) {
      changeFilters("search=" + term);
    } else {
      router.push(`/shop?search=${encodeURIComponent(term)}&page=1`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="fixed bottom-0 left-0 right-0 z-40 h-[60px] rounded-tl-[35px] rounded-tr-[35px] border-1 border-border bg-boxBg100 shadow-[0_0_25px_#00000015] sm:hidden">
      <nav className="flex h-full items-center justify-around">
        <Button
          as={Link}
          href="/"
          variant={"light"}
          isIconOnly
          className="flex flex-col items-center text-TextSize500"
        >
          <Home
            className={`w-6 ${pathname === "/" ? "text-primary" : "text-TextColor"}`}
          />
        </Button>
        <Popover placement="bottom" showArrow={true}>
          <PopoverTrigger>
            <Button
              variant={"light"}
              isIconOnly
              className="flex flex-col items-center text-TextSize500"
            >
              <Search className={`w-6 text-TextColor`} />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-2 max-md:px-20">
              <InputBasic
                name="search"
                type="search"
                placeholder="بنويسيد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                endContent={
                  <p
                    className="cursor-pointer rounded-lg border-1 border-border2 p-1 text-TextLow hover:bg-boxBg400"
                    onClick={handleSearch}
                  >
                    جستجو
                  </p>
                }
              />
            </div>
          </PopoverContent>
        </Popover>
        <Button
          as={Link}
          variant={"light"}
          isIconOnly
          href="/shop"
          className="flex flex-col items-center text-TextSize500"
        >
          <Store
            className={`w-6 ${pathname.startsWith("/shop") ? "text-primary" : "text-TextColor"}`}
          />
        </Button>
        <Button
          as={Link}
          variant={"light"}
          isIconOnly
          href="/cart"
          className="flex flex-col items-center text-TextSize500"
        >
          <ShoppingBasket
            className={`w-6 ${pathname === "/cart" ? "text-primary" : "text-TextColor"}`}
          />
        </Button>
        <Button
          as={Link}
          variant={"light"}
          isIconOnly
          href="/dashboard"
          className="flex flex-col items-center text-TextSize500"
        >
          <User
            className={`w-6 ${pathname === "/dashboard" ? "text-primary" : "text-TextColor"}`}
          />
        </Button>
      </nav>
    </section>
  );
}
