import PageHeader from "@/app/(website)/_components/layout/PageHeader";
import ContactInfo from "@/app/(website)/contact/_components/ContactInfo";
import Title from "@/components/datadisplay/Title";
import { serverCache } from "@/constants/cacheNames";
import apiCRUD from "@/services/apiCRUD";
import { PageShowSite } from "@/types/apiTypes";

export default async function ContactPage() {
  const dataRes = await apiCRUD({
    urlSuffix: "next/contact-us",
    requiresToken: false,
    ...serverCache.contact,
  });
  const data: PageShowSite = dataRes?.data;
  return (
    <main className="overflow-hidden">
      <Title title={data.title} styles={{ container: "pt-5 pb-16" }} />
      {data?.primary_image && (
        <div className="mb-24">
          <PageHeader
            img={process.env.NEXT_PUBLIC_IMG_BASE + data?.primary_image}
          />
        </div>
      )}
      <ContactInfo data={data} />
      {data.body && (
        <div
          dangerouslySetInnerHTML={{ __html: data.body }}
          className="pages_content md:mx-[45px]"
        ></div>
      )}
    </main>
  );
}
