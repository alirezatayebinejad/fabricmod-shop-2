export type PanelMenu = {
  id: number;
  iconSrc: string;
  name: string;
  nameEn: string;
  link: string;
  subMenu: PanelMenu[] | [];
};

export type NavMenu = {
  id: number;
  name: string;
  nameEn: string;
  link: string;
  subMenu: NavMenu[] | [];
};

export const panelMenus: PanelMenu[] = [
  {
    id: 0,
    name: "داشبورد",
    nameEn: "dashboard",
    link: "/panel/dashboard",
    iconSrc: "/icons/panel/dashboard.svg",
    subMenu: [],
  },
  {
    id: 1,
    name: "پروفایل",
    nameEn: "profile",
    link: "/panel/profile",
    iconSrc: "/icons/panel/profile.svg",
    subMenu: [],
  },
  {
    id: 2,
    name: "کاربران",
    nameEn: "users",
    link: "#",
    iconSrc: "/icons/panel/users.svg",
    subMenu: [
      {
        id: 1,
        name: "ليست کاربران",
        nameEn: "userslist",
        link: "/panel/users/userslist",
        iconSrc: "",
        subMenu: [],
      },
      {
        id: 2,
        name: "درخواست پنل",
        nameEn: "req-panel",
        link: "/panel/users/userslist/req-panel",
        iconSrc: "",
        subMenu: [],
      },
      {
        id: 3,
        name: "نقش ها",
        nameEn: "roles",
        link: "/panel/users/roles",
        iconSrc: "",
        subMenu: [],
      },
    ],
  },
  {
    id: 3,
    name: "ویژگی ها",
    nameEn: "attributes",
    link: "/panel/attributes",
    iconSrc: "/icons/panel/attributes.svg",
    subMenu: [],
  },
  {
    id: 4,
    name: "بنر ها",
    nameEn: "banners",
    link: "/panel/banners",
    iconSrc: "/icons/panel/banners.svg",
    subMenu: [],
  },
  {
    id: 5,
    name: "دسته بندی ها",
    nameEn: "categories",
    link: "/panel/categories",
    iconSrc: "/icons/panel/categories.svg",
    subMenu: [],
  },
  {
    id: 6,
    name: "برند ها",
    nameEn: "brands",
    link: "/panel/brands",
    iconSrc: "/icons/panel/brands.svg",
    subMenu: [],
  },
  {
    id: 7,
    name: "صفحه ها",
    nameEn: "pages",
    link: "/panel/pages",
    iconSrc: "/icons/panel/pages.svg",
    subMenu: [],
  },
  {
    id: 8,
    name: "محصولات",
    nameEn: "products",
    link: "#",
    iconSrc: "/icons/panel/products.svg",
    subMenu: [
      {
        id: 1,
        name: "ساخت محصول",
        nameEn: "create",
        link: "/panel/products/create",
        iconSrc: "",
        subMenu: [],
      },
      {
        id: 2,
        name: "ليست محصولات",
        nameEn: "lists",
        link: "/panel/products/lists",
        iconSrc: "",
        subMenu: [],
      },
    ],
  },
  {
    id: 9,
    name: "سفارشات",
    nameEn: "orders",
    link: "/panel/orders",
    iconSrc: "/icons/panel/orders.svg",
    subMenu: [],
  },
  {
    id: 10,
    name: "تراکنش ها",
    nameEn: "transactions",
    link: "/panel/transactions",
    iconSrc: "/icons/panel/transactions.svg",
    subMenu: [],
  },
  {
    id: 11,
    name: "روش های ارسال",
    nameEn: "shippings",
    link: "/panel/shippings",
    iconSrc: "/icons/panel/shippings.svg",
    subMenu: [],
  },
  {
    id: 12,
    name: "کد تخفیف",
    nameEn: "coupons",
    link: "/panel/coupons",
    iconSrc: "/icons/panel/coupons.svg",
    subMenu: [],
  },
  {
    id: 13,
    name: "پست ها",
    nameEn: "posts",
    link: "#",
    iconSrc: "/icons/panel/posts.svg",
    subMenu: [
      {
        id: 1,
        name: "نوشتن پست",
        nameEn: "write",
        link: "/panel/posts/write",
        iconSrc: "",
        subMenu: [],
      },
      {
        id: 2,
        name: "ليست پست ها",
        nameEn: "postslist",
        link: "/panel/posts/postslist",
        iconSrc: "",
        subMenu: [],
      },
    ],
  },
  {
    id: 14,
    name: "کامنت ها",
    nameEn: "comments",
    link: "/panel/comments",
    iconSrc: "/icons/panel/comments.svg",
    subMenu: [],
  },
  {
    id: 15,
    name: "تنظیمات",
    nameEn: "settings",
    link: "#",
    iconSrc: "/icons/panel/settings.svg",
    subMenu: [
      {
        id: 1,
        name: "مشخصات سایت",
        nameEn: "info",
        link: "/panel/settings?tab=info",
        iconSrc: "/icons/panel/settings.svg",
        subMenu: [],
      },
      {
        id: 2,
        name: "ارتباطات",
        nameEn: "contact",
        link: "/panel/settings?tab=contact",
        iconSrc: "/icons/panel/settings.svg",
        subMenu: [],
      },
      {
        id: 3,
        name: "تم سایت",
        nameEn: "theme",
        link: "/panel/settings?tab=theme",
        iconSrc: "/icons/panel/settings.svg",
        subMenu: [],
      },
      {
        id: 4,
        name: "حافظه پنهان",
        nameEn: "cache",
        link: "/panel/settings?tab=cache",
        iconSrc: "/icons/panel/settings.svg",
        subMenu: [],
      },
    ],
  },
];

export const navMenu: NavMenu[] = [
  {
    id: 0,
    name: "خانه",
    nameEn: "Home",
    link: "/",
    subMenu: [],
  },
  {
    id: 1,
    name: "دسته ها",
    nameEn: "categs",
    link: "#",
    subMenu: [],
  },
  {
    id: 2,
    name: "فروشگاه",
    nameEn: "Shop",
    link: "/shop",
    subMenu: [],
  },
  {
    id: 3,
    name: "وبلاگ",
    nameEn: "Blog",
    link: "/blog",
    subMenu: [],
  },
  {
    id: 4,
    name: "تماس با ما",
    nameEn: "Contact Us",
    link: "/contact",
    subMenu: [],
  },
  {
    id: 5,
    name: "درباره ما",
    nameEn: "About Us",
    link: "/about",
    subMenu: [],
  },
];

export const footerEasyaccess: Omit<NavMenu, "subMenu">[] = [
  {
    id: 1,
    name: "حساب کاربری من",
    nameEn: "My Account",
    link: "/dashboard",
  },
  {
    id: 2,
    name: "سبد خرید",
    nameEn: "Cart",
    link: "/cart",
  },
  {
    id: 3,
    name: "لیست علاقه مندی",
    nameEn: "Wishlist",
    link: "/wishlist",
  },
];
export const footerInfo: Omit<NavMenu, "subMenu">[] = [
  {
    id: 1,
    name: "حریم خصوصی",
    nameEn: "Privacy Policy",
    link: "/rules",
  },
  {
    id: 2,
    name: "خط مشی بازپرداخت",
    nameEn: "Refund Policy",
    link: "/rules",
  },
  {
    id: 3,
    name: "ارسال و مرجوعی",
    nameEn: "Shipping and Returns",
    link: "/rules",
  },
  {
    id: 4,
    name: "قوانین و مقررات",
    nameEn: "Terms and Conditions",
    link: "/rules",
  },
];

export const userDashboardMenu = [
  {
    id: 1,
    title: "اطلاعات کاربری",
    titleEn: "profile",
  },
  {
    id: 2,
    title: "آدرس",
    titleEn: "address",
  },
  {
    id: 3,
    title: "علاقه مندی ها",
    titleEn: "favourites",
  },
  {
    id: 4,
    title: "سفارش ها",
    titleEn: "orders",
  },
  {
    id: 5,
    title: "سوابق پرداخت",
    titleEn: "payments",
  },
];
