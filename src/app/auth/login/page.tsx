import AuthCard from "@/app/auth/_components/AuthCard";
import AuthLayout from "@/app/auth/_components/AuthLayout";
import { Suspense } from "react";

export default function Login() {
  return (
    <main>
      <AuthLayout>
        <Suspense>
          <div className="flex h-full w-full items-center justify-center">
            <AuthCard />
          </div>
        </Suspense>
      </AuthLayout>
    </main>
  );
}
