import { PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { SkeletonText } from "./Skeleton";

export function NavbarSkeleton() {
  return (
    <div className="container animate-pulse py-6 flex items-center justify-between">
      <h1 className="font-mono text-2x">MiddleEarthLibary</h1>

      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-3">
          <SkeletonText size="lg" className="w-20"/>
          <SkeletonText size="lg" className="w-20"/>
          <SkeletonText size="lg" className="w-20"/>
          <SkeletonText size="lg" className="w-20"/>
        </nav>
        <PersonIcon className="size-6" />
      </div>
    </div>
  );
}
