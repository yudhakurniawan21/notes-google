"use client";

import { Modal, TextInput, Button } from "@mantine/core";
import CustomEditor from "@/app/components/CustomEditor";

interface EditNoteModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  content: string;
  setTitle: (value: string) => void;
  setContent: (value: string) => void;
  handleEditNote: () => void;
}

export default function EditNoteModal({
  opened,
  onClose,
  title,
  content,
  setTitle,
  setContent,
  handleEditNote,
}: EditNoteModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Edit Note" centered>
      <TextInput
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <CustomEditor onEditorChange={setContent} initialValue={content} />
      <Button mt="md" onClick={handleEditNote}>
        Update Note
      </Button>
    </Modal>
  );
}
