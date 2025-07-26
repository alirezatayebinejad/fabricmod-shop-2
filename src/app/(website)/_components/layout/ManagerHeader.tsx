import ProtectComponent from "@/components/wrappers/ProtectComponent";
import { useUserContext } from "@/contexts/UserContext";
import { Box, House, PencilLine, Settings, Store, User } from "lucide-react";
import Link from "next/link";

export default function ManagerHeader() {
  const { user } = useUserContext();

  return (
    <div className="scrollbar h-[33px] items-center overflow-x-auto bg-boxBg400 px-2">
      <div className="flex h-full w-full min-w-[500px] justify-between gap-10">
        <div className="flex">
          <Link prefetch={false} href="/panel/dashboard" className="h-full">
            <div className="flex h-full items-center gap-1 px-2 hover:bg-boxBg500">
              <House className="w-4 text-TextColor max-md:w-3" />
              <p className="whitespace-nowrap max-md:text-TextSize300">
                پنل مدیریت
              </p>
            </div>
          </Link>
          <ProtectComponent
            permission="productsEdit"
            component={
              <Link
                prefetch={false}
                href="/panel/products/lists"
                className="h-full"
              >
                <div className="flex h-full items-center gap-1 px-2 hover:bg-boxBg500">
                  <Store className="w-4 text-TextColor max-md:w-3" />
                  <p className="whitespace-nowrap max-md:text-TextSize300">
                    ویرایش محصولات
                  </p>
                </div>
              </Link>
            }
          />
          <ProtectComponent
            permission="postsCreate"
            component={
              <Link
                prefetch={false}
                href="/panel/posts/write"
                className="h-full"
              >
                <div className="flex h-full items-center gap-1 px-2 hover:bg-boxBg500">
                  <PencilLine className="w-4 text-TextColor max-md:w-3" />
                  <p className="whitespace-nowrap max-md:text-TextSize300">
                    نوشتن مقاله
                  </p>
                </div>
              </Link>
            }
          />
          <Link prefetch={false} href="/panel/orders" className="h-full">
            <div className="flex h-full items-center gap-1 px-2 hover:bg-boxBg500">
              <Box className="w-4 text-TextColor max-md:w-3" />
              <p className="whitespace-nowrap max-md:text-TextSize300">
                سفارشات
              </p>
            </div>
          </Link>
        </div>
        <div className="flex">
          <ProtectComponent
            permission="settingInfo"
            component={
              <Link
                prefetch={false}
                href="/panel/settings?tab=info"
                className="h-full"
              >
                <div className="flex h-full items-center gap-1 px-2 hover:bg-boxBg500">
                  <p className="whitespace-nowrap max-md:text-TextSize300">
                    تنظیمات
                  </p>
                  <Settings className="w-4 text-TextColor max-md:w-3" />
                </div>
              </Link>
            }
          />
          <Link prefetch={false} href="/panel/profile" className="h-full">
            <div className="flex h-full items-center gap-1 px-2 hover:bg-boxBg500">
              <p className="whitespace-nowrap max-md:text-TextSize300">
                {user?.name}
              </p>
              <User className="w-4 text-TextColor max-md:w-3" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
