// app/(private routes)/notes/layout.tsx

import styles from "@/app/(private routes)/notes/layout.module.css";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}