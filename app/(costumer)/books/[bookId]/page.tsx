import { getCurrentUser } from "@/auth/currentUser";
import { db } from "@/drizzle/db";
import {
  bookTable,
  reserveTable,
  UNAVAILABLE_BOOK_STATUSES,
} from "@/drizzle/schema";
import { getAuthorIdTag } from "@/features/author/db/cache";
import { getBookIdTag } from "@/features/book/db/cache";
import { getCategoryIdTag } from "@/features/category/db/cache";
import { getBookTag } from "@/lib/cacheTag";
import { eq, sql } from "drizzle-orm";
import { cacheTag } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ActionButton } from "@/components/ActionButton";
import { insertReserve } from "@/features/reserve/action/reserve";
import { ZoomHover } from "@/components/ZoomHover";
import { Comments } from "@/features/comments/components/Comments";

export default function BookIdPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  return (
    <div className="container">
      <Suspense fallback="Loading...">
        <BookId params={params} />
      </Suspense>
    </div>
  );
}

async function BookId({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  const book = await getBookById(bookId);
  const user = await getCurrentUser({});

  return (
    <div className="border-2 border-amber-300 rounded-lg px-4 py-2 shadow-lg">
      <div className="flex justify-between items-stretch">
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex flex-col gap-2 grow">
            <h1 className="font-pop text-2xl font-semibold">{book.title}</h1>
            <p className="font-sans">{book.desc}</p>
            <Accordion
              type="single"
              collapsible
              className="bg-accent px-4 rounded-lg"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="cursor-pointer">
                  {book.author.name}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2 items-start">
                  <p>{book.author.description}</p>
                  <Link
                    className="font-mono hover:underline underline-offset-2 bg-amber-100 text-amber-500"
                    href={`/authors/${book.author.id}`}
                  >
                    {book.author.name}
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <fieldset className="border border-gray-300 rounded-md p-2 font-mono">
              <legend>categories</legend>
              <div className="flex gap-1 flex-wrap truncate">
                {book.bookCategories.map((category) => (
                  <Link key={category.id} href={`/category/${category.id}`}>
                    <Badge className="text-sm font-mono">
                      {category.title}
                    </Badge>
                  </Link>
                ))}
              </div>
            </fieldset>
            <Badge variant="secondary" className="text-md font-sans">
              {book.availableCount == 0
                ? "Not Available"
                : `Available count: ${book.availableCount}`}
            </Badge>
          </div>
          {book.availableCount > 0 ? (
            user == null ? (
              <Button asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
            ) : user.activePlan && user.activePlan > new Date() ? (
              <ActionButton
                action={insertReserve.bind(null, {
                  bookId: book.id,
                  userId: user.id,
                })}
              >
                reserve
              </ActionButton>
            ) : (
              <Button asChild>
                <Link href="/plans">Buy Plan</Link>
              </Button>
            )
          ) : (
            <div className={buttonVariants({ variant: "default" })}>
              Sorry it's not available
            </div>
          )}
        </div>
        <ZoomHover imageURL={book.imagePath} />
      </div>
      <Comments bookId={bookId} />
    </div>
  );
}

async function getBookById(id: string) {
  "use cache";

  const book = await db.query.bookTable.findFirst({
    columns: { id: true, desc: true, imagePath: true, title: true },
    where: eq(bookTable.id, id),
    with: {
      author: { columns: { id: true, name: true, description: true } },
      bookCategories: {
        columns: {},
        with: { category: { columns: { id: true, title: true } } },
      },
    },
  });

  if (book == null) throw new Error("There is no book with this id.");

  cacheTag(getBookIdTag(id), getBookTag("reserve", book.id));

  const bookEntity = await db
    .select({
      id: bookTable.id,
      entity: bookTable.entity,
      reserveCount: sql<number>`
      COUNT(CASE 
        WHEN ${reserveTable.status} IN ${sql.raw(`('${UNAVAILABLE_BOOK_STATUSES.join("','")}')`)}
        THEN ${reserveTable.id} 
      END)
    `,
    })
    .from(bookTable)
    .where(eq(bookTable.id, id))
    .leftJoin(reserveTable, eq(bookTable.id, reserveTable.bookId))
    .groupBy(bookTable.id);

  const bookEntityMap = new Map(
    bookEntity.map((book) => [book.id, book.entity - book.reserveCount]),
  );
  const bookInfo = {
    ...book,
    availableCount: bookEntityMap.get(book.id) ?? 0,
    bookCategories: book.bookCategories.map(
      (bookCategory) => bookCategory.category,
    ),
  };

  cacheTag(getAuthorIdTag(book.author.id));
  bookInfo.bookCategories.forEach((category) => getCategoryIdTag(category.id));

  return bookInfo;
}
