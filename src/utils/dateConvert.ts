import moment from "moment-jalaali";

// Helper to convert English digits to Persian digits
function toPersianDigits(str: string) {
  return str.replace(/\d/g, (d) => String.fromCharCode(d.charCodeAt(0) + 1728));
}

export function dateConvert(
  date: string | any,
  to: "persian" | "english",
  from: "persian" | "english" = "persian",
  options?: { withTime?: boolean },
) {
  if (!date) return undefined;

  if (to === "english") {
    if (from === "english") {
      const newDate = new Date(date);
      const englishDate = moment(newDate).format("YYYY-MM-DD HH:mm:ss");
      return englishDate;
    } else if (from === "persian") {
      const forConvertFormat =
        date.year +
        "-" +
        date.month +
        "-" +
        date.day +
        " " +
        date.hour +
        ":" +
        date.minute +
        ":" +
        date.second;

      const englishDate = moment(
        forConvertFormat,
        "jYYYY/jMM/jDD HH:mm:ss",
      ).format("YYYY-MM-DD HH:mm:ss");

      return englishDate;
    }
  }

  if (to === "persian") {
    const newDate = new Date(date);
    if (isNaN(newDate.getTime())) {
      return "تاریخ نامعتبر";
    }

    const dateStr = newDate.toLocaleDateString("fa-IR");

    if (options?.withTime) {
      const pad = (num: number) => num.toString().padStart(2, "0");
      const hours = pad(newDate.getHours());
      const minutes = pad(newDate.getMinutes());
      // Only show seconds if not zero
      const timeStr = `${hours}:${minutes}`;
      // Convert both date and time to Persian digits
      return `${toPersianDigits(timeStr)} - ${toPersianDigits(dateStr)}`;
    }

    // Convert date to Persian digits
    return toPersianDigits(dateStr);
  }
}
