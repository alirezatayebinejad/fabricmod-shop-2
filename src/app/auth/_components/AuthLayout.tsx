import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-dvh bg-boxBg100">
      <div className="flex min-h-dvh">
        <div className="z-20 flex-[0.6] max-sm:flex-[1] max-sm:p-5">
          {children}
        </div>
        <div className="relative top-0 m-3 flex-[0.4] bg-white max-sm:absolute max-sm:bottom-[300px] max-sm:left-0 max-sm:right-0 max-sm:m-2">
          <div className="absolute bottom-0 left-0 right-0 top-0 z-10 rounded-lg bg-primary opacity-20"></div>
          <Image
            src={"/images/login.jpg"}
            alt="login image"
            priority
            fill
            style={{ objectFit: "cover" }}
            className="rounded-xl"
          />
        </div>
      </div>
    </main>
  );
}
