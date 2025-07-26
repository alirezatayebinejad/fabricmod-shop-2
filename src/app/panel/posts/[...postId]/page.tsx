import FormPost from "@/app/panel/posts/_components/FormPost";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string[] }>;
}) {
  const mode =
    (await params).postId[0] || ("write" as "write" | "edit" | "show");
  const postId = (await params).postId[1];

  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb
            items={[
              { title: "پنل" },
              { title: "پست ها", link: "/panel/posts/postslist" },
              {
                title:
                  mode === "edit"
                    ? "ویرایش پست"
                    : mode === "show"
                      ? "نمایش پست"
                      : "ساخت پست",
              },
            ]}
          />
        </div>
        {mode === "edit" ? (
          <FormPost isEditMode postId={parseInt(postId)} />
        ) : mode === "show" ? (
          <FormPost isShowMode postId={parseInt(postId)} />
        ) : (
          <FormPost />
        )}
      </div>
    </main>
  );
}
