"use client";

import {
  Modal,
  ScrollArea,
  Text,
  TypographyStylesProvider,
} from "@mantine/core";

interface NoteDetailsModalProps {
  opened: boolean;
  onClose: () => void;
  note: { title: string; content: string } | null;
}

export default function NoteDetailsModal({
  opened,
  onClose,
  note,
}: NoteDetailsModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Note Details" centered>
      {note && (
        <ScrollArea h="280" py={"sm"}>
          <Text size="xl" fw={500} mb="sm">
            {note.title}
          </Text>
          <TypographyStylesProvider>
            <div dangerouslySetInnerHTML={{ __html: note.content }} />
          </TypographyStylesProvider>
        </ScrollArea>
      )}
    </Modal>
  );
}
