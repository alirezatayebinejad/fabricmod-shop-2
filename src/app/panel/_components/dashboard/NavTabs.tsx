"use client";
import Link from "next/link";
import { panelMenus, PanelMenu } from "@/constants/menus";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/snippets/accordion";
import Image from "next/image";
import { ScrollArea } from "@/components/snippets/scroll-area";
import { usePathname, useSearchParams } from "next/navigation";
import { useSidebarToggle } from "@/app/panel/_contexts/SidebarToggle";

export default function NavTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathSegments = pathname.split("/");
  const { closeMobileSidebar } = useSidebarToggle();
  const currentTab = searchParams.get("tab");

  return (
    <ScrollArea className="h-[calc(100dvh_-_192px_-_60px_-_10px)] rounded-[5px]">
      {/* scroll height: dynamic view height - sidebarHeader - sidebarFooter - dashboard margin */}
      <div className="m-[10px_18px_11px_19px]">
        <Accordion type="single" collapsible defaultValue={pathSegments[2]}>
          {panelMenus?.map((item: PanelMenu) => (
            <AccordionItem
              value={`${item.nameEn}`}
              key={item.id}
              dir="rtl"
              className="mt-1 border-none"
            >
              <Link
                prefetch={false}
                href={item.link}
                onClick={() => closeMobileSidebar()}
                className={`flex h-[48px] w-full items-center gap-[8px] rounded-[5px] px-[8px] hover:bg-primary-100 ${pathSegments[2] === item.nameEn ? "bg-primary-100" : ""}`}
              >
                <Image
                  src={item.iconSrc}
                  alt={item.name}
                  width={19}
                  height={19}
                  className="h-[19px]"
                />
                <AccordionTrigger
                  nodownicon={!(item.subMenu?.length > 0)}
                  className="h-[48px] text-TextSize400 font-[600] text-TextColor"
                >
                  {item.name}
                </AccordionTrigger>
              </Link>
              {item.subMenu?.length > 0 && (
                <AccordionContent>
                  <Accordion
                    type="single"
                    collapsible
                    className='relative mr-[34px] mt-[4px] pr-[8px] before:absolute before:bottom-[0px] before:right-0 before:top-[0px] before:z-0 before:mb-[25px] before:mt-[25px] before:w-[1px] before:bg-boxBg400 before:content-[""]'
                  >
                    {item.subMenu.map((sub) => (
                      <div
                        className="mr-[-17px] flex items-center"
                        key={sub.id}
                      >
                        {currentTab === sub.nameEn ||
                        pathSegments[3] === sub.nameEn ? (
                          <Image
                            src={"/icons/listIconActive.svg"}
                            alt={"list icon"}
                            width={19}
                            height={19}
                            className="z-10"
                          />
                        ) : (
                          <Image
                            src={"/icons/listIcon.svg"}
                            alt={"list icon"}
                            width={19}
                            height={19}
                            className="z-10"
                          />
                        )}
                        <AccordionItem
                          value={`${sub.id}`}
                          className="flex-1 border-none"
                        >
                          <Link
                            prefetch={false}
                            href={sub.link}
                            className={`my-[7px] flex h-[32px] w-full gap-[8px] rounded-[5px] px-[8px] text-TextColor hover:bg-boxBg250 ${currentTab === sub.nameEn || pathSegments[3] === sub.nameEn ? "!bg-boxBg250" : ""}`}
                          >
                            {/*   <Image
                              src={sub.iconSrc}
                              alt={sub.name}
                              width={16}
                              height={16}
                            /> */}
                            <AccordionTrigger
                              nodownicon={true}
                              className="text-TextSize400 font-[700]"
                            >
                              {sub.name}
                            </AccordionTrigger>
                          </Link>
                        </AccordionItem>
                      </div>
                    ))}
                  </Accordion>
                </AccordionContent>
              )}
            </AccordionItem>
          ))}
          {/* just some space at the end of the scroll */}
          <div className="pb-20"></div>
        </Accordion>
      </div>
    </ScrollArea>
  );
}
