"use client";
import InputBasic from "@/components/inputs/InputBasic";
import useMyForm from "@/hooks/useMyForm";
import { Button } from "@heroui/button";

export default function TrackingForm() {
  const { values, errors, loading, handleChange, handleSubmit } = useMyForm(
    {
      trackingnumber: undefined,
      email: undefined,
    },
    async () => {},
  );
  return (
    <>
      <p className="text-TextLow">
        برای رهگیری سفارشتان شماره سفارش و ایمیلی که درهنگام ثبت سفارش وارد
        کردید را در این قسمت وارد و کلید رهگیری را فشار دهید.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-5 flex flex-col gap-[24px] rounded-[8px] bg-boxBg100"
      >
        <InputBasic
          type="text"
          name="trackingnumber"
          label="شماره سفارش"
          value={values.trackingnumber}
          placeholder="شماره سفارش در ایمیل ارسال شده به شما موجود است."
          onChange={handleChange("trackingnumber")}
          errorMessage={errors.trackingnumber}
        />
        <InputBasic
          type="email"
          name="email"
          label="ایمیل صورتحساب"
          labelPlacement="outside"
          value={values.email}
          placeholder="ایمیلی که در هنگام ثبت سفارش وارد کردید"
          onChange={handleChange("email")}
          errorMessage={errors.email}
        />

        <Button
          type="submit"
          className="self-start rounded-[5px] bg-primary text-primary-foreground"
          isLoading={loading}
        >
          رهگیری
        </Button>
      </form>
    </>
  );
}
