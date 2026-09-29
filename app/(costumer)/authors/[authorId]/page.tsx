import { getCurrentUser } from "@/auth/currentUser";
import { db } from "@/drizzle/db";
import {
  authorTable,
  bookTable,
  reserveTable,
  UNAVAILABLE_BOOK_STATUSES,
} from "@/drizzle/schema";
import { getAuthorIdTag } from "@/features/author/db/cache";
import { getBookIdTag } from "@/features/book/db/cache";
import {
  getCategoryGlobalTag,
  getCategoryIdTag,
} from "@/features/category/db/cache";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getReserveGlobalTag } from "@/features/reserve/db/cache";
import { getAuthorTag, getBookTag } from "@/lib/cacheTag";
import { eq, sql } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";

export default function AuthorIdPage({
  params,
}: {
  params: Promise<{ authorId: string }>;
}) {
  return (
    <div className="container">
      <Suspense fallback="Loading...">
        <AuthorId params={params} />
      </Suspense>
    </div>
  );
}

async function AuthorId({ params }: { params: Promise<{ authorId: string }> }) {
  const { authorId } = await params;
  const author = await getAuthorById(authorId);
  const books = await getAuthorBooks(authorId);

  return (
    <>
      <PageHeader title="Author" />
      <div className="rounded-lg px-4 py-2 shadow-lg mb-8">
        <div className="flex justify-between items-stretch">
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex flex-col gap-2 grow">
              <h1 className="font-pop text-2xl font-semibold">{author.name}</h1>
              <p className="font-sans">{author.description}</p>
            </div>
          </div>
        </div>
      </div>
      <PageHeader title={`${author.name} Books`} />
      {books.length > 0 ? (
        <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {books.map((book) => (
            <Card key={book.id}>
              <CardHeader>
                <CardTitle className="font-pop flex justify-between">
                  <span>{book.title}</span>
                  <span className="text-gray-400 size-8 flex items-center justify-center rounded-full bg-gray-700">
                    {book.availableCount}
                  </span>
                </CardTitle>
                <CardDescription className="h-15 line-clamp-3">
                  {book.desc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-start gap-4">
                  <Link
                    className=" bg-amber-100 text-amber-500"
                    href={`/authors/${book.author.id}`}
                  >
                    {book.author.name}
                  </Link>
                  <div className="flex gap-1 flex-wrap h-14 truncate">
                    {book.bookCategories.map((category) => (
                      <Link key={category.id} href={`/category/${category.id}`}>
                        <Badge className="text-sm font-mono">
                          {category.title}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                  <div className="aspect-square relative w-full">
                    <Image src={book.imagePath} alt="bookImage" fill />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full hover:bg-amber-100 hover:text-amber-500 text-amber-100 bg-amber-500"
                  variant="outline"
                >
                  <Link href={`/books/${book.id}`}>Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <h1>There is no book yet.</h1>
      )}
    </>
  );
}

async function getAuthorById(id: string) {
  "use cache";

  const author = await db.query.authorTable.findFirst({
    columns: { id: true, name: true, description: true },
    where: eq(authorTable.id, id),
  });

  if (author == null) throw new Error("There is no author with this id.");

  cacheTag(getAuthorIdTag(id));

  return author;
}

async function getAuthorBooks(authorId: string) {
  "use cache";

  cacheTag(
    getAuthorTag("book", authorId),
    getCategoryGlobalTag(),
    getReserveGlobalTag(),
  );

  const books = await db.query.bookTable.findMany({
    where: eq(bookTable.authorId, authorId),
    columns: { id: true, desc: true, imagePath: true, title: true },
    with: {
      author: { columns: { id: true, name: true } },
      bookCategories: {
        columns: {},
        with: { category: { columns: { id: true, title: true } } },
      },
    },
  });

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
    .leftJoin(reserveTable, eq(bookTable.id, reserveTable.bookId))
    .groupBy(bookTable.id);

  const bookEntityMap = new Map(
    bookEntity.map((book) => [book.id, book.entity - book.reserveCount]),
  );

  const bookInfo = books.map((book) => ({
    ...book,
    availableCount: bookEntityMap.get(book.id),
    bookCategories: book.bookCategories.map(
      (bookCategory) => bookCategory.category,
    ),
  }));

  bookInfo.forEach((book) => cacheTag(getAuthorIdTag(book.author.id)));

  return bookInfo;
}
