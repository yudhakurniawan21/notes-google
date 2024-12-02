"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Button,
  Flex,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Text,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";

const CustomEditor = dynamic(() => import("../components/CustomEditor"), {
  ssr: false,
});

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string>("");
  const [visible, { toggle }] = useDisclosure(false);

  const handleEditorChange = (value: string) => {
    // console.log("Editor value:", value);
    setContent(value); // Perbarui state
  };

  const fetchNotes = async () => {
    toggle();
    const response = await fetch("/api/notes");
    if (response.ok) {
      const data = await response.json();
      setNotes(data);
      toggle();
    }
  };

  const addNote = async () => {
    if (title !== "" && content !== "") {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      fetchNotes();
      setTitle("");
      setContent("");
      notifications.show({
        color: "green",
        title: "Success",
        message: "Note added successfully!",
      });
    } else {
      notifications.show({
        color: "red",
        title: "Warning",
        message: "Please input Title and Content!",
      });
    }
  };

  useEffect(() => {
    if (session) fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <div className="flex flex-row justify-between px-2">
            <Text>Welcome, {session?.user?.name}</Text>
          </div>
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <CustomEditor onEditorChange={handleEditorChange} />
          <Button variant="filled" onClick={addNote}>
            Add Note
          </Button>
          <LoadingOverlay
            visible={visible}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <ScrollArea h="calc(100vh - 380px)" py={"sm"}>
            {notes.map((note: Note) => (
              <Paper withBorder radius="md" p={"sm"} key={note.id} mb={"sm"}>
                <Text size="xl" fw={500}>
                  {note.title}
                </Text>
                <Text
                  size="sm"
                  mt="sm"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                ></Text>
              </Paper>
            ))}
          </ScrollArea>
        </div>
      </Flex>
    </main>
  );
}
