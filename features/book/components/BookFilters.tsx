"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BookFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [book, setBook] = useState(searchParams.get("book") ?? "");

  const [author, setAuthor] = useState(searchParams.get("author") ?? "");

  function applyFilters() {
    const params = new URLSearchParams(searchParams);

    if (book.trim()) {
      params.set("book", book);
    } else {
      params.delete("book");
    }

    if (author.trim()) {
      params.set("author", author);
    } else {
      params.delete("author");
    }

    router.push(`/?${params.toString()}`);
  }

  function clearFilters() {
  setBook("");
  setAuthor("");

  router.push("/");
}

  return (
    <div className="mb-8 flex flex-wrap items-end gap-4">
      <div>
        <p className="mb-2 text-sm font-medium">Book</p>

        <Input
          placeholder="Book title..."
          value={book}
          onChange={(e) => setBook(e.target.value)}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Author</p>

        <Input
          placeholder="Author name..."
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>

      <Button onClick={applyFilters}>Apply Filters</Button>

      <Button variant="outline" onClick={clearFilters}>
        Clear
      </Button>
    </div>
  );
}
