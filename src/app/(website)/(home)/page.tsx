import BannerCard from "@/app/(website)/(home)/_components/BannerCard";
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
        <Carousel
          title="جدید ترین ها"
          moreButton
          autoplay
          ButtonLink="/shop?sortBy=latest"
          cards={data?.latest_products?.map((p) => (
            <ProductCard product={p} key={p.slug} />
          ))}
        />
        {/* TODO not dynamic */}
        {/* <div className="rounded-[20px] bg-[url('/images/offerBg.png')] p-5">
          <Carousel
            title="پیشنهاد ویژه"
            moreButton
            autoplay
            cards={[
              <ProductCard
                product={{
                  bgImg: "/fake/product.jpg",
                  title: "دستگاه اندازه‌گیری pH",
                  price: "۱,۲۰۰,۰۰۰",
                }}
                link="#"
                key={"5"}
              />,
              <ProductCard
                product={{
                  bgImg: "/fake/product.jpg",
                  title: "کیت آزمایشگاهی",
                  price: "۲,۵۰۰,۰۰۰",
                  offerPrice: "۲,۰۰۰,۰۰۰",
                }}
                link="#"
                key={"4"}
              />,
              <ProductCard
                product={{
                  bgImg: "/fake/product.jpg",
                  title: "دستگاه تست کیفیت آب",
                  price: "۱,۸۰۰,۰۰۰",
                }}
                link="#"
                key={"3"}
              />,
              <ProductCard
                product={{
                  bgImg: "/fake/product.jpg",
                  title: "تجهیزات آزمایشگاهی پیشرفته",
                  price: "۳,۲۰۰,۰۰۰",
                  offerPrice: "۲,۸۰۰,۰۰۰",
                }}
                link="#"
                key={"2"}
              />,
              <ProductCard
                product={{
                  bgImg: "/fake/product.jpg",
                  title: "تجهیزات آزمایشگاهی عمومی",
                  price: "۹۰۰,۰۰۰",
                }}
                link="#"
                key={"1"}
              />,
            ]}
          />
        </div>
        <Carousel
          title="محبوب ترین ها"
          moreButton
          autoplay
          cards={[
            <ProductCard
              product={{
                bgImg: "/fake/product.jpg",
                title: "محصول پرطرفدار ۱: میکروسکوپ",
                price: "۱,۵۰۰,۰۰۰",
              }}
              link="#"
              key={"5"}
            />,
            <ProductCard
              product={{
                bgImg: "/fake/product.jpg",
                title: "محصول پرطرفدار ۲: پمپ وکیوم",
                price: "۲,۰۰۰,۰۰۰",
                offerPrice: "۱,۷۰۰,۰۰۰",
              }}
              link="#"
              key={"4"}
            />,
            <ProductCard
              product={{
                bgImg: "/fake/product.jpg",
                title: "محصول پرطرفدار ۳: دستگاه تست کیفیت",
                price: "۲,۵۰۰,۰۰۰",
              }}
              link="#"
              key={"3"}
            />,
            <ProductCard
              product={{
                bgImg: "/fake/product.jpg",
                title: "محصول پرطرفدار ۴: کیت آزمایشگاهی",
                price: "۳,۰۰۰,۰۰۰",
                offerPrice: "۲,۷۰۰,۰۰۰",
              }}
              link="#"
              key={"2"}
            />,
            <ProductCard
              product={{
                bgImg: "/fake/product.jpg",
                title: "محصول پرطرفدار ۵: تجهیزات ایمنی",
                price: "۳,۵۰۰,۰۰۰",
              }}
              link="#"
              key={"1"}
            />,
          ]}
        /> */}
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
