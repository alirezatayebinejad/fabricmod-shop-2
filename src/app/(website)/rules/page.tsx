import PageHeader from "@/app/(website)/_components/layout/PageHeader";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";
import { ParseHTML } from "@/components/datadisplay/ParseHtml";
import Title from "@/components/datadisplay/Title";
import { serverCache } from "@/constants/cacheNames";
import apiCRUD from "@/services/apiCRUD";
import { PageShowSite } from "@/types/apiTypes";

export default async function RulesPage() {
  const dataRes = await apiCRUD({
    urlSuffix: "next/regulations",
    requiresToken: false,
    ...serverCache.rules,
  });
  const data: PageShowSite = dataRes?.data;

  return (
    <main>
      <div>
        <PageHeader
          img={process.env.NEXT_PUBLIC_IMG_BASE + data?.primary_image}
          title="قوانین و مقررات"
          breadCrumb={
            <Breadcrumb
              items={[
                { title: "خانه", link: "/" },
                { title: data?.title || "" },
              ]}
            />
          }
        />
        <div className="mx-auto my-9 max-w-[800px]">
          <Title
            title={data?.title}
            styles={{ container: "items-center my-16" }}
          />
          <ParseHTML htmlContent={data?.body} />
        </div>
      </div>
    </main>
  );
}
