import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cacheTag } from "next/cache";
import { getBookGlobalTag } from "@/features/book/db/cache";
import { db } from "@/drizzle/db";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { getUserGlobalTag } from "@/features/user/db/cache";
import { getReserveGlobalTag } from "../db/cache";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActionButton } from "@/components/ActionButton";
import { reserveStatus, reserveTable, TReserveStatus } from "@/drizzle/schema";
import { updateReserve } from "../action/reserve";
import { ReserveFormDialog } from "./ReserveFormDialog";
import { PageHeader } from "@/components/PageHeader";
import { ReserveFilter } from "./ReserveFilter";
import { ReserveStatusFilter } from "./ReserveStatusFilter";
import { and, count, eq } from "drizzle-orm";
import { ReservePagination } from "./ReservePagination";

export async function ReserveTable({
  userId,
  status,
  page,
}: {
  userId?: string;
  status?: string;
  page: number;
}) {
  const { reserves, totalPages } = await getReserves({
    userId,
    status,
    page,
  });
  const users = await getAllUsers();
  const books = await getAllBooks();

  return (
    <>
      <PageHeader title="Reserves">
        <div className="flex items-center gap-3">
          <ReserveFilter users={users} />

          <ReserveStatusFilter />

          <ReserveFormDialog users={users} books={books} />
        </div>
      </PageHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ReserveDate</TableHead>
            <TableHead>ReturnDate</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Book</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reserves &&
            reserves.map((reserve) => (
              <TableRow key={reserve.id}>
                <TableCell>{format(reserve.createdAt, "yyyy-MM-dd")}</TableCell>
                <TableCell>
                  {reserve.returnedAt ? (
                    format(reserve.returnedAt, "yyyy-MM-dd")
                  ) : (
                    <Badge>Not Delivered</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    <div>{reserve.user.name}</div>

                    <div className="text-xs text-muted-foreground">
                      {reserve.user.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{reserve.book.title}</TableCell>
                <TableCell>
                  <div className="aspect-video size-20 relative">
                    <Image src={reserve.book.imagePath} alt="Image" fill />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="font-pop p-2">{reserve.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 ">
                    <Popover>
                      <PopoverTrigger
                        className={cn(
                          buttonVariants({ variant: "default" }),
                          "cursor-pointer",
                        )}
                      >
                        Status
                      </PopoverTrigger>
                      <PopoverContent className="flex flex-col bg-amber-200 gap-2 w-40">
                        {reserveStatus.map((status) => {
                          if (reserve.status == status) return;
                          return (
                            <ActionButton
                              variant="outline"
                              key={crypto.randomUUID()}
                              action={updateReserve.bind(null, {
                                reserveId: reserve.id,
                                status,
                              })}
                            >
                              {status}
                            </ActionButton>
                          );
                        })}
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <ReservePagination totalPages={totalPages} currentPage={page} />
    </>
  );
}
async function getAllBooks() {
  "use cache";

  cacheTag(getBookGlobalTag());

  return db.query.bookTable.findMany({
    columns: {
      id: true,
      title: true,
    },
  });
}

async function getAllUsers() {
  "use cache";

  cacheTag(getUserGlobalTag());

  return db.query.userTable.findMany({
    columns: { id: true, name: true, email: true },
  });
}

async function getReserves({
  userId,
  status,
  page,
}: {
  userId?: string;
  status?: string;
  page: number;
}) {
  "use cache";

  cacheTag(getReserveGlobalTag());

  const pageSize = 7;

  const whereCondition = and(
    userId ? eq(reserveTable.userId, userId) : undefined,

    status ? eq(reserveTable.status, status as TReserveStatus) : undefined,
  );

  const [reserves, total] = await Promise.all([
    db.query.reserveTable.findMany({
      where: whereCondition,

      limit: pageSize,

      offset: (page - 1) * pageSize,

      columns: {
        id: true,
        status: true,
        createdAt: true,
        returnedAt: true,
      },

      with: {
        book: {
          columns: {
            title: true,
            id: true,
            imagePath: true,
          },
        },

        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),

    db
      .select({
        count: count(),
      })
      .from(reserveTable)
      .where(whereCondition),
  ]);

  return {
    reserves,
    totalPages: Math.ceil(total[0].count / pageSize),
  };
}
