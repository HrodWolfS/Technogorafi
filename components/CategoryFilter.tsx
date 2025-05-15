"use client";

import type { FC } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import type { Category } from "@/lib/generated/prisma";

type Props = {
  categories: Category[];
};

export const CategoryFilter: FC<Props> = ({ categories }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";

  const setSelectedCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={!selectedCategory ? "secondary" : "outline"}
        onClick={() => setSelectedCategory("")}
      >
        Tous
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.name ? "secondary" : "outline"}
          onClick={() => setSelectedCategory(category.name)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};
