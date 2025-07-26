import { decrypt, encrypt } from "@/utils/crypto";
import { deleteCookie, getCookie, setCookie } from "@/utils/cookieCRUD";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Authme, LoginData } from "@/types/apiTypes";
import { cookiesNames } from "@/constants/cacheNames";

export type GetAuth = {
  session: (userSessionCookie?: string) => {
    token: string;
    isLoggedIn: boolean;
  };
  user: (userInfoCookie?: string) => Omit<Authme, "permissions">;
  perms: (userPermsCookie?: string) => Authme["permissions"];
};
export type SetAuth = {
  session: (sessionData: { token: string; isLoggedIn: boolean }) => void;
  user: (userInfoCookie: Omit<Authme, "permissions">) => void;
  perms: (userPermsCookie: Authme["permissions"]) => void;
};

//set or get auth not available server side
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

    if (cookieInfo) return decrypt(cookieInfo);
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
    setCookie(cookiesNames.userInfo, encrypt(userInfo), 45);
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

export function logout(router: AppRouterInstance) {
  deleteCookie(cookiesNames.userSession);
  deleteCookie(cookiesNames.userInfo);
  deleteCookie(cookiesNames.userPermissions);
  if (router) {
    router.push("/auth/login");
    router.refresh();
  }
}
