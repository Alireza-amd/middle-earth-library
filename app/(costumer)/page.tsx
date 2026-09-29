import { BookFilters } from "@/features/book/components/BookFilters";
import {
  AuthorMarquee,
  AuthorMarqueeSkeleton,
} from "@/components/AuthorMarquee";
import { PageHeader } from "@/components/PageHeader";
import {
  BookCardSkelton,
  CardSkeleton,
  SkeletonArray,
} from "@/components/Skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BookList } from "@/features/book/components/BookList";
import { SliderList } from "@/features/slider/components/SliderList";
import { BookSearch } from "@/features/book/components/BookSearch";
import { Suspense } from "react";
import { cacheTag } from "next/cache";
import { getBookGlobalTag } from "@/features/book/db/cache";
import { db } from "@/drizzle/db";
import { getAuthorGlobalTag } from "@/features/author/db/cache";
import { getCategoryGlobalTag } from "@/features/category/db/cache";

type Props = {
  searchParams: Promise<{
    book?: string;
    author?: string;
  }>;
};
export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <>
      <div className="container">
        <Suspense
          fallback={
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              Loading slider...
            </div>
          }
        >
          <Carousel>
            <CarouselContent>
              <SliderList />
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </Suspense>

        {/* <BookSearch /> */}

        <PageHeader title="Popular Authors" />
        <Suspense fallback={<AuthorMarqueeSkeleton />}>
          <AuthorMarquee />
        </Suspense>

        <PageHeader title="Books" />
        <BookFilters />

        <Suspense
          fallback={
            <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <SkeletonArray rows={5}>
                <BookCardSkelton />
              </SkeletonArray>
            </div>
          }
        >
          <BookList book={params.book} author={params.author} />
        </Suspense>
      </div>
    </>
  );
}

async function getBooks() {
  "use cache";

  cacheTag(getBookGlobalTag());

  return db.query.bookTable.findMany({
    columns: {
      id: true,
      title: true,
    },
    orderBy: (book, { asc }) => [asc(book.title)],
  });
}
async function getAuthors() {
  "use cache";

  cacheTag(getAuthorGlobalTag());

  return db.query.authorTable.findMany({
    columns: {
      id: true,
      name: true,
    },
    orderBy: (author, { asc }) => [asc(author.name)],
  });
}
async function getCategories() {
  "use cache";

  cacheTag(getCategoryGlobalTag());

  return db.query.categoryTable.findMany({
    columns: {
      id: true,
      title: true,
    },
    orderBy: (category, { asc }) => [asc(category.title)],
  });
}
