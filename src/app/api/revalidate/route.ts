import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 },
      );
    }

    const { tag } = await request.json();

    if (!tag || typeof tag !== "string" || !tag.trim()) {
      return NextResponse.json(
        { error: "پارامتر ارسالی اشتباه میباشد" },
        { status: 400 },
      );
    }
    revalidateTag(tag.trim());

    const response = NextResponse.json(
      { success: true, message: `حافظه پنهان با موفقیت پاک شد` },
      { status: 200 },
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.error("Error revalidating cache:", error);
    return NextResponse.json(
      { message: "مشکل سرور در پاک کردن حافظه پنهان", details: error },
      { status: 500 },
    );
  }
}
