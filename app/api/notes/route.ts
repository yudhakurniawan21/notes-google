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

export async function PUT(req: Request) {
  const session = await auth();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ambil query parameter dari URL
  const { searchParams } = new URL(req.url);
  const noteId = parseInt(searchParams.get("id") || "", 10);

  if (isNaN(noteId)) {
    return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
  }

  const data = await req.json();

  const updatedNote = await prisma.note.updateMany({
    where: {
      id: noteId,
      email: session.user.email, // Pastikan hanya catatan milik user yang bisa diperbarui
    },
    data: {
      title: data.title,
      content: data.content,
    },
  });

  if (updatedNote.count === 0) {
    return NextResponse.json(
      { error: "Note not found or not authorized" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Note updated successfully" });
}

export async function DELETE(req: Request) {
  const session = await auth();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ambil query parameter dari URL
  const { searchParams } = new URL(req.url);
  const noteId = parseInt(searchParams.get("id") || "", 10);

  if (isNaN(noteId)) {
    return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
  }

  const deletedNote = await prisma.note.deleteMany({
    where: {
      id: noteId,
      email: session.user.email, // Pastikan hanya catatan milik user yang bisa dihapus
    },
  });

  if (deletedNote.count === 0) {
    return NextResponse.json(
      { error: "Note not found or not authorized" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Note deleted successfully" });
}
