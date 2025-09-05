import ProductCard from "@/app/(website)/_components/cards/ProductCard";
import PicGallery from "@/app/(website)/shop/product/[...product]/_components/PicGallery";
import ProductInfo from "@/app/(website)/shop/product/[...product]/_components/ProductInfo";
import ProductTabsContent from "@/app/(website)/shop/product/[...product]/_components/ProductTabsContent";
import SetOrCollectionsList from "@/app/(website)/shop/product/[...product]/_components/SetOrCollectionsList";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";
import Carousel from "@/components/datadisplay/Carousel";
import { cookiesNames, serverCacheDynamic } from "@/constants/cacheNames";
import { productJsonLd } from "@/constants/jsonlds";
import apiCRUD from "@/services/apiCRUD";
import { getAuth } from "@/services/auth";
import { ProductShowSite } from "@/types/apiTypes";
import { cookies } from "next/headers";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ product: string[] }>;
}) {
  const slug = (await params).product[0];
  const sessionCookie = (await cookies()).get(cookiesNames.userSession)?.value;
  const token = sessionCookie
    ? getAuth.session(sessionCookie)?.token
    : undefined;
  const dataRes = await apiCRUD({
    urlSuffix: "next/products/" + slug,
    requiresToken: token ? true : false,
    ssrToken: token,
    ...serverCacheDynamic(slug).product,
  });
  const data: ProductShowSite = dataRes?.data;

  return (
    <main>
      {" "}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(data)),
        }}
      />
      <div>
        <div className="mb-5 mt-4 sm:mt-10">
          <Breadcrumb
            items={[
              { title: "خانه", link: "/" },
              { title: "فروشگاه", link: "shop" },
              { title: data?.name },
            ]}
          />
        </div>
        <section className="grid grid-cols-2 gap-12 max-lg:grid-cols-1">
          <div className="relative">
            <div className="sticky top-0">
              <PicGallery
                sources={[
                  data?.back_image &&
                    process.env.NEXT_PUBLIC_IMG_BASE + data?.primary_image,
                  data?.primary_image &&
                    process.env.NEXT_PUBLIC_IMG_BASE + data?.primary_image,
                  ...(data?.images?.map(
                    (img) => process.env.NEXT_PUBLIC_IMG_BASE + img.image,
                  ) || []),
                ]}
              />
            </div>
          </div>

          <div>
            <ProductInfo data={data} />
          </div>
        </section>
        {!!data?.collections ||
          (!!data?.singles && (
            <section>
              <SetOrCollectionsList
                isCollection={!!data?.collections}
                data={data}
              />
            </section>
          ))}
        <section className="my-24">
          <ProductTabsContent product={data} />
        </section>
        <Carousel
          title="محصولات مرتبط"
          autoplay
          cards={[
            data?.related_products.map((p) => (
              <ProductCard product={p} key={p.slug} />
            )),
          ]}
        />
      </div>
    </main>
  );
}
