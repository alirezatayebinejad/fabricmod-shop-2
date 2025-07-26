import apiCRUD from "@/services/apiCRUD";

export const cacheUpdator = async (
  tags: string | string[],
  noCacheToast: boolean = false,
) => {
  const tagArray = Array.isArray(tags) ? tags : [tags];
  let allSuccess = true;

  for (const tag of tagArray) {
    let attempts = 0;
    let success = false;
    let res;

    while (attempts < 3 && !success) {
      try {
        res = await apiCRUD({
          fullUrl: "/api/revalidate",
          method: "POST",
          data: { tag },
          noToast: noCacheToast,
        });
        if (res && res.success) {
          success = true;
        }
      } catch (error) {
        console.error(
          `cache delete Attempt ${attempts + 1} for tag ${tag} failed:`,
          error,
        );
      }
      attempts++;
    }

    if (!success) {
      allSuccess = false;
    }
  }

  return allSuccess;
};
