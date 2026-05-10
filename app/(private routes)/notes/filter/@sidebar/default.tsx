//  app/(private routes)/notes/filter/@sidebar/default.tsx

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./SidebarNotes.module.css";

const ALL_TAGS = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function SidebarNotes() {
  const params = useParams();
  const currentTag = params.slug?.[0] || "All";

  return (
    <div className={styles.sidebar}>
      <h3>Filter by Tag</h3>
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          <Link
            href="/notes/filter/All"
            className={`${styles.menuLink} ${currentTag === "All" ? styles.active : ""}`}
          >
            All Notes
          </Link>
        </li>

        {ALL_TAGS.map((tag) => (
          <li key={tag} className={styles.menuItem}>
            <Link
              href={`/notes/filter/${tag}`}
              className={`${styles.menuLink} ${currentTag === tag ? styles.active : ""}`}
            >
              {tag}
            </Link>
          </li>
        ))}

        <li className={styles.menuItem}>
          <Link
            href="/notes/action/create"
            className={`${styles.menuLink} ${styles.createLink}`}
          >
            Create note +
          </Link>
        </li>
      </ul>
    </div>
  );
}