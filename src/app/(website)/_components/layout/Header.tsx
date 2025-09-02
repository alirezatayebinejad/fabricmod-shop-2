"use client";
import MobileMenu from "@/app/(website)/_components/layout/MobileMenu";
import Badge from "@/components/datadisplay/Badge";
import BurgerMenu from "@/components/datadisplay/BurgerMenu";
import TooltipCustom from "@/components/datadisplay/TooltipCustom";
import DarkSwitch from "@/components/snippets/DarkSwitch";
import { navMenu } from "@/constants/menus";
import { Button } from "@heroui/button";
import {
  ChevronDown,
  ChevronLeft,
  FlipHorizontal,
  Heart,
  Menu,
  Search,
  ShoppingBasket,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, Suspense, Fragment } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import InputBasic from "@/components/inputs/InputBasic";
import ManagerHeader from "@/app/(website)/_components/layout/ManagerHeader";
import { useGlobalData } from "@/contexts/GlobalData";
import { useCompare } from "@/contexts/compareContext";
import { useBasket } from "@/contexts/BasketContext";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { useUserContext } from "@/contexts/UserContext";

function HeaderComponent() {
  const globalData = useGlobalData();
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUserContext();
  const { basket } = useBasket();
  const { compares } = useCompare();
  const { changeFilters } = useFiltersContext();

  const [burgerOpen, setBurgerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCatId, setShowCatId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 25);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = () => {
    const term = searchTerm.trim();
    if (term) {
      if (pathname.startsWith("/shop")) {
        changeFilters("search=" + term);
      } else {
        router.push(`/shop?search=${encodeURIComponent(term)}&page=1`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-boxBg100 ${
          isScrolled ? "shadow-md shadow-[#00000007]" : ""
        }`}
      >
        {user?.roles.some(
          (r) => r.name === "admin" || r.name === "super_admin",
        ) && <ManagerHeader />}
        <BurgerMenu
          isVisible={burgerOpen}
          position="right"
          closeHandler={() => setBurgerOpen(false)}
        >
          <MobileMenu
            changeBurgerOpen={(val) => {
              setBurgerOpen(val);
            }}
          />
        </BurgerMenu>

        <div className="mx-auto flex min-h-[100px] max-w-[1550px] items-center justify-between px-[15px] max-md:min-h-[65px] md:px-[50px]">
          <div className="flex items-center gap-3">
            <div
              onClick={() => setBurgerOpen((prev) => !prev)}
              className="flex w-[26px] cursor-pointer items-center gap-0 lg:hidden"
            >
              <Menu className="h-10 w-10 text-TextColor" />
            </div>
            <Link prefetch={false} href={"/"}>
              <Image
                src={
                  globalData?.initials?.setting?.logo
                    ? process.env.NEXT_PUBLIC_IMG_BASE +
                      globalData.initials.setting.logo
                    : "/images/imageplaceholder.png"
                }
                alt="logo"
                width={60}
                height={60}
                className="h-auto w-[60px]"
              />
            </Link>
          </div>
          <div className="max-lg:hidden">
            <nav>
              <ul className="flex items-center gap-7">
                {navMenu?.map((item) => (
                  <li
                    key={item.id}
                    className={`group relative flex items-center gap-1 text-TextSize500 text-TextColor transition-colors hover:text-primary ${(item.link !== "/" && pathname.startsWith(item.link)) || (pathname === "/" && item.link === "/") ? "text-primary" : ""}`}
                  >
                    <Link prefetch={false} href={item.link}>
                      {item.name}
                    </Link>

                    {item.nameEn === "categs" && (
                      <>
                        <ChevronDown className="w-4 text-TextColor group-hover:text-primary" />
                        <div className="absolute left-[-70%] top-[100%] hidden min-w-[180px] pt-2 group-hover:inline-block">
                          <div
                            className="bg-boxBg100 p-3 shadow-md"
                            onMouseLeave={() => setShowCatId(undefined)}
                          >
                            <ul className="flex flex-col">
                              <div className="relative">
                                {globalData?.initials?.categories
                                  ?.filter(
                                    (category) => category.type === "product",
                                  )
                                  .map((category) => (
                                    <Fragment key={category.slug}>
                                      <li
                                        onClick={() => {
                                          if (!(category.childs?.length > 0)) {
                                            router.push(
                                              `/shop/category/${category.slug}`,
                                            );
                                          }
                                        }}
                                        onMouseEnter={() => {
                                          setShowCatId(category.id);
                                        }}
                                        className="flex cursor-pointer justify-between border-b-1 py-2 text-TextColor transition-colors last:border-0 hover:text-primary"
                                        style={{ position: "relative" }}
                                      >
                                        <p>{category.name}</p>
                                        {category.childs?.length > 0 && (
                                          <ChevronLeft className="w-4 text-TextColor" />
                                        )}
                                        {category.childs?.length ? (
                                          <ul
                                            className={`scrollbar absolute right-full top-0 max-h-[calc(100vh_-_150px)] w-[250px] overflow-y-auto bg-boxBg100 p-3 shadow-md ${
                                              showCatId === category.id
                                                ? "inline-block"
                                                : "hidden"
                                            }`}
                                            style={{
                                              marginRight: "12px",
                                              marginLeft: "0px",
                                            }}
                                          >
                                            {category.childs.map((subCat) => (
                                              <Link
                                                prefetch={false}
                                                href={`/shop/category/${subCat.slug}`}
                                                key={subCat.id + "child"}
                                              >
                                                <li className="border-b-1 border-border py-2">
                                                  <p className="hover:text-primary">
                                                    {subCat.name}
                                                  </p>
                                                </li>
                                              </Link>
                                            ))}
                                          </ul>
                                        ) : null}
                                      </li>
                                    </Fragment>
                                  ))}
                              </div>
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="flex flex-wrap items-center justify-end">
            <DarkSwitch type="button" />
            <div className="max-sm:hidden">
              <Popover placement="bottom" showArrow={true}>
                <PopoverTrigger>
                  <Button variant="light" isIconOnly>
                    <Search className="w-[22px] text-TextColor" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="p-2">
                    <InputBasic
                      name="search"
                      type="search"
                      placeholder="جستجو..."
                      ariaLable="جستجو وبلاگ"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleKeyDown}
                      endContent={
                        <Search
                          className="cursor-pointer text-TextMute"
                          onClick={handleSearch}
                        />
                      }
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <TooltipCustom content="مقایسه ها" key="comparisons">
              <Button
                as={Link}
                prefetch={false}
                href="/compare"
                variant="light"
                isIconOnly
              >
                <Badge
                  content={compares?.length.toString()}
                  hideZero
                  key={"compare"}
                >
                  <FlipHorizontal className="w-[22px] text-TextColor" />
                </Badge>
              </Button>
            </TooltipCustom>
            <TooltipCustom content="موردعلاقه ها" key="favorites">
              <Button
                as={Link}
                prefetch={false}
                href="/wishlist"
                variant="light"
                isIconOnly
              >
                <Heart className="w-[22px] text-TextColor" />
              </Button>
            </TooltipCustom>
            <div className="max-sm:hidden">
              <TooltipCustom content="سبد خرید" key="shopping-cart">
                <Button
                  as={Link}
                  prefetch={false}
                  href="/cart"
                  variant="light"
                  isIconOnly
                >
                  <Badge content={basket?.length?.toString()} key={"shop"}>
                    <ShoppingBasket className="w-[22px] text-TextColor" />
                  </Badge>
                </Button>
              </TooltipCustom>
            </div>
            <div className="max-sm:hidden">
              <TooltipCustom content="حساب کاربری" key="user-account">
                <Button
                  variant="light"
                  as={Link}
                  prefetch={false}
                  href="/dashboard"
                  isIconOnly
                >
                  <User className="w-[22px] text-TextColor" />
                </Button>
              </TooltipCustom>
            </div>
            <Button
              variant="solid"
              as={Link}
              href="https://app.fabricmod.com/login"
              className="mr-1 bg-primary-100"
            >
              خرید عمده
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}

export default function Header() {
  return (
    <Suspense>
      <HeaderComponent />
    </Suspense>
  );
}
