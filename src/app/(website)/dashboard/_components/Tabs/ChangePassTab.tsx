import InputBasic from "@/components/inputs/InputBasic";
import { Button } from "@heroui/button";

export default function ChangePassTab() {
  return (
    <div className="flex h-[70vh] w-full items-center justify-center">
      <div className="bg-boxBg450 flex w-full max-w-[400px] items-center justify-center rounded-[32px] px-3 py-10">
        <div className="grid w-full max-w-[265px] grid-cols-1 place-content-center gap-2">
          <InputBasic name="" type="text" label="رمز عبور فعلی" />
          <InputBasic name="" type="password" label="رمز عبور جدید" />
          <InputBasic name="" type="password" label="تکرار رمز عبور جدید" />
          <Button className="mt-3 rounded-[8px] bg-primary text-primary-foreground">
            ثبت
          </Button>
        </div>
      </div>
    </div>
  );
}
