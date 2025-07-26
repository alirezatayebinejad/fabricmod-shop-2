import PageHeader from "@/app/(website)/_components/layout/PageHeader";
import FaqsList from "@/app/(website)/faqs/_components/FaqsList";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default function FaqsPage() {
  return (
    <main>
      <div>
        <PageHeader
          img="/fake/pageheadimg.jpeg"
          title="سوالات متداول"
          breadCrumb={
            <Breadcrumb
              items={[{ title: "خانه", link: "/" }, { title: "سوالات متداول" }]}
            />
          }
        />
        <FaqsList />
      </div>
    </main>
  );
}
