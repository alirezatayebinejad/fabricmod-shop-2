export interface Authme {
  id: number;
  name: string;
  cellphone: string;
  email: string;
  primary_image: string;
  email_verified_at: null;
  is_active: number;
  status: string;
  update_user_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  permissions: string[];
  departments: {
    id: number;
    name: string;
  }[];
  roles: {
    id: number;
    name: string;
    display_name: string;
  }[];
}

export interface LoginData {
  token: string;
  user: Authme;
}

export interface PaginateMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

/////////////////////////////// panel //////////////////////////////////////

export interface UserIndex {
  id: number;
  name: string;
  cellphone: string;
  email: string;
  primary_image: null | string;
  email_verified_at: null | string;
  is_active: number;
  status: string;
  update_user_id: null | number;
  roles: {
    display_name: string;
    name: string;
    pivot: {
      model_type: string;
      model_id: number;
      role_id: number;
    };
  }[];
}

export interface UserShow {
  id: number;
  name: string;
  cellphone: string;
  email: string;
  is_active: number;
  status: string;
  permissions: string[];
  departments: {
    id: number;
    name: string;
  }[];
  roles: {
    id: number;
    name: string;
    display_name: string;
    guard_name: null;
    is_editable: null;
  }[];
}

export interface Attributes {
  id: number;
  name: string;
  slug: string;
  is_filter: number;
  is_active: number;
  user_id: null;
  created_at: string;
  updated_at: string;
}

export interface BannerIndex {
  id: number;
  title: string;
  text: null | string;
  pre_title: null | string;
  btn_text: null | string;
  url: string;
  image: string;
  mode:
    | "single"
    | "two"
    | "two_half"
    | "three"
    | "four"
    | "shop"
    | "blog"
    | "call_to_action"
    | "slider";
  priority: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface BrandsIndex {
  id: number;
  name: string;
  slug: string;
  primary_image: null | string;
  description: string;
  content: string;
  country_id: null | string | number;
  is_active: number;
  user_id: null | string;
  created_at: string;
  updated_at: string;
}

export interface BrandShow {
  id: number;
  name: string;
  slug: string;
  primary_image: string;
  description: string;
  content: string;
  country_id: null | string | number;
  is_active: number;
  user_id: null | string | number;
  created_at: string;
  updated_at: string;
  country: null | string;
}

export interface CategoryIndex {
  id: number;
  name: string;
  slug: string;
  icon: null | string;
  primary_image: null;
  parent_id: string;
  type: string;
  priority: number;
  is_important: number;
  description: string;
  seo_title: string;
  seo_description: string;
  content: string;
  user_id: null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryShow {
  id: number;
  name: string;
  slug: string;
  icon: string;
  primary_image: null;
  parent_id: string;
  type: string;
  priority: number;
  is_important: number;
  description: string;
  seo_title: string;
  seo_description: string;
  content: string;
  user_id: null;
  is_active: number;
  created_at: string;
  updated_at: string;
  parent: null | {
    id: number;
    name: string;
    slug: string;
    icon: string;
    parent_id: string;
    cat_level: number;
    priority: number;
    is_important: number;
    description: string;
    content: string;
    user_id: null;
    is_active: number;
    created_at: string;
    updated_at: string;
  };
  childs: {
    id: number;
    name: string;
    slug: string;
    icon: null;
    primary_image: null;
    parent_id: string;
    type: string;
    priority: number;
    is_important: number;
    description: string;
    content: string;
    user_id: null;
    is_active: number;
    created_at: string;
    updated_at: string;
  }[];
  faqs: {
    id: number;
    subject: string;
    body: string;
    faqable_type: string;
    faqable_id: number;
    user_id: number;
    deleted_at: null;
    created_at: string;
    updated_at: string;
  }[];
  attributes: {
    id: number;
    name: string;
    slug: string;
    is_filter: number;
    is_active: number;
    user_id: null;
    created_at: string;
    updated_at: string;
    pivot: {
      category_id: number;
      attribute_id: number;
      is_variation: number;
      is_filter: number;
    };
  }[];
  filter_attrs: {
    id: number;
    name: string;
    slug: string;
    is_filter: number;
    is_active: number;
    user_id: null;
    created_at: string;
    updated_at: string;
    pivot: {
      category_id: number;
      attribute_id: number;
      is_variation: number;
      is_filter: number;
    };
  }[];
  variation_attr: {
    id: number;
    name: string;
    slug: string;
    is_filter: number;
    is_active: number;
    user_id: null;
    created_at: string;
    updated_at: string;
    pivot: {
      category_id: number;
      attribute_id: number;
      is_variation: number;
      is_filter: number;
    };
  }[];
}
export interface ProductIndex {
  id: number;
  name: string;
  slug: string;
  primary_image: null | string;
  seo_title: null | string;
  seo_description: null | string;
  weight: number;
  category_id: number;
  brand_id: null | number;
  country_id: null | number;
  details: null | string;
  description: null | string;
  content: null | string;
  garranty_type: string;
  garranty_day: number;
  user_id: null;
  is_active: number;
  created_at: string;
  updated_at: string;
  quantity_check: boolean | number;
  sale_check: boolean;
  price_check: {
    id: number;
    attribute_id: number | null;
    product_id: number;
    value: string | null;
    quantity: number;
    sku: string | null;
    price: number;
    sale_price: number | null;
    date_sale_from: string | null;
    date_sale_to: string | null;
    user_id: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  };
  rate: number;
  is_wished: boolean;
}

export interface ProductShow {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  primary_image: null | string;
  brand_id: number;
  country_id: number;
  details: string;
  description: string;
  seo_title: string;
  seo_description: string;
  weight: number;
  content: string;
  is_send: number;
  is_external_service: number;
  delivery_amount_per_product: number;
  garranty_type: string;
  garranty_day: number;
  user_id: null;
  is_active: number;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
    slug: string;
    icon: string;
    primary_image: null | string;
    parent_id: string;
    type: string;
    priority: number;
    is_important: number;
    description: string;
    content: string;
    user_id: null;
    is_active: number;
    created_at: string;
    updated_at: string;
  };
  attributes_value: {
    id: number;
    name: string;
    slug: string;
    is_filter: number;
    is_active: number;
    user_id: null;
    created_at: string;
    updated_at: string;
    pivot: {
      product_id: number;
      attribute_id: number;
      value: string;
    };
  }[];
  variations: {
    id: number;
    attribute_id: number;
    product_id: number;
    value: string;
    quantity: number;
    sku: string;
    price: number;
    sale_price: number;
    date_sale_from: null | string;
    date_sale_to: null | string;
    update_user_id: number;
    deleted_at: null;
    created_at: string;
    updated_at: string;
    attribute: {
      id: number;
      name: string;
    };
  }[];
  images: {
    id: number;
    product_id: number;
    image: string;
    is_active: number;
    created_at: string;
    updated_at: string;
  }[];
  brand: {
    id: number;
    name: string;
    slug: string;
    primary_image: string;
  };
  country: {
    id: number;
    fa_name: string;
  };
  faqs: {
    id: number;
    subject: string;
    body: string;
    faqable_type: string;
    faqable_id: number;
    user_id: number;
    deleted_at: null;
    created_at: string;
    updated_at: string;
  }[];
  tags: {
    id: number;
    name: string;
    slug: string;
    pivot: {
      taggable_type: string;
      taggable_id: number;
      tag_id: number;
    };
  }[];
}

export interface ProductImages {
  id: number;
  name: string;
  primary_image: string;
  images: {
    id: number;
    product_id: number;
    image: string;
    is_active: number;
    created_at: string;
    updated_at: string;
  }[];
}

export interface Profile {
  user: {
    id: number;
    name: string;
    cellphone: string;
    email: string;
    primary_image: string;
    email_verified_at: null;
    is_active: number;
    status: string;
    update_user_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: null;
    roles: {
      id: number;
      name: string;
      display_name: string;
      access_panel: string;
      is_editable: number;
      guard_name: string;
      created_at: string;
      updated_at: string;
      pivot: {
        model_type: string;
        model_id: number;
        role_id: number;
      };
      permissions: {
        id: number;
        name: string;
        display_name: string;
        guard_name: string;
        created_at: null;
        updated_at: null;
        pivot: {
          role_id: number;
          permission_id: number;
        };
      }[];
      departments: {
        id: number;
        name: string;
        user_ticket: number;
        is_active: number;
        created_at: null;
        updated_at: null;
        pivot: {
          role_id: number;
          department_id: number;
        };
      }[];
    }[];
  };
  permissions: string[];
  departments: {
    [key: string]: string;
  };
}

export interface RoleIndex {
  id: number;
  name: string;
  display_name: string;
  access_panel: string;
  is_editable: number;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface RoleShow {
  id: number;
  name: string;
  display_name: string;
  access_panel: string;
  is_editable: number;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permissions: {
    id: number;
    name: string;
    display_name: string;
    pivot: {
      role_id: number;
      permission_id: number;
    };
  }[];
  departments: {
    id: number;
    name: string;
    pivot: {
      role_id: number;
      department_id: number;
    };
  }[];
}

export interface Permission {
  id: number;
  name: string;
  display_name: string;
}

export interface PostShow {
  id: number;
  title: string;
  category_id: number;
  slug: string;
  description: string;
  seo_title: string;
  seo_description: string;
  primary_image: null | string;
  body: string;
  status: string;
  is_important: number;
  is_active: number;
  user_id: null;
  deleted_at: null;
  created_at: string;
  updated_at: string;
  rate: number;
  faqs: {
    id: number;
    subject: string;
    body: string;
    faqable_type: string;
    faqable_id: number;
    user_id: number;
    deleted_at: null;
    created_at: string;
    updated_at: string;
  }[];
  tags: {
    id: number;
    name: string;
    slug: string;
    pivot: {
      taggable_type: string;
      taggable_id: number;
      tag_id: number;
    };
  }[];
  category: {
    id: number;
    name: string;
    slug: string;
    parent_id: string;
    parent: null;
  };
}

export interface PostIndex {
  id: number;
  title: string;
  slug: string;
  description: string;
  seo_title: string;
  seo_description: string;
  primary_image: null | string;
  body: null | string;
  status: string;
  is_important: number;
  is_active: number;
  user_id: null;
  deleted_at: null;
  created_at: string;
  updated_at: string;
  rate: number;
}

export interface Faq {
  id: number;
  subject: string;
  body: string;
  faqable_type: string;
  faqable_id: number;
  user_id: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}

export interface CommentIndex {
  id: number;
  commentable_type: string;
  commentable_id: number;
  text: string;
  parent_id: number;
  status: string;
  user_id: number;
  update_user_id: number;
  created_at: null | string;
  updated_at: null | string;
  childs_count: number;
  user: {
    id: number;
    name: null | string;
    cellphone: string;
  };
}

export interface CommentShow {
  id: number;
  commentable_type: string;
  commentable_id: number;
  text: string;
  parent_id: number;
  status: string;
  user_id: number;
  update_user_id: number;
  created_at: null;
  updated_at: null;
  user: {
    id: number;
    name: string;
    cellphone: string;
  };
  childs: any[];
}

export interface Deparment {
  id: number;
  name: string;
}

export interface PageIndex {
  id: number;
  title: string;
  description: null | string;
  slug: string;
  primary_image: null | string;
  seo_title: null | string;
  seo_description: null | string;
  body: null | string;
  mode: string;
  status: string;
  schemas: null | string;
  json: string;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}

export interface PageShow {
  id: number;
  title: string;
  description: null | string;
  slug: string;
  primary_image: null | string;
  seo_title: null | string;
  seo_description: null | string;
  body: null | string;
  mode: number;
  status: string;
  schemas: null | string;
  json: string;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}

export interface ShippingmethodIndex {
  id: number;
  name: string;
  code: string;
  base_cost: number;
  per_km_cost: number;
  per_weight_cost: number;
  is_user_pay: number;
  description: string;
  is_active: number;
  config: null;
  created_at: string;
  updated_at: string;
}

export interface ShippingmethodShow {
  id: number;
  name: string;
  code: string;
  base_cost: number;
  per_km_cost: number;
  per_weight_cost: number;
  is_user_pay: number;
  description: string;
  is_active: number;
  config: null;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: number;
  logo: string;
  title: string;
  description: string;
  seo_title: string;
  seo_description: string;
  faqs: {
    subject: string;
    body: string;
  }[];
  colors: string;
  socials: {
    name: string;
    value: string;
    icon: string | null;
  }[];
  telephones: {
    name: string;
    value: string;
  }[];
  addresses: {
    name: string;
    value: string;
    latitude: string;
    longitude: string;
  }[];
  theme_colors: Theme;
  benefits_buy: {
    title: string;
    description: string;
    icon: string;
  }[];
  schemas: string;
  created_at: string;
  updated_at: string;
}
export interface Theme {
  light: ThemeList;
  dark: ThemeList;
}
interface ThemeList {
  primary: string;
  primaryForeground: string;
  primary50: string;
  primary100: string;
  primary200: string;
  secondary: string;
  secondaryForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  border2: string;
  bodyBg: string;
  mainBg: string;
  success: string;
  successForeground: string;
  failure: string;
  link: string;
  lightLink: string;
  boxBg100: string;
  boxBg200: string;
  boxBg250: string;
  boxBg300: string;
  boxBg400: string;
  boxBg500: string;
  TextColor: string;
  TextLow: string;
  TextMute: string;
  TextReverse: string;
  accentColor1: string;
  accentColor1Foreground: string;
  accentColor2: string;
  accentColor2Foreground: string;
  accentColor3: string;
  accentColor3Foreground: string;
  accentColor4: string;
  accentColor4Foreground: string;
}

export interface OrderIndex {
  id: number;
  user_id: number;
  address_id: number;
  shipping_method_id: number;
  delivery_serial: null;
  delivery_amount: number;
  coupon_id: number;
  coupon_amount: number;
  total_amount: number;
  paying_amount: number;
  total_weight: number;
  payment_status: string;
  status: string;
  description: null;
  created_at: string;
  updated_at: string;
  items_count: number;
  user: {
    id: number;
    name: string;
    cellphone: string;
  };
}

export interface OrderShow {
  id: number;
  user_id: number;
  address_id: number;
  shipping_method_id: number;
  delivery_serial: null;
  delivery_amount: number;
  coupon_id: number;
  coupon_amount: number;
  total_amount: number;
  paying_amount: number;
  total_weight: number;
  payment_status: "pending" | "success" | "rejected";
  status: "pending" | "payout" | "prepare" | "send" | "end" | "cancel";
  description: null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    cellphone: string;
  };
  items: {
    id: number;
    order_id: number;
    product_id: number;
    variation_id: number;
    price: number;
    quantity: number;
    created_at: string;
    updated_at: string;
    product: {
      id: number;
      name: string;
      slug: string;
      quantity_check: boolean;
      sale_check: boolean;
      price_check:
        | {
            id: number;
            attribute_id: number;
            product_id: number;
            value: string;
            quantity: number;
            sku: string;
            price: number;
            sale_price: number;
            date_sale_from: null;
            date_sale_to: null;
            user_id: number;
            deleted_at: null;
            created_at: string;
            updated_at: string;
          }
        | false;
      rate: number;
    };
    variation: {
      id: number;
      attribute_id: number;
      product_id: number;
      value: string;
      quantity: number;
      sku: string;
      price: number;
      sale_price: number;
      date_sale_from: null;
      date_sale_to: null;
      user_id: number;
      deleted_at: null;
      created_at: string;
      updated_at: string;
    };
  }[];
  transactions: {
    id: number;
    user_id: number;
    order_id: number;
    amount: number;
    ref_id: string;
    token: string;
    description: null;
    gateway_name: string;
    status: string;
    created_at: string;
    updated_at: string;
  }[];
  address: {
    id: number;
    title: string;
    receiver_name: string;
    cellphone: string;
    address: string;
    postal_code: null;
    province_id: number;
    city_id: number;
    user_id: number;
    longitude: null;
    latitude: null;
    deleted_at: null;
    created_at: string;
    updated_at: string;
  };
  coupon: {
    id: number;
    name: string;
    code: string;
    type: string;
    value: number;
    max_amount: number;
    expire_at: string;
    is_multi: number;
    description: null;
    created_at: string;
    updated_at: string;
  };
}

export interface CouponIndex {
  id: number;
  name: string;
  code: string;
  type: string;
  value: number;
  max_amount: number;
  expire_at: string;
  is_multi: number;
  description: null | string;
  created_at: string;
  updated_at: string;
}

export interface CouponShow {
  id: number;
  name: string;
  code: string;
  type: string;
  value: number;
  max_amount: number;
  expire_at: string;
  is_multi: number;
  description: null | string;
  created_at: string;
  updated_at: string;
}

export interface ProductVariationIndex {
  id: number;
  attribute_id: number;
  product_id: number;
  value: string;
  quantity: number;
  sku: string;
  price: number;
  sale_price: null | number;
  date_sale_from: null | string;
  date_sale_to: null | string;
  user_id: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}

export interface DashboardPanel {
  top_customers: {
    id: number;
    name: null | string;
    cellphone: string;
  }[];
  orders: {
    total: number;
    ended: number;
    prepare: number;
    pending: number;
    cancel: number;
  };
  transactions: {
    total: number;
    total_payment: number;
  };
  chart_transactions: {
    [date: string]: {
      month: string;
      count: number;
      total_pay: number;
    };
  };
  top_products: {
    id: number;
    name: string;
    slug: string;
    primary_image: null | string;
    total_sold: null | string;
    quantity_check: boolean | number;
    rate: number;
  }[];
  users_count: number;
  products_count: number;
  posts_count: number;
}

/////////////////////////////// site /////////////////////////////////////

export interface Initials {
  categories: {
    id: number;
    name: string;
    slug: string;
    type: string;
    icon: null | string;
    priority: number;
    childs: {
      id: number;
      name: string;
      slug: string;
      parent_id: string;
      icon: string;
      priority: number;
      childs: any[];
    }[];
  }[];
  setting: Setting;
  brands: {
    id: number;
    name: string;
    slug: string;
    primary_image: null | string;
    type: string;
  }[];
}

export interface ProfileSite {
  user: {
    id: number;
    name: string;
    cellphone: string;
    email: string;
    email_verified_at: null;
    primary_image: string;
    status: string;
    update_user_id: number;
    is_active: number;
    created_at: string;
    updated_at: string;
    deleted_at: null;
  };
}

export interface Transactions {
  transactions: {
    id: number;
    user_id: number;
    order_id: number;
    amount: number;
    ref_id: string;
    token: string;
    description: null;
    gateway_name: string;
    status: string;
    created_at: string;
    updated_at: string;
  }[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface PostsIndexSite {
  posts: {
    id: number;
    title: string;
    slug: string;
    description: string;
    primary_image: string;
    updated_at: string;
    category_id: number;
    comments_count: number;
    rate: number;
    category: {
      id: number;
      name: string;
      slug: string;
    };
  }[];
  important_posts: {
    id: number;
    title: string;
    slug: string;
    description: string;
    primary_image: string;
    updated_at: string;
    category_id: number;
    rate: number;
    category: {
      id: number;
      name: string;
      slug: string;
    };
  }[];
  latest_posts: {
    id: number;
    title: string;
    slug: string;
    description: string;
    primary_image: string;
    updated_at: string;
    category_id: number;
    rate: number;
    category: {
      id: number;
      name: string;
      slug: string;
    };
  }[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  banners: {
    id: number;
    title: string;
    pre_title: null;
    text: null;
    btn_text: null;
    url: string;
    image: string;
    mode: string;
    priority: number;
    is_active: number;
    created_at: string;
    updated_at: string;
  }[];
}

export interface PostShowSite {
  id: number;
  title: string;
  slug: string;
  category_id: number;
  primary_image: null | string;
  description: string;
  seo_title: string;
  seo_description: string;
  body: string;
  status: string;
  is_important: number;
  is_active: number;
  update_user_id: null;
  deleted_at: null;
  created_at: string;
  updated_at: string;
  views_count: number;
  comments_count: number;
  related_posts: {
    title: string;
    slug: string;
    primary_image: null;
    description: string;
    updated_at: string;
    comments_count: number;
    views_count: number;
    rate: number;
  }[];
  rate: number;
  faqs: {
    id: number;
    subject: string;
    body: string;
    faqable_type: string;
    faqable_id: number;
  }[];
  comments: any[];
  tags: {
    name: string;
    slug: string;
    pivot: {
      taggable_type: string;
      taggable_id: number;
      tag_id: number;
    };
  }[];
  category: {
    id: number;
    name: string;
    slug: string;
    primary_image: string;
  } | null;
}

export interface PageShowSite {
  id: number;
  title: string;
  description: string;
  slug: string;
  primary_image: string;
  seo_title: string;
  seo_description: string;
  body: string;
  status: string;
  schemas: null;
  json: string;
  deleted_at: null;
  created_at: string;
  updated_at: string;
  mode: string;
}

export interface Index {
  categories: {
    id: number;
    name: string;
    slug: string;
    icon: null;
    primary_image: string;
    products_count: number;
  }[];
  banners: {
    slider: {
      title: string;
      pre_title: string;
      text: string;
      btn_text: string;
      url: string;
      image: string;
      mode: string;
    }[];
    shop: {
      title: string;
      pre_title: null;
      text: null;
      btn_text: null;
      url: null;
      image: string;
      mode: string;
    }[];
    blog: {
      title: string;
      pre_title: null;
      text: null;
      btn_text: null;
      url: null;
      image: string;
      mode: string;
    }[];
    call_to_action: {
      title: string;
      pre_title: string;
      text: string;
      btn_text: string;
      url: string;
      image: string;
      mode: string;
    }[];
    three: {
      title: string;
      pre_title: string;
      text: string;
      btn_text: string;
      url: string;
      image: string;
      mode: string;
    }[];
  };
  posts: {
    title: string;
    slug: string;
    category_id: number;
    primary_image: string;
    description: string;
    updated_at: string;
    rate: number;
    category: {
      id: number;
      name: string;
      slug: string;
    };
  }[];
  latest_products: {
    id: number;
    name: string;
    slug: string;
    primary_image: null | string;
    updated_at: string;
    category_id: number;
    brand_id: null | number;
    country_id: null | number;
    quantity_check: boolean | number;
    sale_check: boolean;
    price_check:
      | {
          id: number;
          attribute_id: number;
          product_id: number;
          value: string;
          quantity: number;
          sku: string;
          price: number;
          sale_price: number;
          date_sale_from: string;
          date_sale_to: string;
          user_id: number;
          deleted_at: null;
          created_at: string;
          updated_at: string;
        }
      | {
          id: number;
          attribute_id: number;
          product_id: number;
          value: string;
          quantity: number;
          sku: string;
          price: number;
          sale_price: number;
          date_sale_from: null;
          date_sale_to: null;
          user_id: number;
          deleted_at: null;
          created_at: string;
          updated_at: string;
        }
      | false;
    rate: number;
    is_wished: boolean;
    category: {
      id: number;
      name: string;
      slug: string;
    };
    brand: {
      id: number;
      name: string;
      slug: string;
    } | null;
    country: {
      id: number;
      fa_name: string;
    } | null;
    images: {
      id: number;
      product_id: number;
      image: string;
      is_active: number;
      created_at: string;
      updated_at: string;
    }[];
  }[];
  carousels: any[];
}

export interface ProductShowSite {
  id: number;
  name: string;
  slug: string;
  primary_image: string;
  seo_title: string;
  seo_description: string;
  weight: number;
  category_id: number;
  brand_id: null;
  country_id: null;
  details: string;
  description: string;
  content: string;
  garranty_type: "repair" | "replace" | "none";
  garranty_day: number;
  user_id: null;
  is_active: number;
  created_at: string;
  updated_at: string;
  views_count: number;
  related_products: {
    id: number;
    name: string;
    slug: string;
    primary_image: null | string;
    category_id: number;
    quantity_check: boolean | number;
    sale_check: boolean;
    price_check:
      | {
          id: number;
          attribute_id: number;
          product_id: number;
          value: string;
          quantity: number;
          sku: string;
          price: number;
          sale_price: number | null;
          date_sale_from: string;
          date_sale_to: string;
          user_id: number;
          deleted_at: null;
          created_at: string;
          updated_at: string;
        }
      | false;
    rate: number;
    is_wished: boolean;
    category: {
      id: number;
      name: string;
      slug: string;
    };
    brand: null;
    images: {
      id: number;
      product_id: number;
      image: string;
      is_active: number;
      created_at: string;
      updated_at: string;
    }[];
  }[];
  quantity_check: boolean;
  sale_check: boolean;
  price_check:
    | {
        id: number;
        attribute_id: number;
        product_id: number;
        value: string;
        quantity: number;
        sku: string;
        price: number;
        sale_price: number;
        date_sale_from: string;
        date_sale_to: string;
        user_id: number;
        deleted_at: null;
        created_at: string;
        updated_at: string;
      }
    | false;
  rate: number;
  is_wished: boolean;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  images: {
    id: number;
    image: string;
    product_id: number;
  }[];
  attributes_value: {
    id: number;
    name: string;
    slug: string;
    is_active: number;
    update_user_id: null;
    created_at: string;
    updated_at: string;
    pivot: {
      product_id: number;
      attribute_id: number;
      value: string;
    };
  }[];
  variations: {
    id: number;
    attribute_id: number;
    product_id: number;
    value: string;
    quantity: number;
    sku: string;
    price: number;
    sale_price: number;
    date_sale_from: null | string;
    date_sale_to: null | string;
    user_id: number;
    deleted_at: null;
    created_at: string;
    updated_at: string;
    attribute: {
      id: number;
      name: string;
    };
  }[];
  brand: {
    id: number;
    name: string;
    slug: string;
    primary_image: string;
  };
  country: {
    id: number;
    fa_name: string;
  };
  faqs: {
    id: number;
    subject: string;
    body: string;
    faqable_type: string;
    faqable_id: number;
  }[];
  tags: {
    id: number;
    name: string;
    slug: string;
    pivot: {
      taggable_type: string;
      taggable_id: number;
      tag_id: number;
    };
  }[];
}

export interface ProductIndexSite {
  products: {
    id: number;
    name: string;
    slug: string;
    primary_image: null | string;
    category_id: number;
    brand_id: null | number;
    quantity_check: boolean | number;
    sale_check: boolean;
    price_check:
      | {
          id: number;
          attribute_id: number;
          product_id: number;
          value: string;
          quantity: number;
          sku: string;
          price: number;
          sale_price: number;
          date_sale_from: string;
          date_sale_to: string;
          user_id: number;
          deleted_at: null;
          created_at: string;
          updated_at: string;
        }
      | {
          id: number;
          attribute_id: number;
          product_id: number;
          value: string;
          quantity: number;
          sku: string;
          price: number;
          sale_price: number;
          date_sale_from: null;
          date_sale_to: null;
          user_id: number;
          deleted_at: null;
          created_at: string;
          updated_at: string;
        }
      | false;
    rate: number;
    is_wished: boolean;
    category: {
      id: number;
      name: string;
      slug: string;
    };
    brand: {
      id: number;
      name: string;
      slug: string;
    } | null;
    images: {
      id: number;
      product_id: number;
      image: string;
      is_active: number;
      created_at: string;
      updated_at: string;
    }[];
  }[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  banners: {
    id: number;
    title: string;
    pre_title: null;
    text: null;
    btn_text: null;
    url: string;
    image: string;
    mode: string;
    priority: number;
    is_active: number;
    created_at: string;
    updated_at: string;
  }[];
}

export interface ProductCategoryShowSite {
  id: number;
  name: string;
  slug: string;
  parent_id: string;
  type: string;
  banners: {
    id: number;
    title: string;
    pre_title: null;
    text: null;
    btn_text: null;
    url: string;
    image: string;
    mode: string;
    priority: number;
    is_active: number;
    created_at: string;
    updated_at: string;
  }[];
  data: {
    products: {
      id: number;
      name: string;
      slug: string;
      primary_image: string;
      category_id: number;
      brand_id: null;
      quantity_check: boolean;
      sale_check: boolean;
      price_check: {
        id: number;
        attribute_id: number;
        product_id: number;
        value: string;
        quantity: number;
        sku: null;
        price: number;
        sale_price: number;
        date_sale_from: null;
        date_sale_to: null;
        user_id: number;
        deleted_at: null;
        created_at: string;
        updated_at: string;
      };
      rate: number;
      is_wished: boolean;
      brand: null;
      images: {
        id: number;
        product_id: number;
        image: string;
        is_active: number;
        created_at: string;
        updated_at: string;
      }[];
    }[];
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      per_page: number;
      to: number;
      total: number;
    };
  };
  parent: null | {
    id: number;
    name: string;
    slug: string;
    parent_id: string;
  };
  attributes: {
    id: number;
    name: string;
    slug: string;
    is_active: number;
    update_user_id: null;
    created_at: string;
    updated_at: string;
    pivot: {
      category_id: number;
      attribute_id: number;
    };

    values: {
      attribute_id: number;
      value: string;
    }[];
  }[];
}

export interface CompareIndex {
  id: number;
  name: string;
  slug: string;
  primary_image: string;
  seo_title: string;
  seo_description: string;
  weight: number;
  category_id: number;
  brand_id: null | number;
  country_id: null | number;
  details: string;
  description: string;
  content: string;
  garranty_type: string;
  garranty_day: number;
  user_id: null;
  is_active: number;
  created_at: string;
  updated_at: string;
  quantity_check: boolean;
  sale_check: boolean;
  price_check: {
    id: number;
    attribute_id: number;
    product_id: number;
    value: string;
    quantity: number;
    sku: string;
    price: number;
    sale_price: null;
    date_sale_from: null;
    date_sale_to: null;
    user_id: number;
    deleted_at: null;
    created_at: string;
    updated_at: string;
  };
  rate: number;
  is_wished: boolean;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  attributes_value: {
    id: number;
    name: string;
    slug: string;
    is_active: number;
    update_user_id: null;
    created_at: string;
    updated_at: string;
    pivot: {
      product_id: number;
      attribute_id: number;
      value: string;
    };
  }[];
  variations: {
    id: number;
    attribute_id: number;
    product_id: number;
    value: string;
    quantity: number;
    sku: string;
    price: number;
    sale_price: null | null | number;
    date_sale_from: null | null | string;
    date_sale_to: null | null | string;
    user_id: number;
    deleted_at: null;
    created_at: string;
    updated_at: string;
    attribute: {
      id: number;
      name: string;
    };
  }[];
  brand: {
    id: number;
    name: string;
    slug: string;
    primary_image: string;
  } | null;
  country: {
    id: number;
    fa_name: string;
  } | null;
}

export interface WishlistIndex {
  user_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    name: string;
    slug: string;
    primary_image: null | string;
    quantity_check: boolean | number;
    sale_check: boolean;
    price_check:
      | {
          id: number;
          attribute_id: number;
          product_id: number;
          value: string;
          quantity: number;
          sku: string;
          price: number;
          sale_price: null | number;
          date_sale_from: null;
          date_sale_to: null;
          user_id: number;
          deleted_at: null;
          created_at: string;
          updated_at: string;
        }
      | boolean;
    rate: number;
    is_wished: boolean;
  };
}

export interface OrdersIndexSite {
  orders: {
    id: number;
    user_id: number;
    address_id: number;
    shipping_method_id: number;
    delivery_serial: string;
    delivery_amount: number;
    coupon_id: number;
    coupon_amount: number;
    total_amount: number;
    paying_amount: number;
    total_weight: number;
    payment_status: string;
    status: string;
    description: string;
    created_at: string;
    updated_at: string;
    items_count: number;
  }[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface OrderShowSite {
  id: number;
  user_id: number;
  address_id: number;
  shipping_method_id: number;
  delivery_serial: string;
  delivery_amount: number;
  coupon_id: number;
  coupon_amount: number;
  total_amount: number;
  paying_amount: number;
  total_weight: number;
  payment_status: string;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
  items: {
    id: number;
    order_id: number;
    product_id: number;
    variation_id: number;
    price: number;
    quantity: number;
    created_at: string;
    updated_at: string;
    product: null | {
      id: number;
      name: string;
      slug: string;
      primary_image: string;
      quantity_check: number;
      sale_check: boolean;
      price_check: {
        id: number;
        attribute_id: number;
        product_id: number;
        value: string;
        quantity: number;
        sku: string;
        price: number;
        sale_price: null;
        date_sale_from: null;
        date_sale_to: null;
        user_id: number;
        deleted_at: null;
        created_at: string;
        updated_at: string;
      };
      rate: number;
      is_wished: boolean;
    };
    variation: {
      id: number;
      sku: string;
      price: number;
      value: string;
      user_id: number;
      quantity: number;
      attribute: {
        id: number;
        name: string;
        slug: string;
      };
      created_at: string;
      deleted_at: null;
      product_id: number;
      sale_price: null;
      updated_at: string;
      attribute_id: number;
      date_sale_to: null;
      date_sale_from: null;
    };
  }[];
  address: {
    id: number;
    title: string;
    receiver_name: string;
    cellphone: string;
    address: string;
    postal_code: null;
    province_id: number;
    city_id: number;
    user_id: number;
    longitude: null;
    latitude: null;
    deleted_at: null;
    created_at: string;
    updated_at: string;
  };
  shipping: {
    id: number;
    name: string;
  };
}

export interface Address {
  id: number;
  title: string;
  receiver_name: string;
  cellphone: string;
  address: string;
  postal_code: string;
  province_id: number;
  city_id: number;
  user_id: number;
  longitude: string;
  latitude: string;
  deleted_at: null;
  created_at: string;
  updated_at: string;
  province: {
    id: number;
    name: string;
    slug: string;
    created_at: null;
    updated_at: null;
  };
  city: {
    id: number;
    name: string;
    slug: string;
    province_id: number;
    created_at: null;
    updated_at: null;
  };
}

export interface City {
  id: number;
  name: string;
  slug: string;
  province_id: number;
  created_at: null;
  updated_at: null;
}

export interface CommentsIndexSite {
  comments: {
    id: number;
    commentable_type: string;
    commentable_id: number;
    text: string;
    parent_id: number;
    status: string;
    user_id: number;
    update_user_id: number;
    created_at: string;
    updated_at: string;
    childs_count: number;
    user: {
      id: number;
      name: string;
      cellphone: string;
      primary_image: string;
    };
    childs: {
      id: number;
      commentable_type: string;
      commentable_id: number;
      text: string;
      parent_id: number;
      status: string;
      user_id: number;
      update_user_id: number;
      created_at: string;
      updated_at: string;
    }[];
  }[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface CheckCoupon {
  name: string;
  code: string;
  type: "amount" | "percentage" | "";
  value: number;
  max_amount: number;
  description: null;
}

export interface Checkout {
  cartTotalAmount: number;
  cartSaleAmount: number;
  cartDeliveryAmount: number;
  cartWeight: number;
  items: {
    product: {
      id: number;
      name: string;
      slug: string;
      primary_image: string;
      quantity_check: boolean;
      rate: number;
      is_wished: boolean;
    };
    variation: {
      id: number;
      attribute_id: number;
      product_id: number;
      value: string;
      quantity: number;
      sku: string;
      price: number;
      sale_price: null | number;
      date_sale_from: null | string;
      date_sale_to: null | string;
      user_id: number;
      deleted_at: null;
      created_at: string;
      updated_at: string;
      attribute: {
        id: number;
        name: string;
        slug: string;
      };
    };
    quantity: string;
    price: number;
    json: string;
  }[];
  selected_shipping_method: {
    id: number;
    name: string;
    code: string;
    is_user_pay: number;
  };
  cartTotalPay: number;
  selected_address: {
    id: number;
    title: string;
    receiver_name: string;
    cellphone: string;
    address: string;
    postal_code: string;
    province_id: number;
    city_id: number;
    user_id: number;
    longitude: string;
    latitude: string;
    deleted_at: null;
    created_at: string;
    updated_at: string;
  };
  coupon: {
    couponID: number;
    type: string;
    couponTotalAmount: number;
  };
}

export interface ShippingmethodIndexSite {
  id: number;
  name: string;
  code: string;
  base_cost: number;
  per_km_cost: number;
  per_weight_cost: number;
  is_user_pay: number;
  description: null | string;
  is_active: number;
  config: null;
  created_at: string;
  updated_at: string;
}

export interface SitemapIndex {
  categories: {
    slug: string;
    type: string;
  }[];
  products: {
    slug: string;
  }[];
  posts: {
    slug: string;
  }[];
  pages: {
    slug: string;
    mode: string;
  }[];
}
