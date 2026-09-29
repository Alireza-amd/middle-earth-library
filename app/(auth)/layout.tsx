import { ReactNode } from "react";

export default function AuthLayoutPage({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  return (
    <div className="flex items-start justify-center overflow-hidden">
      {children}
    </div>
  );
}
