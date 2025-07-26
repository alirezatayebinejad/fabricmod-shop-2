import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { dateConvert } from "@/utils/dateConvert";

type Props = {
  name: string;
  defaultValue?: string;
  isDisabled?: boolean;
  title: string;
  errorMessage?: string;
  onChange?: (date: string | undefined) => void;
};

const DatePickerWrapper = ({
  name,
  defaultValue,
  isDisabled,
  title,
  errorMessage,
  onChange,
}: Props) => {
  const [date, setDate] = useState(defaultValue ? defaultValue : undefined);

  return (
    <div className="relative w-full">
      <p className="-mt-0.5 mb-1 text-TextSize400 text-TextColor">{title}</p>
      <div className="z-10">
        <input type="hidden" name={name} value={date || ""} />
        <DatePicker
          onChange={(val: any) => {
            setDate(dateConvert(val, "english"));
            onChange?.(dateConvert(val, "english"));
          }}
          calendar={persian}
          locale={persian_fa}
          disabled={isDisabled}
          calendarPosition="bottom-right"
          className="rmdp-mobile"
          placeholder={defaultValue ? dateConvert(defaultValue, "persian") : ""}
          plugins={[
            <TimePicker key="timePicker" position="bottom" hideSeconds />,
          ]}
        />
      </div>
      {errorMessage && (
        <p className="text-destructive-foreground">{errorMessage}</p>
      )}
    </div>
  );
};

export default DatePickerWrapper;
