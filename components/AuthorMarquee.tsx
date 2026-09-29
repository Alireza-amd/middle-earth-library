import Link from "next/link";
import { Marquee } from "./ui/marquee";
import { Badge } from "@/components/ui/badge";
import { cacheTag } from "next/cache";
import { getAuthorGlobalTag } from "@/features/author/db/cache";
import { db } from "@/drizzle/db";

export async function AuthorMarquee() {
  const authors = await getFeaturedAuthors();

  if (authors.length === 0) return null;

  return (
    <Marquee pauseOnHover reverse={false} className="[--duration:30s]">
      {authors.map((author) => (
        <Link key={author.id} href={`/authors/${author.id}`} className="mx-3">
          <Badge
            variant="secondary"
            className="
              rounded-full
              px-5
              py-2
              text-base
              transition-all
              hover:scale-105
              hover:bg-amber-500
              hover:text-white
            "
          >
            ✍️ {author.name}
          </Badge>
        </Link>
      ))}
    </Marquee>
  );
}

export function AuthorMarqueeSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-10 w-36 animate-pulse rounded-full bg-muted"
        />
      ))}
    </div>
  );
}

export async function getFeaturedAuthors(limit = 20) {
  "use cache";

  cacheTag(getAuthorGlobalTag());

  return db.query.authorTable.findMany({
    columns: {
      id: true,
      name: true,
    },
    limit,
    orderBy: (author, { asc }) => [asc(author.name)],
  });
}

function AuthorCard({
  author,
}: {
  author: {
    id: string;
    name: string;
  };
}) {
  return (
    <Link href={`/authors/${author.id}`}>
      <div
        className="
          mx-3
          rounded-xl
          border
          bg-card
          px-6
          py-4
          shadow-sm
          transition-all
          hover:-translate-y-1
          hover:shadow-lg
        "
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-amber-500 text-white">
            ✍️
          </div>

          <span className="font-semibold">{author.name}</span>
        </div>
      </div>
    </Link>
  );
}
