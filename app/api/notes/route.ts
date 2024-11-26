import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notes = await prisma.note.findMany({
    where: { email: session.user.email },
  });

  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  const newNote = await prisma.note.create({
    data: {
      title: data.title,
      content: data.content,
      email: session.user.email,
    },
  });

  return NextResponse.json(newNote, { status: 201 });
}
