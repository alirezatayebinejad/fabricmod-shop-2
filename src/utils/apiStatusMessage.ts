import toast from "react-hot-toast";

export default function apiStatusMessage(
  statusCode: number,
  useToast: boolean,
  resMessage?: string
) {
  const message = resMessage || getDefaultMessage(statusCode);
  if (useToast) {
    toastMessage(statusCode, message);
  } else {
    console.error(message, statusCode);
  }
}

function getDefaultMessage(statusCode: number): string {
  switch (statusCode) {
    case 200:
      return "عملیات با موفقیت انجام شد";
    case 201:
      return "آپدیت موفقیت آمیز بود";
    case 422:
      return "مشکل در اطلاعات ارسالی";
    case 404:
      return "یافت نشد";
    case 500:
      return "مشکل در سرور";
    case 401:
      return "ورود نا معتبر";
    default:
      return "ارور: " + statusCode;
  }
}

function toastMessage(statusCode: number, message: string) {
  switch (statusCode) {
    case 200:
    case 201:
      toast.success(message);
      break;
    case 422:
    case 404:
    case 500:
    case 401:
    default:
      toast.error(message);
      break;
  }
}
