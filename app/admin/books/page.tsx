import { TableSkeleton } from "@/components/Skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthorTable } from "@/features/author/components/AuthorTable";
import { BookTable } from "@/features/book/components/BookTable";
import { CategoryTable } from "@/features/category/components/CategoryTable";
import { Suspense } from "react";

export default async function BooksPage() {
  return (
    <div className="container">
      <Tabs defaultValue="books">
        <TabsList>
          <TabsTrigger className="cursor-pointer" value="books">
            Books
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="category">
            Category
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="author">
            Author
          </TabsTrigger>
        </TabsList>
        <TabsContent value="books">
          <Suspense fallback={<TableSkeleton />}>
            <BookTable />
          </Suspense>
        </TabsContent>
        <TabsContent value="author">
          <Suspense fallback={<TableSkeleton />}>
            <AuthorTable />
          </Suspense>
        </TabsContent>
        <TabsContent value="category">
          <Suspense fallback={<TableSkeleton />}>
            <CategoryTable />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
