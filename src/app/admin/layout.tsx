import Link from "next/link";
import { ReactNode } from "react";

export default function Layout({
  children,
  notification,
  user,
}: {
  children: ReactNode;
  notification: ReactNode;
  user: ReactNode;
}) {
  return (
    <div>
      <header style={{ display: "flex", gap: "10px" }}>
        <Link href={"/admin"} style={{ color: "blue" }}>
          /admin
        </Link>
        <Link href={"/admin/archived"} style={{ color: "blue" }}>
          /admin/archived
        </Link>
      </header>
      <br />
      {children}
      {notification}
      {user}
    </div>
  );
}
