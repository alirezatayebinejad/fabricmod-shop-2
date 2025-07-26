import moment from "moment-jalaali";

export function dateConvert(
  date: string | any,
  to: "persian" | "english",
  from: "persian" | "english" = "persian",
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
    return newDate.toLocaleDateString("fa-IR");
  }
}
