"use client";

import { ShippingmethodIndexSite } from "@/types/apiTypes";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PayMethods({
  data,
  selectedMethodCode,
  onChange,
}: {
  data: ShippingmethodIndexSite[];
  selectedMethodCode: string | undefined;
  onChange: (code: string) => void;
}) {
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    setSelected(selectedMethodCode);
  }, [selectedMethodCode]);

  const handleSelection = (method: string) => {
    setSelected(method);
    onChange(method);
  };

  return (
    <div className="flex flex-col justify-start gap-5">
      <div>
        {data?.map((method) => (
          <Button
            key={method.id}
            className="rounded-[5px] text-TextColor"
            style={
              selected === method.code
                ? { backgroundColor: "var(--boxBg500)" }
                : { backgroundColor: "var(--boxBg200)" }
            }
            onPress={() => handleSelection(method.code)}
          >
            {method.name}
          </Button>
        ))}
      </div>
      <p className="text-TextLow">
        اطلاعات شخصی شما برای پردازش سفارش شما، پشتیبانی از تجربه شما در سراسر
        این وب سایت، و برای اهداف دیگری که در سیاست حفظ{" "}
        <Link
          prefetch={false}
          href={"/rules"}
          className="border-b-1 border-TextLow transition-colors hover:border-primary hover:text-primary"
        >
          حریم خصوصی
        </Link>{" "}
        ما توضیح داده شده است، استفاده خواهد شد.
      </p>
    </div>
  );
}
