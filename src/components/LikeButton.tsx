"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  targetType: "blog" | "tool";
  targetId: string;
  initialLiked: boolean;
  initialLikes: number;
}

export default function LikeButton({ targetType, targetId, initialLiked, initialLikes }: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (pending) return;
    setPending(true);
    const prevLiked = liked;
    const prevLikes = likes;
    setLiked(!prevLiked);
    setLikes(prevLiked ? prevLikes - 1 : prevLikes + 1);
    try {
      const res = await fetch(`/api/${targetType === "blog" ? "blog" : "tools"}/${targetId}/like`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLiked(data.liked);
      setLikes(data.likes);
    } catch {
      setLiked(prevLiked);
      setLikes(prevLikes);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={liked}
      className={cn(
        "flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-colors",
        liked
          ? "bg-red-50 border-red-200 text-red-600"
          : "bg-white border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500"
      )}
    >
      <Heart className={cn("w-4 h-4", liked && "fill-red-500 text-red-500")} />
      {likes.toLocaleString()}
    </button>
  );
}
