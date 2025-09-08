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
import { Metadata } from "next";
// import Head from "next/head";
import { cookies } from "next/headers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ product: string[] }>;
}): Promise<Metadata> {
  const slug = (await params).product[0];
  const dataRes = await apiCRUD({
    urlSuffix: "next/products/" + slug,
    requiresToken: false,
  });
  const data: ProductShowSite = dataRes?.data;

  const priceCheck = data?.price_check && typeof data.price_check === "object"
    ? data.price_check
    : null;
    
  const finalPrice = priceCheck?.sale_price || priceCheck?.price;
  const oldPrice = priceCheck?.sale_price ? priceCheck.price : undefined;

  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_PATH}/shop/product/${data?.slug}`;
  return {
    title: data?.seo_title || data?.name,
    description:
      data?.seo_description ||
      data?.description ||
      `${data?.name} با بهترین قیمت و کیفیت پوشاک از فابریک مد`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: data?.seo_title || data?.name,
      description: data?.seo_description || data?.description,
      url: canonicalUrl,
      images: data?.primary_image
        ? [
            {
              url: process.env.NEXT_PUBLIC_IMG_BASE + data.primary_image,
              alt: data?.name,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: data?.seo_title || data?.name,
      description:
        data?.seo_description ||
        data?.description ||
        `خرید آنلاین ${data?.name} از فابریک مد`,
    },
    other: {
      "product_id": data.id.toString(),
      "product_name": data.name,
      "product_price": finalPrice?.toString() || "",
      "product_old_price": oldPrice?.toString() || "",
      "availability": data.quantity_check ? "instock" : "outofstock",
    },
  };
}



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

      {/* ✅ متاهای سفارشی */}
    {/* <Head>
      <meta name="product_id" content={data?.id?.toString() || ""} />
      <meta name="product_name" content={data?.name || ""} />
      <meta
        property="og:image"
        content={data?.primary_image ? process.env.NEXT_PUBLIC_IMG_BASE + data.primary_image : ""}
      />
      <meta
        name="product_price"
        content={
          data?.sale_check && data?.price_check
            ? data.price_check.sale_price?.toString() || data.price_check.price.toString()
            : data?.price_check && data.price_check.price
            ? data.price_check.price.toString()
            : ""
        }
      />
      <meta
        name="product_old_price"
        content={data?.price_check ? data.price_check.price.toString() : ""}
      />
      <meta
        name="availability"
        content={data?.quantity_check ? "instock" : "outofstock"}
      />
    </Head> */}

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
