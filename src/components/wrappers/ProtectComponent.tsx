"use client";
import { useEffect, useState } from "react";
import { innerPermissions } from "@/constants/permissions";
import { useUserContext } from "@/contexts/UserContext";

interface ProtectComponentProps {
  permission: keyof typeof innerPermissions;
  component: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectComponent: React.FC<ProtectComponentProps> = ({
  permission,
  component,
  fallback = null,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { permissions, user } = useUserContext();
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return isMounted &&
    (permissions?.includes(innerPermissions[permission]) ||
      user?.roles?.find((r) => r.name === "super_admin")) ? (
    <>{component}</>
  ) : (
    fallback
  );
};

export default ProtectComponent;
