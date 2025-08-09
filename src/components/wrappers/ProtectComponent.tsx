"use client";
import { useEffect, useState } from "react";
import { innerPermissions } from "@/constants/permissions";

interface ProtectComponentProps {
  permission: keyof typeof innerPermissions;
  component: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectComponent: React.FC<ProtectComponentProps> = ({
  /*  permission, */
  component,
  fallback = null,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  /*   const { permissions, user } = useUserContext(); */
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return isMounted /* TODO &&
    (permissions?.includes(innerPermissions[permission]) ||
      user?.roles?.find((r) => r.name === "super-admin")) */ ? (
    <>{component}</>
  ) : (
    fallback
  );
};

export default ProtectComponent;
