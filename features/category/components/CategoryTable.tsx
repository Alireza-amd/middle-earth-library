import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionButton } from "@/components/ActionButton";
import { deleteCategory } from "../action/category";
import { cacheTag } from "next/cache";
import { getCategoryGlobalTag } from "../db/cache";
import { db } from "@/drizzle/db";
import { formatPlurals } from "@/lib/formatters";
import { CategoryDialogForm } from "./CategoryDialogForm";
import { PageHeader } from "@/components/PageHeader";
import { TrashIcon } from "lucide-react";

export async function CategoryTable() {
  const categories = await getAllCategories();

  return (
    <>
      <PageHeader
        title={formatPlurals(categories.length, {
          plural: "Categories",
          singular: "Category",
        })}
      >
        <CategoryDialogForm />
      </PageHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories &&
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 ">
                    <ActionButton
                      variant="destructive"
                      action={deleteCategory.bind(null, category.id)}
                      requiredAreYouSure={true}
                    >
                      <TrashIcon size={5} />
                    </ActionButton>
                    <CategoryDialogForm category={category} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}

async function getAllCategories() {
  "use cache";

  cacheTag(getCategoryGlobalTag());

  return db.query.categoryTable.findMany({
    columns: { id: true, title: true },
  });
}
