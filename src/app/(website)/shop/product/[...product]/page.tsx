import ProductCard from "@/app/(website)/_components/cards/ProductCard";
import PicGallery from "@/app/(website)/shop/product/[...product]/_components/PicGallery";
import ProductInfo from "@/app/(website)/shop/product/[...product]/_components/ProductInfo";
import ProductTabsContent from "@/app/(website)/shop/product/[...product]/_components/ProductTabsContent";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";
import Carousel from "@/components/datadisplay/Carousel";
import { cookiesNames, serverCacheDynamic } from "@/constants/cacheNames";
import apiCRUD from "@/services/apiCRUD";
import { getAuth } from "@/services/auth";
import { ProductShowSite } from "@/types/apiTypes";
import { cookies } from "next/headers";
import type { Product, WithContext } from "schema-dts";

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

  const productJsonLd: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data?.name,
    image: data?.images.map(
      (img) => process.env.NEXT_PUBLIC_IMG_BASE + img.image,
    ),
    description: data?.seo_description || data?.description,
    sku:
      data?.price_check && typeof data?.price_check !== "boolean"
        ? data?.price_check?.sku
        : "",
    brand: {
      "@type": "Brand",
      name: data?.brand?.name || "No Brand",
    },
    category: data?.category?.name,
    offers:
      data?.price_check && typeof data?.price_check !== "boolean"
        ? {
            "@type": "Offer",
            priceCurrency: "Toman",
            price: data?.price_check.sale_price || data?.price_check.price,
            availability: data?.quantity_check
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: `${process.env.NEXT_PUBLIC_BASE_PATH}/product/${data?.slug}`,
          }
        : undefined,
    aggregateRating: data?.rate
      ? {
          "@type": "AggregateRating",
          ratingValue: data?.rate?.toFixed(1),
        }
      : undefined,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
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
          <div>
            <div className="sticky top-0">
              <PicGallery
                sources={[
                  data?.primary_image
                    ? process.env.NEXT_PUBLIC_IMG_BASE + data?.primary_image
                    : "/images/imageplaceholder.png",
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
