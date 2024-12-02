import React from "react";
import Home from "./dashboard";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-2xl font-bold">You are not logged in</p>
      </div>
    );
  }
  return <Home />;
}
