import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionButton } from "@/components/ActionButton";
import { deleteAuthor } from "../action/author";
import { cacheTag } from "next/cache";
import { getAuthorGlobalTag } from "../db/cache";
import { db } from "@/drizzle/db";
import { formatPlurals } from "@/lib/formatters";
import { AuthorDialogForm } from "./AuthorDialogForm";
import { PageHeader } from "@/components/PageHeader";
import { TrashIcon } from "lucide-react";

export async function AuthorTable() {
  const authors = await getAllAuthors();

  return (
    <>
      <PageHeader
        title={formatPlurals(authors.length, {
          plural: "Authors",
          singular: "Author",
        })}
      >
        <AuthorDialogForm />
      </PageHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {authors &&
            authors.map((author) => (
              <TableRow key={author.id}>
                <TableCell>
                  <div className="truncate w-30">{author.name}</div>
                </TableCell>
                <TableCell>
                  <div className="truncate w-64">{author.description}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 ">
                    <ActionButton
                      variant="destructive"
                      action={deleteAuthor.bind(null, author.id)}
                      requiredAreYouSure={true}
                    >
                      <TrashIcon size={5} />
                    </ActionButton>
                    <AuthorDialogForm author={author} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}

async function getAllAuthors() {
  "use cache";

  cacheTag(getAuthorGlobalTag());

  return db.query.authorTable.findMany({
    columns: { id: true, name: true, description: true },
  });
}
