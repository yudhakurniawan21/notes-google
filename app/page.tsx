import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();
  console.log(session);

  if (!session) {
    redirect("/login");
  }

  // Jika pengguna sudah login, arahkan ke dashboard
  redirect("/dashboard");

  // Komponen fallback (tidak akan dirender karena selalu diarahkan)
  return null;
}
