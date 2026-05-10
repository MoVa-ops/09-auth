// app/(private routes)/profile/page.tsx

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getMe } from "@/lib/api/serverApi";
import ProfileClient from "./ProfileClient";

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

  return <ProfileClient user={user} />;
}