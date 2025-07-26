import { navMenu } from "@/constants/menus";
import { useGlobalData } from "@/contexts/GlobalData";
import { usePathname, useRouter } from "next/navigation";
import { Fragment } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/snippets/accordion";

export default function MobileMenu({
  changeBurgerOpen,
}: {
  changeBurgerOpen: (val: boolean) => void;
}) {
  const pathname = usePathname();
  const globalData = useGlobalData();
  const router = useRouter();

  const handleLinkClick = (link: string) => {
    changeBurgerOpen(false);
    router.push(link);
  };

  return (
    <div>
      <nav className="mt-12">
        <ul className="flex flex-col gap-1">
          {navMenu?.map((item) => (
            <li
              key={item.id}
              className={`${
                (item.link !== "/" && pathname.startsWith(item.link)) ||
                (pathname === "/" && item.link === "/")
                  ? "text-primary"
                  : ""
              }`}
            >
              {item.nameEn === "categs" ? (
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="my-0.5 flex h-5 items-center text-nowrap rounded-xl !border-b-0 px-5 py-6 text-TextSize500 text-TextColor transition-colors">
                      {item.name}
                    </AccordionTrigger>
                    <AccordionContent className="bg-boxBg250">
                      <ul className="flex flex-col gap-1">
                        {globalData?.initials?.categories
                          ?.filter((category) => category.type === "product")
                          .map((category) => (
                            <Fragment key={category.slug}>
                              {category.childs?.length > 0 ? (
                                <Accordion type="single" collapsible>
                                  <AccordionItem value="sub-item-1">
                                    <AccordionTrigger className="px-5">
                                      <li className="cursor-pointer py-2 text-TextColor hover:text-primary">
                                        {category.name}
                                      </li>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <ul className="pl-8">
                                        {category.childs.map((subCat) => (
                                          <li
                                            key={subCat.id}
                                            className="cursor-pointer px-8 py-2 text-TextColor hover:text-primary"
                                            onClick={() =>
                                              handleLinkClick(
                                                `/shop/category/${subCat.slug}`,
                                              )
                                            }
                                          >
                                            {subCat.name}
                                          </li>
                                        ))}
                                      </ul>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              ) : (
                                <li
                                  className="cursor-pointer px-8 py-2 text-TextColor hover:text-primary"
                                  onClick={() => {
                                    handleLinkClick(
                                      `/shop/category/${category.slug}`,
                                    );
                                  }}
                                >
                                  {category.name}
                                </li>
                              )}
                            </Fragment>
                          ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item">
                      <AccordionTrigger
                        onClick={() => handleLinkClick(item.link)}
                        className="my-0.5 flex h-5 items-center text-nowrap rounded-xl !border-b-0 px-5 py-6 text-TextSize500 text-TextColor transition-colors [&>svg]:hidden"
                      >
                        {item.name}
                      </AccordionTrigger>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
