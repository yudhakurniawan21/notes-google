"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Flex, Text, ScrollArea, ActionIcon } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import AddNoteModal from "./components/add-modal";
import EditNoteModal from "./components/edit-modal";
import NoteDetailsModal from "./components/detail-modal";
import NoteList from "./components/note-list";
import { IconPlus } from "@tabler/icons-react";

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [viewedNote, setViewedNote] = useState<Note | null>(null);

  const [addModalOpen, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);
  const [editModalOpen, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  const [
    detailsModalOpen,
    { open: openDetailsModal, close: closeDetailsModal },
  ] = useDisclosure(false);

  const fetchNotes = async () => {
    const response = await fetch("/api/notes");
    if (response.ok) {
      setNotes(await response.json());
    }
  };

  const addNote = async () => {
    if (title && content) {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      fetchNotes();
      closeAddModal();
      notifications.show({
        color: "green",
        title: "Success",
        message: "Note added!",
      });
    } else {
      notifications.show({
        color: "red",
        title: "Warning",
        message: "All fields required!",
      });
    }
  };

  const editNote = async () => {
    if (selectedNote) {
      await fetch(`/api/notes?id=${selectedNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      fetchNotes();
      closeEditModal();
      notifications.show({
        color: "green",
        title: "Success",
        message: "Note updated!",
      });
    }
  };

  const deleteNote = async (id: number) => {
    await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
    fetchNotes();
    notifications.show({
      color: "green",
      title: "Success",
      message: "Note deleted!",
    });
  };

  const openEdit = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    openEditModal();
  };

  const openDetails = (note: Note) => {
    setViewedNote(note);
    openDetailsModal();
  };

  useEffect(() => {
    if (session) fetchNotes();
  }, [session]);

  return (
    <main>
      <Flex
        mih="100vh"
        justify="center"
        align="flex-start"
        direction="row"
        wrap="wrap"
      >
        <div className="flex flex-col gap-2 px-2 w-full sm:w-[400] md:w-[500] lg:w-[700]">
          <div className="flex justify-between items-center">
            <Text>Welcome, {session?.user?.name}</Text>
            <ActionIcon variant="filled" aria-label="Add">
              <IconPlus
                onClick={openAddModal}
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>
          </div>
          <ScrollArea h="calc(100vh - 220px)" py="sm">
            <NoteList
              notes={notes}
              onView={openDetails}
              onEdit={openEdit}
              onDelete={deleteNote}
            />
          </ScrollArea>
        </div>
      </Flex>
      <AddNoteModal
        opened={addModalOpen}
        onClose={closeAddModal}
        title={title}
        content={content}
        setTitle={setTitle}
        setContent={setContent}
        handleAddNote={addNote}
      />
      <EditNoteModal
        opened={editModalOpen}
        onClose={closeEditModal}
        title={title}
        content={content}
        setTitle={setTitle}
        setContent={setContent}
        handleEditNote={editNote}
      />
      <NoteDetailsModal
        opened={detailsModalOpen}
        onClose={closeDetailsModal}
        note={viewedNote}
      />
    </main>
  );
}
