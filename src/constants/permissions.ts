// these permissions should be synced with the backend permission api route
// whatever changed there it should be applied here
//route permissions are used in middleware to prevent illegal access
export const routePermissions: { [key: string]: string } = {
  "/panel/categories": "category-list",
  "/panel/users/userslist": "users-list",
  "/panel/attributes": "attributes-list",
  "/panel/banners": "banners-list",
  "/panel/brands": "brands-list",
  "/panel/products/lists": "products-list",
  "/panel/products/create": "products-create",
  "/panel/products/edit": "products-edit",
  "/panel/posts/postslist": "posts-list",
  "/panel/posts/write": "posts-create",
  "/panel/posts/edit": "posts-edit",
  "/panel/orders": "orders-list",
  "/panel/pages": "pages-list",
  "/panel/shippings": "shippings-list",
  "/panel/comments": "comments-list",
  "/panel/settings": "setting-show",
  "/panel/coupons": "coupons-list",
};

//this is used to protect components with <ProtectComponent /> or in dynamic pages ssr
export const innerPermissions = {
  categoryEdit: "category-edit",
  categoryCreate: "category-create",
  userEdit: "users-edit",
  userCreate: "users-create",
  attributesEdit: "attributes-edit",
  attributesCreate: "attributes-create",
  bannersEdit: "banners-edit",
  bannersCreate: "banners-create",
  brandsEdit: "brands-edit",
  brandsCreate: "brands-create",
  ordersEdit: "orders-edit",
  ordersCreate: "orders-create",
  pagesEdit: "pages-edit",
  pagesCreate: "pages-create",
  pagesDelete: "pages-delete",
  faqsList: "faqs-list",
  faqsUpdate: "faqs-update",
  faqsCreate: "faqs-create",
  faqsDelete: "faqs-delete",
  shippingsEdit: "shippings-edit",
  shippingsCreate: "shippings-create",
  couponsUpdate: "coupons-update",
  couponsCreate: "coupons-create",
  productsImages: "products-images",
  productsCreate: "products-create",
  productsEdit: "products-edit",
  postsDelete: "posts-delete",
  postsEdit: "posts-edit",
  postsCreate: "posts-create",
  settingTheme: "setting-theme",
  settingCache: "setting-cache",
  settingInfo: "setting-info",
  commentsEdit: "comments-edit",
};
