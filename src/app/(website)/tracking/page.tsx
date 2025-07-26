import PageHeader from "@/app/(website)/_components/layout/PageHeader";
import TrackingForm from "@/app/(website)/tracking/_components/TrackingForm";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default function TrackingPage() {
  return (
    /* TODO: usage not yet clear */
    <main>
      <div>
        <PageHeader
          img="/fake/pageheadimg.jpeg"
          title="رهگیری سفارش"
          breadCrumb={
            <Breadcrumb
              items={[{ title: "خانه", link: "/" }, { title: "پیگیری سفارش" }]}
            />
          }
        />
        <div className="mx-auto mt-16 max-w-[550px]">
          <TrackingForm />
        </div>
      </div>
    </main>
  );
}
