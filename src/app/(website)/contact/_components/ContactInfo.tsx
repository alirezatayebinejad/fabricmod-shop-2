"use client";
import Socials from "@/app/(website)/_components/snippets/Socials";
import MapCustom from "@/components/inputs/MapCustom";
import BgCircles from "@/components/svg/bgCircles";
import { useGlobalData } from "@/contexts/GlobalData";
import { PageShowSite } from "@/types/apiTypes";
import { LocateIcon, Phone, Speech } from "lucide-react";

export default function ContactInfo({ data }: { data?: PageShowSite }) {
  const globalData = useGlobalData();

  return (
    <div className="relative z-10 mx-auto mb-28 w-full max-w-[950px] rounded-[10px] border-1 border-border bg-boxBg200 p-[50px] max-md:p-[20px]">
      <div className="absolute left-[-70px] top-[-80px] animate-appearance-in">
        <BgCircles />
      </div>
      <div className="absolute right-[-120px] top-[200px] animate-appearance-in">
        <BgCircles />
      </div>
      <div className="absolute bottom-[80px] left-[-120px] animate-appearance-in">
        <BgCircles />
      </div>
      <div className="grid grid-cols-1 gap-[56px] max-lg:grid-cols-1">
        <div className="flex h-full flex-col justify-between [&>p]:text-TextSize500">
          <p className="mb-7 text-TextSize500">{data?.description}</p>
          <h2 className="mb-10 flex gap-1 text-TextSize500 font-[500]">
            <LocateIcon className="w-4" />
            آدرس ها:
          </h2>
          <div className="grid gap-2 md:grid-cols-2">
            {globalData?.initials?.setting?.addresses?.map((a, i) => (
              <div key={a.name + i} className="mb-4">
                <h3 className="mb-2 text-TextSize500 font-[500]">{a.name}:</h3>
                <p className="my-3">{a.value}</p>
                <div className="mt-2">
                  {a.latitude && a.longitude && (
                    <MapCustom
                      markerData={[
                        {
                          lat: parseFloat("35.6888817651802"),
                          long: parseFloat("51.39009475707988"),
                        },
                      ]}
                      classNames={{
                        container: "max-h-[200px]",
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2">
          <div>
            <h2 className="mb-2 flex gap-1 text-TextSize500 font-[500]">
              <Phone className="w-4" />
              شماره تماس:
            </h2>
            {globalData?.initials?.setting?.telephones?.map((t, i) => (
              <div key={t.name + i} className="flex items-center gap-2">
                <h3>{t.name}: </h3>
                <p>{t.value}</p>
              </div>
            ))}
          </div>
          <div>
            <h2 className="mb-2 flex gap-1 text-TextSize500 font-[500]">
              <Speech className="w-4" />
              شبکه های اجتماعی:
            </h2>
            <div className="my-5">
              <Socials data={globalData?.initials?.setting?.socials} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
