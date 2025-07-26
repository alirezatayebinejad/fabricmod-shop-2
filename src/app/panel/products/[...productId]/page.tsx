import FormProducts from "@/app/panel/products/_components/FormProducts";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string[] }>;
}) {
  const mode =
    (await params).productId[0] || ("create" as "create" | "edit" | "show");
  const productId = (await params).productId[1];

  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb
            items={[
              { title: "پنل" },
              {
                title:
                  mode === "edit"
                    ? "ویرایش محصولات"
                    : mode === "show"
                      ? "نمایش محصولات"
                      : "ساخت محصولات",
              },
            ]}
          />
        </div>
        {mode === "edit" ? (
          <FormProducts isEditMode productId={productId} />
        ) : mode === "show" ? (
          <FormProducts isShowMode productId={productId} />
        ) : (
          <FormProducts />
        )}
      </div>
    </main>
  );
}
