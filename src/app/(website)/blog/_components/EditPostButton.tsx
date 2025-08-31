"use client";
import { useUserContext } from "@/contexts/UserContext";
import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

export default function EditPostButton({ postId }: { postId: number }) {
  const { user } = useUserContext();
  if (!user?.roles.some((r) => r.name === "admin" || r.name === "super_admin"))
    return null;
  else
    return (
      <div>
        <Button
          as={Link}
          href={`/panel/posts/edit/${postId}`}
          size="sm"
          prefetch={false}
          target="_blank"
          className="flex h-6 min-h-0 cursor-pointer gap-1 rounded-md bg-gradient-to-tl from-accent-1 to-accent-2 px-1 !text-TextSize200 text-accent-1-foreground"
        >
          <Pencil className="w-3 text-accent-1-foreground" /> ویرایش این پست
        </Button>
      </div>
    );
}
