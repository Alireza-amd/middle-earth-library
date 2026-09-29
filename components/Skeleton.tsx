"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";

export function SkeletonArray({
  rows,
  children,
}: {
  rows: number;
  children: ReactNode;
}) {
  return Array.from({ length: rows }).map(() => children);
}

export function SkeletonText({
  rows = 1,
  size = "md",
  className,
}: {
  rows?: number;
  size?: "lg" | "md";
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <SkeletonArray rows={rows}>
        <div
          className={cn(
            rows > 1 && "last:w-3/4",
            size == "lg" && "h-7",
            size == "md" && "h-6",
            "bg-accent animate-pulse",
            className
          )}
        />
      </SkeletonArray>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <SkeletonText size="lg" className="w-2/4" />
        </CardTitle>
        <CardDescription>
          <SkeletonText rows={3} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SkeletonText rows={3} />
      </CardContent>
      <CardFooter>
        <SkeletonButton />
      </CardFooter>
    </Card>
  );
}

export function BookCardSkelton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <CardTitle className="font-pop flex justify-between">
          <span>
            <SkeletonText />
          </span>
          <span className="text-gray-400 size-8 flex items-center justify-center rounded-full bg-gray-700"></span>
        </CardTitle>
        <CardDescription className="h-15 line-clamp-3">
          <SkeletonText rows={3} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-start gap-4">
          <span className=" bg-amber-100 text-amber-500">
            <SkeletonText className="w-25" />
          </span>
          <div className="flex gap-1 flex-wrap h-14 truncate">
            <SkeletonArray rows={4}>
              <Badge className="h-5 w-20"></Badge>
            </SkeletonArray>
          </div>
          <div className="aspect-square bg-gray-100 relative w-full"></div>
        </div>
      </CardContent>
      <CardFooter>
        <div
          className={cn(
            "w-full hover:bg-amber-100 hover:text-amber-500 text-amber-100 bg-amber-500",
            buttonVariants({ variant: "outline" })
          )}
        ></div>
      </CardFooter>
    </Card>
  );
}

export function SkeletonButton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        buttonVariants({
          variant: "secondary",
          className: "w-24 pointer-events-none animate-pulse",
        }),
        className
      )}
    ></div>
  );
}

export function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <SkeletonText className="w-[100px] rounded-xl" />
          </TableHead>
          <TableHead>
            <SkeletonText className="w-[100px] rounded-xl" />
          </TableHead>
          <TableHead>
            <SkeletonText className="w-[100px] rounded-xl" />
          </TableHead>
          <TableHead>
            <SkeletonText className="w-[100px] rounded-xl" />
          </TableHead>
          <TableHead>
            <SkeletonText className="w-[100px] rounded-xl" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 3 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <SkeletonText />
            </TableCell>
            <TableCell>
              <SkeletonText />
            </TableCell>
            <TableCell>
              <SkeletonText />
            </TableCell>
            <TableCell>
              <SkeletonText />
            </TableCell>
            <TableCell>
              <div className="grid grid-cols-3 gap-3  w-[300px]">
                <SkeletonButton />
                <SkeletonButton />
                <SkeletonButton />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
