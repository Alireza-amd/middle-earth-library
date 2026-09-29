import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cacheTag } from "next/cache";
import { getBookGlobalTag } from "../db/cache";
import { db } from "@/drizzle/db";
import { PageHeader } from "@/components/PageHeader";
import { formatPlurals } from "@/lib/formatters";
import { getCategoryGlobalTag } from "@/features/category/db/cache";
import { getAuthorGlobalTag } from "@/features/author/db/cache";
import { BookFormDialog } from "./BookFormDialog";
import { ActionButton } from "@/components/ActionButton";
import { deleteBook } from "../action/book";
import { TrashIcon } from "lucide-react";
import Image from "next/image";

export async function BookTable() {
  const books = await getAllBooks();
  const categories = await getAllCategory();
  const authors = await getAllAuthors();

  return (
    <>
      <PageHeader
        title={formatPlurals(books.length, {
          plural: "Books",
          singular: "Book",
        })}
      >
        <BookFormDialog categories={categories} authors={authors} />
      </PageHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books &&
            books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>
                  <div className="aspect-video size-20 relative">
                    <Image src={book.imagePath} alt="Image" fill />
                  </div>
                </TableCell>
                <TableCell className="max-w-10 truncate">{book.desc}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.entity}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 ">
                    <ActionButton
                      variant="destructive"
                      action={deleteBook.bind(null, book.id)}
                      requiredAreYouSure={true}
                    >
                      <TrashIcon size={5} />
                    </ActionButton>
                    <BookFormDialog
                      book={book}
                      authors={authors}
                      categories={categories}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}
async function getAllBooks() {
  "use cache";

  cacheTag(getBookGlobalTag());

  const books = await db.query.bookTable.findMany({
    columns: {
      id: true,
      title: true,
      desc: true,
      authorId: true,
      entity: true,
      isbn: true,
      imagePath: true,
    },
    with: {
      bookCategories: { columns: { categoryId: true } },
      author: { columns: { name: true } },
    },
  });

  return books.map((book) => {
    return {
      id: book.id,
      title: book.title,
      desc: book.desc,
      entity: book.entity,
      isbn: book.isbn,
      author: book.author.name,
      authorId: book.authorId,
      imagePath: book.imagePath,
      categoryIds: book.bookCategories.map(
        (bookCategory) => bookCategory.categoryId
      ),
    };
  });
}

async function getAllCategory() {
  "use cache";

  cacheTag(getCategoryGlobalTag());

  return db.query.categoryTable.findMany({
    columns: { id: true, title: true },
  });
}

async function getAllAuthors() {
  "use cache";

  cacheTag(getAuthorGlobalTag());

  return db.query.authorTable.findMany({ columns: { id: true, name: true } });
}
