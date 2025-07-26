"use client";
import InfoCard from "@/app/panel/dashboard/_components/InfoCard";
import LineChartCustom from "@/app/panel/dashboard/_components/LineChartCustom";
import RequestsChart from "@/app/panel/dashboard/_components/RequestsChart";
import RetryError from "@/components/datadisplay/RetryError";
import SelectBox from "@/components/inputs/SelectBox";
import apiCRUD from "@/services/apiCRUD";
import { DashboardPanel } from "@/types/apiTypes";
import shortenString from "@/utils/shortenString";
import { cn } from "@/utils/twMerge";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

export default function DashboardPagePanel() {
  const [chartMonth, setchartMonth] = useState(6);
  const { data, error, isLoading, mutate } = useSWR(
    `admin-panel/dashboard?mount=${chartMonth}`,
    (url) => apiCRUD({ urlSuffix: url, method: "GET", requiresToken: true }),
  );
  const dashboardData: DashboardPanel = data?.data;

  if (isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[250px]">
        <RetryError onRetry={() => mutate()} />
      </div>
    );
  }

  return (
    <main>
      <div className="pages_wrapper">
        <div className="flex flex-wrap gap-2">
          <div className="my-3.5 mr-2 flex items-center gap-2.5">
            <p>اطلاعات</p>
            <SelectBox
              options={[
                { key: 1, label: "1 ماه" },
                { key: 2, label: "2 ماه" },
                { key: 3, label: "3 ماه" },
                { key: 6, label: "6 ماه" },
                { key: 12, label: "سال گذشته" },
                { key: 24, label: "دو سال گذشته" },
                { key: 48, label: "سه سال گذشته" },
              ]}
              selectedKeys={[chartMonth.toString()]}
              onChange={(e) => setchartMonth(Number(e.target.value))}
              classNames={{
                container: "min-w-[150px]",
                trigger: "border-0 !bg-boxBg250 !rounded-[5px]",
              }}
            />
          </div>
        </div>
        <div className={cn("page_content", "flex flex-col gap-4 border-0")}>
          <div className="flex gap-4">
            <Link
              href="/panel/users/userslist"
              prefetch={false}
              className="w-full cursor-pointer"
            >
              <InfoCard
                name="تعداد مشتریان"
                info={dashboardData?.users_count.toString()}
              />
            </Link>
            <Link
              href="/panel/products/lists"
              prefetch={false}
              className="w-full cursor-pointer"
            >
              <InfoCard
                name="تعداد محصولات"
                info={dashboardData?.products_count.toString()}
              />
            </Link>
            <Link
              href="/panel/posts"
              prefetch={false}
              className="w-full cursor-pointer"
            >
              <InfoCard
                name="تعداد نوشته ها"
                info={dashboardData?.posts_count.toString()}
              />
            </Link>
          </div>

          <div className="flex gap-4 max-md:flex-wrap">
            <div className="border-border1 flex-[0.4] rounded-[12px] border-1">
              <RequestsChart chartData={dashboardData.orders} />
            </div>
            <div className="border-border1 flex-[0.6] rounded-[12px] border-1">
              <LineChartCustom data={dashboardData.chart_transactions} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <div className="border-border1 rounded-[12px] border-1">
              <h3 className="p-2 font-[500] text-secondary">آخرین محصولات</h3>
              {dashboardData?.top_products?.map((item) => (
                <div
                  key={item.id}
                  className="border-border1 m-2 flex items-center justify-between rounded-lg border-1 bg-boxBg200 p-2 transition-colors hover:bg-boxBg300"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-[500]">
                        {shortenString(item?.name, 50, "after")}
                      </h3>
                      <p className="text-textSize3 text-TextLow">
                        {item?.total_sold || 0} فروش
                      </p>
                    </div>
                  </div>
                  <Link href={"/shop/product/" + item.slug}>
                    <Button size="sm" className="bg-boxBg400">
                      مشاهده
                    </Button>
                  </Link>
                </div>
              ))}
              <div className="flex justify-center py-2">
                <Link href={"/panel/products/lists"}>
                  <Button size="sm" variant="light" className="text-TextLow">
                    مشاهده همه
                  </Button>
                </Link>
              </div>
            </div>
            <div className="border-border1 rounded-[12px] border-1">
              <h3 className="p-2 font-[500] text-secondary">آخرین مشتري ها</h3>
              {dashboardData?.top_customers?.map((item) => (
                <div
                  key={item.id}
                  className="border-border1 m-2 flex items-center justify-between rounded-lg border-1 bg-boxBg200 p-2 transition-colors hover:bg-boxBg300"
                >
                  <div className="flex w-full justify-between gap-1">
                    <h3 className="truncate font-[500]">
                      {item.name ? (
                        shortenString(item.name, 50, "after")
                      ) : (
                        <span>ناشناس</span>
                      )}
                    </h3>
                    <p className="text-textSize3 text-TextLow">
                      {item?.cellphone}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex justify-center py-2">
                <Link href={"/panel/users/userslist"}>
                  <Button size="sm" variant="light" className="text-TextLow">
                    مشاهده همه
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
