"use client";

import {
  Text,
  TypographyStylesProvider,
  ActionIcon,
  rem,
  Card,
  Group,
  Menu,
} from "@mantine/core";
import { IconDots, IconEdit, IconEye, IconTrash } from "@tabler/icons-react";

interface Note {
  id: number;
  title: string;
  content: string;
}

interface NoteListProps {
  notes: Note[];
  onView: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
}

export default function NoteList({
  notes,
  onView,
  onEdit,
  onDelete,
}: NoteListProps) {
  return (
    <>
      {notes.map((note) => (
        <Card withBorder shadow="sm" radius="md" key={note.id} mb={"md"}>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>{note.title}</Text>
              <Menu withinPortal position="bottom-end" shadow="sm">
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray">
                    <IconDots style={{ width: rem(16), height: rem(16) }} />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => onView(note)}
                    leftSection={
                      <IconEye style={{ width: rem(14), height: rem(14) }} />
                    }
                  >
                    View Detail
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => onEdit(note)}
                    leftSection={
                      <IconEdit style={{ width: rem(14), height: rem(14) }} />
                    }
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => onDelete(note.id)}
                    leftSection={
                      <IconTrash style={{ width: rem(14), height: rem(14) }} />
                    }
                    color="red"
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Card.Section>

          <Card.Section inheritPadding py="xs">
            <TypographyStylesProvider>
              <div dangerouslySetInnerHTML={{ __html: note.content }} />
            </TypographyStylesProvider>
          </Card.Section>
        </Card>
        // <Paper withBorder radius="md" p="sm" key={note.id} mb="sm">
        //   <Text size="xl" fw={500}>
        //     {note.title}
        //   </Text>
        //   <TypographyStylesProvider>
        //     <div dangerouslySetInnerHTML={{ __html: note.content }} />
        //   </TypographyStylesProvider>
        //   <ActionIcon.Group>
        //     <ActionIcon
        //       variant="light"
        //       aria-label="View"
        //       color="green"
        //       size={"lg"}
        //     >
        //       <IconEye
        //         onClick={() => onView(note)}
        //         style={{ width: "70%", height: "70%" }}
        //         stroke={1.5}
        //       />
        //     </ActionIcon>
        //     <ActionIcon
        //       variant="light"
        //       aria-label="View"
        //       color="blue"
        //       size={"lg"}
        //     >
        //       <IconEdit
        //         onClick={() => onEdit(note)}
        //         style={{ width: "70%", height: "70%" }}
        //         stroke={1.5}
        //       />
        //     </ActionIcon>
        //     <ActionIcon
        //       variant="light"
        //       aria-label="View"
        //       color="red"
        //       size={"lg"}
        //     >
        //       <IconTrash
        //         onClick={() => onDelete(note.id)}
        //         style={{ width: "70%", height: "70%" }}
        //         stroke={1.5}
        //       />
        //     </ActionIcon>
        //   </ActionIcon.Group>
        // </Paper>
      ))}
    </>
  );
}
