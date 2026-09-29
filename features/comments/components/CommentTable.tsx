import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getAdminComments } from "../db/adminComment";
import { DeleteCommentButton } from "./DeleteCommentButton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ReplyCommentDialog } from "./ReplyCommentDialog";
import { getCurrentUser } from "@/auth/currentUser";
import { CommentPagination } from "./CommentPagination";

export async function CommentTable({ page }: { page: number }) {
  const currentUser = await getCurrentUser({
    redirectIfNotFound: true,
    getFullUser: true,
  });
  const { comments, totalPages } = await getAdminComments(page);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>

            <TableHead>User</TableHead>

            <TableHead>Email</TableHead>

            <TableHead>Book</TableHead>

            <TableHead>Comment</TableHead>

            <TableHead>Likes</TableHead>

            <TableHead>Dislikes</TableHead>

            <TableHead>Parent</TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {comments.map((comment) => (
            <TableRow key={comment.id}>
              <TableCell>{format(comment.createdAt, "yyyy-MM-dd")}</TableCell>

              <TableCell>{comment.user.name}</TableCell>

              <TableCell>{comment.user.email}</TableCell>

              <TableCell>{comment.book.title}</TableCell>

              <TableCell className="max-w-xs">{comment.content}</TableCell>

              <TableCell>
                <Badge>{comment.likes}</Badge>
              </TableCell>

              <TableCell>
                <Badge>{comment.dislikes}</Badge>
              </TableCell>

              <TableCell>
                {comment.parentId ? <Badge>Reply</Badge> : "-"}
              </TableCell>

              <TableCell>
                <Popover>
                  <PopoverTrigger
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                      }),
                    )}
                  >
                    Manage
                  </PopoverTrigger>

                  <PopoverContent className="flex flex-col gap-2 w-40">
                    <ReplyCommentDialog
                      bookId={comment.bookId}
                      commentId={comment.id}
                      user={{
                        id: currentUser.id,
                        name: currentUser.name,
                      }}
                    />

                    <DeleteCommentButton commentId={comment.id} />
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CommentPagination totalPages={totalPages} currentPage={page} />
    </>
  );
}
