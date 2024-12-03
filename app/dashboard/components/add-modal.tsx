"use client";

import { Modal, TextInput, Button } from "@mantine/core";
import CustomEditor from "@/app/components/CustomEditor";

interface AddNoteModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  content: string;
  setTitle: (value: string) => void;
  setContent: (value: string) => void;
  handleAddNote: () => void;
}

export default function AddNoteModal({
  opened,
  onClose,
  title,
  setTitle,
  setContent,
  handleAddNote,
}: AddNoteModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Add Note" centered>
      <TextInput
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <CustomEditor onEditorChange={setContent} />
      <Button mt="md" onClick={handleAddNote}>
        Add Note
      </Button>
    </Modal>
  );
}
