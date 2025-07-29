import { getAuth } from "@/services/auth";
import apiStatusMessage from "@/utils/apiStatusMessage";
import { cacheUpdator } from "@/utils/cacheUpdator";
import toast from "react-hot-toast";

export type ApiCrudInput = {
  urlSuffix?: string;
  fullUrl?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: Record<string, any>;
  extraHeaders?: Record<string, string>;
  requiresToken?: boolean;
  ssrToken?: string; //used when requesting from serverside and cookies are getted differently
  cache?: "force-cache" | "no-store";
  next?: NextFetchRequestConfig;
  noToast?: boolean;
  updateCacheByTag?: string | string[]; //send the nextjs cache tags we setted in api's listed in cacheNames.ts file to update cache
  noCacheToast?: boolean;
};

/* attention: 
1. usage of whether return or throw the error has been chosen because of the way SWR or useMyForm hook identify the error in order to work properly
2. cache and next is used to configure the next js app router fetch functionallity and the default may be different in different versions
*/
export default async function apiCRUD({
  urlSuffix,
  fullUrl,
  method = "GET",
  data = {},
  extraHeaders = {},
  requiresToken = true,
  ssrToken,
  cache = "no-store",
  next,
  noToast,
  updateCacheByTag,
  noCacheToast,
}: ApiCrudInput) {
  const finalUrl =
    fullUrl || process.env.NEXT_PUBLIC_BACKEND_API! + "/" + urlSuffix;
  console.log("finalUrl", finalUrl);

  if (typeof window === "undefined" && requiresToken && !ssrToken) {
    console.error(
      "when requesting from serverside you should provide ssrToken to apiCRUD",
    );
    return;
  }
  const token =
    requiresToken && (ssrToken ? ssrToken : getAuth.session()?.token);

  try {
    const response = await fetch(finalUrl, {
      method,
      /* mode: "no-cors", */
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...extraHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(method !== "GET" ? { body: JSON.stringify(data) } : {}),
      ...(method === "GET" && cache ? { cache: cache } : {}),
      next: next ? next : undefined,
    });

    const result = await response.json();

    if (!response.ok) {
      if (typeof window !== "undefined") {
        apiStatusMessage(
          response.status,
          true,
          ("message" in result &&
            typeof result.message === "string" &&
            result.message) ||
            undefined,
        );
      }
      if (method === "GET") {
        console.error(`fetch error: ${response.status}`);
        throw new Error(`fetch error: ${response.status}`);
      }
      return result;
    }
    if (method !== "GET" && !noToast) {
      apiStatusMessage(
        response.status,
        true,
        ("message" in result &&
          typeof result?.message === "string" &&
          result?.message) ||
          undefined,
      );
    }
    if (updateCacheByTag) {
      cacheUpdator(updateCacheByTag, noCacheToast);
    }
    return result;
  } catch (error) {
    console.error("API call error:", error);
    if (method === "GET") throw error;
    else toast.error("مشکل در سرور");
    return error;
  }
}
