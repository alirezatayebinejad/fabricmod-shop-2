import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type BreadcrumbProps = {
  items: {
    title: string;
    link?: string;
  }[];
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="py-[5px]" aria-label="breadcrumb">
      <ol className="flex flex-wrap space-x-2 text-TextColor">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-1">
                <ChevronLeft className="w-4 text-TextLow" />
              </span>
            )}
            {index < items.length - 1 ? (
              item.link ? (
                <Link
                  prefetch={false}
                  href={item.link}
                  className="text-TextSize400 transition-colors hover:text-TextMute max-sm:text-TextSize300"
                >
                  {item.title}
                </Link>
              ) : (
                <p className="text-TextColor max-sm:text-TextSize300">
                  {item.title}
                </p>
              )
            ) : (
              <p className="font-semibold text-TextColor max-sm:text-TextSize300">
                {item.title}
              </p>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
