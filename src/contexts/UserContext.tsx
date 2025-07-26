"use client";
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { getAuth, GetAuth } from "@/services/auth";

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
    const isLoggedIn = getAuth?.session().isLoggedIn;
    const user = isLoggedIn ? getAuth?.user() : undefined;
    const permissions = isLoggedIn ? getAuth?.perms() : undefined;
    setUser(user);
    setPermissions(permissions);
    setIsMounted(true);
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
