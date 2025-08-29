import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Authme, LoginData } from "@/types/apiTypes";
import { cookiesNames } from "@/constants/cacheNames";
import { decrypt, encrypt } from "@/utils/crypto";
import { deleteCookie, getCookie, setCookie } from "@/utils/cookieCRUD";

type SanitizedUser = {
  id: number;
  name: string;
  cellphone: string;
  email: string;
  primary_image: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  roles: {
    id: number;
    name: string;
    display_name: string;
  }[];
};

export type GetAuth = {
  session: (userSessionCookie?: string) => {
    token: string | undefined;
    isLoggedIn: boolean;
  };
  user: (userInfoCookie?: string) => SanitizedUser | undefined;
  perms: (userPermsCookie?: string) => Authme["permissions"];
};
export type SetAuth = {
  session: (sessionData: { token: string; isLoggedIn: boolean }) => void;
  user: (userInfoCookie: Omit<Authme, "permissions">) => void;
  perms: (userPermsCookie: Authme["permissions"]) => void;
};

//set or get auth not available server side unless you send userSessionCookie
//userSessionCookie is only for when we are requesting from server side which getCookie will not work
export const getAuth: GetAuth = {
  session: (userSessionCookie) => {
    const cookieSession = userSessionCookie
      ? userSessionCookie
      : getCookie(cookiesNames.userSession);

    if (cookieSession) return decrypt(cookieSession);
    else
      return {
        token: undefined,
        isLoggedIn: false,
      };
  },
  user: (userInfoCookie) => {
    const cookieInfo = userInfoCookie
      ? userInfoCookie
      : getCookie(cookiesNames.userInfo);

    if (cookieInfo) return decrypt(cookieInfo) as SanitizedUser;
    else return undefined;
  },
  perms: (userPermsCookie) => {
    const cookiePerms = userPermsCookie
      ? userPermsCookie
      : getCookie(cookiesNames.userPermissions);

    if (cookiePerms) return decrypt(cookiePerms);
    else return undefined;
  },
};

export const setAuth: SetAuth = {
  session: (userSession) => {
    setCookie(cookiesNames.userSession, encrypt(userSession), 45);
  },
  user: (userInfo) => {
    const sanitizedUser: SanitizedUser | undefined = userInfo
      ? {
          id: userInfo.id,
          name: userInfo.name,
          cellphone: userInfo.cellphone,
          email: userInfo.email,
          primary_image: userInfo.primary_image,
          is_active: userInfo.is_active,
          created_at: userInfo.created_at,
          updated_at: userInfo.updated_at,
          roles: Array.isArray(userInfo.roles)
            ? userInfo.roles.map((r) => ({
                id: r?.id,
                name: r?.name,
                display_name: r?.display_name,
              }))
            : [],
        }
      : undefined;

    setCookie(cookiesNames.userInfo, encrypt(sanitizedUser || {}), 45);
  },
  perms: (userPerms) => {
    setCookie(cookiesNames.userPermissions, encrypt(userPerms), 45);
  },
};

export const login = (logindata: LoginData) => {
  setAuth.session({
    token: logindata.token,
    isLoggedIn: true,
  });
  setAuth.user(logindata.user);
  setAuth.perms(logindata.user.permissions);
};

export function logout(
  router?: AppRouterInstance,
  callbackRoute: string | undefined = "/",
) {
  deleteCookie(cookiesNames.userSession);
  deleteCookie(cookiesNames.userInfo);
  deleteCookie(cookiesNames.userPermissions);
  if (router) {
    router.push(callbackRoute);
    router.refresh();
  }
}
