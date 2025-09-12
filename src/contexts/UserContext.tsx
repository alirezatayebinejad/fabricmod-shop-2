"use client";
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { getAuth, GetAuth, setAuth } from "@/services/auth";
import apiCRUD from "@/services/apiCRUD";
import { Authme } from "@/types/apiTypes";

interface UserContextState {
  user?: ReturnType<GetAuth["user"]>;
  permissions?: ReturnType<GetAuth["perms"]>;
  isMounted?: boolean;
}

export const UserContext = createContext<UserContextState | undefined>(
  undefined,
);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserContextState["user"]>();
  const [permissions, setPermissions] =
    useState<UserContextState["permissions"]>();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      const isLoggedIn = getAuth?.session().isLoggedIn;

      // 1) Fast path: hydrate from cookies immediately
      const cachedUser = isLoggedIn ? getAuth?.user() : undefined;
      const cachedPerms = isLoggedIn ? getAuth?.perms() : undefined;
      setUser(cachedUser);
      setPermissions(cachedPerms);
      setIsMounted(true);

      // 2) Background refresh: fetch latest and update cookies/state
      if (!isLoggedIn) return;
      const res = await apiCRUD({ urlSuffix: "auth/me" });
      const authme: Authme = res?.data;
      if (authme) {
        setAuth.user(authme);
        setAuth.perms(authme.permissions);
        // Re-read to ensure we reflect sanitized cookie format
        setUser(getAuth?.user());
        setPermissions(getAuth?.perms());
      }
    };

    initializeUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        permissions,
        isMounted,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export default UserProvider;
