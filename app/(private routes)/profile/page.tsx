import { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { getMe } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "User Profile - NoteHub",
  description: "View and manage your user profile information",
  keywords: "profile, user, account, settings",
  authors: [{ name: "NoteHub Team" }],
  robots: "noindex, nofollow",
};

export default async function Profile() {
  const user = await getMe();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main>
      <Image
        src={user.avatar || "/default-avatar.png"}
        alt={user.username}
        width={120}
        height={120}
      />

      <h1>{user.username}</h1>
      <p>{user.email}</p>

      <Link href="/profile/edit">Edit profile</Link>
    </main>
  );
}