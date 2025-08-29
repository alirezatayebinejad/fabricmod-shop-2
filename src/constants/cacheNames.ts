import { ApiCrudInput } from "@/services/apiCRUD";

export const cookiesNames = {
  userPermissions: "user_perms_fabric",
  userSession: "user_session_fabric",
  userInfo: "user_info_fabric",
  tempPhoneToken: "temp_phone_token_fabric",
};

export const localstorageNames = {
  compares: "compares-fabric",
  basket: "basket-fabric",
};

/* 
cache options:
no-store: Next.js fetches the resource from the remote server on every request, even if Dynamic APIs are not detected on the route.
force-cache: Next.js looks for a matching request in its Data Cache.

revalidate options:
false - Cache the resource indefinitely. Semantically equivalent to revalidate: Infinity. The HTTP cache may evict older resources over time.
0 - Prevent the resource from being cached.
number - (in seconds) Specify the resource should have a cache lifetime of at most n seconds.
*/

// we update the cache automaticaly in some api calls in codebase through the apiCRUD.ts

type ServerCacheKeys =
  | "initials"
  | "theme"
  | "index"
  | "about"
  | "contact"
  | "rules";

type ServerCacheType = {
  [K in ServerCacheKeys]: {
    next: ApiCrudInput["next"];
    cache: ApiCrudInput["cache"];
  };
};

export const serverCache: ServerCacheType = {
  initials: {
    cache: "force-cache",
    next: { tags: ["initials", "all"], revalidate: false },
  },
  theme: {
    cache: "force-cache",
    next: { tags: ["theme", "all"], revalidate: false },
  },
  index: {
    cache: "force-cache",
    next: { tags: ["index", "all"], revalidate: 30 },
  },
  about: {
    cache: "force-cache",
    next: { tags: ["about", "all"], revalidate: false },
  },
  contact: {
    cache: "force-cache",
    next: { tags: ["contact", "all"], revalidate: false },
  },
  rules: {
    cache: "force-cache",
    next: { tags: ["rules", "all"], revalidate: false },
  },
};

type ServerCacheDynamicKeys =
  | "post"
  | "postCategory"
  | "product"
  | "productCategory";

type ServerCacheDynamicType = {
  [K in ServerCacheDynamicKeys]: {
    next: ApiCrudInput["next"];
    cache: ApiCrudInput["cache"];
  };
};

export const serverCacheDynamic = (
  dynamicTag: string,
): ServerCacheDynamicType => {
  return {
    post: {
      cache: "force-cache",
      next: {
        tags: [`post-${dynamicTag}`, "allPosts", "all"],
        revalidate: false,
      },
    },
    postCategory: {
      cache: "force-cache",
      next: {
        tags: [`postCategory-${dynamicTag}`, "allPostsCategory", "all"],
        revalidate: 30,
      },
    },
    /* TODO:later when and order is submitted we should revalidate the cache of the product-slug*/
    product: {
      cache: "force-cache",
      next: {
        tags: [`product-${dynamicTag}`, "allProducts", "all"],
        revalidate: 30,
      },
    },
    productCategory: {
      cache: "force-cache",
      next: {
        tags: [`productCategory-${dynamicTag}`, "allProductsCategory", "all"],
        revalidate: 30,
      },
    },
  };
};
