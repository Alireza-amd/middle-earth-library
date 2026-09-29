import { ReactNode } from "react";

export function PageHeader({
  title,
  children,
}: {
  title: string;
  children?: Readonly<ReactNode>;
}) {
  return (
    <div className="w-full flex my-6 items-center justify-between">
      <h1 className="text-5xl font-pop">{title}</h1>
      {children && <div>{children}</div>}
    </div>
  );
}
