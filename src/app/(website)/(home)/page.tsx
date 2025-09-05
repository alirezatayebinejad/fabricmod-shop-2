import BannerCard from "@/app/(website)/(home)/_components/BannerCard";
import CategoriesCarousel from "@/app/(website)/(home)/_components/CategoriesCarousel";
import Features from "@/app/(website)/(home)/_components/Features";
import NoticeBanner from "@/app/(website)/(home)/_components/NoticeBanner";
import Slider from "@/app/(website)/(home)/_components/Slider";
import BlogCard from "@/app/(website)/_components/cards/BlogCard";
import ProductCard from "@/app/(website)/_components/cards/ProductCard";
import Carousel from "@/components/datadisplay/Carousel";
import { serverCache } from "@/constants/cacheNames";
import apiCRUD from "@/services/apiCRUD";
import { Index } from "@/types/apiTypes";

export default async function HomePage() {
  const dataRes = await apiCRUD({
    urlSuffix: "next",
    requiresToken: false,
    ...serverCache.index,
  });
  const data: Index = dataRes?.data;

  return (
    <main>
      <div>
        <Slider slidesData={data?.banners?.slider} />

        <section className="mt-4 flex gap-4 max-md:flex-col">
          {data?.banners?.three?.[0] &&
            data?.banners?.three?.[1] &&
            (data?.banners?.three?.[2] ? (
              <div className="flex flex-[0.5] flex-col gap-4">
                <BannerCard
                  bgImg={data.banners.three[0].image}
                  headTitle={data.banners.three[0]?.pre_title}
                  title={data.banners.three[0].title}
                  description={data.banners.three[0].text}
                />
                <BannerCard
                  bgImg={data.banners.three[1].image}
                  headTitle={data.banners.three[1]?.pre_title}
                  title={data.banners.three[1].title}
                  description={data.banners.three[1].text}
                />
              </div>
            ) : (
              <div className="flex flex-[1] gap-4 max-lg:flex-col">
                <div className="flex-[0.5]">
                  <BannerCard
                    bgImg={data.banners.three[0].image}
                    headTitle={data.banners.three[0]?.pre_title}
                    title={data.banners.three[0].title}
                    description={data.banners.three[0].text}
                    containerStyle="max-md:max-h-[200px]"
                  />
                </div>
                <div className="flex-[0.5]">
                  <BannerCard
                    bgImg={data.banners.three[1].image}
                    headTitle={data.banners.three[1]?.pre_title}
                    title={data.banners.three[1].title}
                    description={data.banners.three[1].text}
                    containerStyle="max-md:max-h-[200px]"
                  />
                </div>
              </div>
            ))}

          {data?.banners?.three?.[2] && (
            <>
              <div className="flex-[0.5] max-md:hidden">
                <BannerCard
                  bgImg={data.banners.three[2].image}
                  headTitle={data.banners.three[2]?.pre_title}
                  title={data.banners.three[2].title}
                  description={data.banners.three[2].text}
                  height={624}
                />
              </div>
              <div className="md:hidden">
                <BannerCard
                  bgImg={data.banners.three[2].image}
                  headTitle={data.banners.three[2]?.pre_title}
                  title={data.banners.three[2].title}
                  description={data.banners.three[2].text}
                  height={300}
                />
              </div>
            </>
          )}
        </section>
        <CategoriesCarousel />

        <Carousel
          title="جدید ترین ها"
          moreButton
          autoplay
          ButtonLink="/shop?sortBy=latest"
          cards={data?.latest_products?.map((p) => (
            <ProductCard product={p} key={p.slug} />
          ))}
        />

        {/* Dynamic Carousels from Index.carousels */}
        {data?.carousels?.map((carousel, idx) => (
          <div
            key={carousel.id}
            className={`${idx % 2 === 0 ? "rounded-[20px] bg-[url('/images/offerBg.png')] px-5" : ""}`}
          >
            <Carousel
              title={carousel.name}
              moreButton
              autoplay
              ButtonLink={
                carousel.slug ? "/shop/category/" + carousel.slug : undefined
              }
              cards={carousel.products?.map((product) => (
                <ProductCard product={product} key={product.slug} />
              ))}
            />
          </div>
        ))}

        {data?.banners?.call_to_action?.[0] && (
          <NoticeBanner data={data.banners.call_to_action[0]} />
        )}

        <Carousel
          title="وبلاگ و مجله ما"
          moreButton
          ButtonLink="/blog"
          cards={data?.posts?.map((p) => <BlogCard key={p.slug} blog={p} />)}
        />
        <div className="my-12">
          <Features />
        </div>
      </div>
    </main>
  );
}
