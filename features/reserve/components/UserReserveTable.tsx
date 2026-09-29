import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CancelReserveButton } from "./CancelReserveButton";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { format } from "date-fns";

import { getUserReserves } from "../db/userReserve";

export async function UserReserveTable() {
  const reserves = await getUserReserves();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Book</TableHead>

          <TableHead>Reserve Date</TableHead>

          <TableHead>Return Date</TableHead>

          <TableHead>Status</TableHead>

          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {reserves.map((reserve) => (
          <TableRow key={reserve.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="relative size-16">
                  <Image
                    src={reserve.book.imagePath}
                    alt={reserve.book.title}
                    fill
                  />
                </div>

                <span>{reserve.book.title}</span>
              </div>
            </TableCell>

            <TableCell>{format(reserve.createdAt, "yyyy-MM-dd")}</TableCell>

            <TableCell>
              {reserve.status === "returned" && reserve.returnedAt ? (
                format(reserve.returnedAt, "yyyy-MM-dd")
              ) : reserve.status === "returned" ? (
                <Badge>Not Returned</Badge>
              ) : reserve.status === "cancelled" ? (
                <Badge>Cancelled</Badge>
              ) : (
                <Badge>-</Badge>
              )}
            </TableCell>

            <TableCell>
              <Badge>{reserve.status}</Badge>
            </TableCell>

            <TableCell>
              {reserve.status === "pending" && (
                <CancelReserveButton reserveId={reserve.id} />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
