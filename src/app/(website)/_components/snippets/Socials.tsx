import { Initials } from "@/types/apiTypes";
import Link from "next/link";

interface SocialsProps {
  data?: Initials["setting"]["socials"];
}

export default function Socials({ data }: SocialsProps) {
  return (
    <section className="socials_icons flex items-center gap-4">
      {data?.map((d) => (
        <Link prefetch={false} key={d.name} href={d.value || "#"}>
          <div dangerouslySetInnerHTML={{ __html: d.icon! }}></div>
        </Link>
      ))}
    </section>
  );
}
