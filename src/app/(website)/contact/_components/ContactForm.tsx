import InputBasic from "@/components/inputs/InputBasic";
import TextAreaCustom from "@/components/inputs/TextAreaCustom";
import { Button } from "@heroui/button";

export default function ContactForm() {
  return (
    <div className="flex flex-col gap-[31px]">
      <h2 className="text-[20px]">پیام خود را ارسال کنید</h2>
      <div className="flex flex-col gap-[27px]">
        <InputBasic
          name=""
          label="نام و نام خانوادگی"
          labelPlacement="inside"
          classNames={{
            inputWrapper: "!bg-boxBg100",
          }}
        />
        <InputBasic
          name=""
          label="ایمیل"
          labelPlacement="inside"
          classNames={{
            inputWrapper: "!bg-boxBg100",
          }}
        />
        <InputBasic
          name=""
          label="شماره تماس"
          labelPlacement="inside"
          classNames={{
            inputWrapper: "!bg-boxBg100",
          }}
        />
        <TextAreaCustom
          type="text"
          label=""
          name=""
          placeholder="متن پیام خود را بنویسید..."
          classNames={{
            inputWrapper: "!bg-boxBg100",
          }}
        />
        <Button className="h-[50px] rounded-[8px] bg-primary text-primary-foreground">
          ارسال
        </Button>
      </div>
    </div>
  );
}
