"use client";

import { useState } from "react";
import {
  IconChevronDown,
  IconLogout,
  IconNotebook,
  IconSettings,
} from "@tabler/icons-react";
import cx from "clsx";
import {
  Avatar,
  Burger,
  Center,
  Collapse,
  Container,
  Divider,
  Drawer,
  Group,
  Menu,
  ScrollArea,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";
import { signOut, useSession } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

const mockdata = [
  {
    icon: IconSettings,
    title: "Account settings",
  },
  {
    icon: IconLogout,
    title: "Log Out",
    onClick: async () => {
      await signOut();
    },
  },
];

const Header = () => {
  const { data: session } = useSession();
  const theme = useMantineTheme();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);

  const links = mockdata.map((item) => (
    <UnstyledButton
      className={classes.subLink}
      key={item.title}
      onClick={item.onClick}
    >
      <Group wrap="nowrap" align="center">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={22} color={theme.colors.blue[6]} />
        </ThemeIcon>
        <Text size="sm" fw={500}>
          {item.title}
        </Text>
      </Group>
    </UnstyledButton>
  ));

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="md">
        <Group justify="space-between">
          <IconNotebook size={28} />

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />

          <Menu
            width={200}
            position="bottom-start"
            transitionProps={{ transition: "pop-top-right" }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}
              >
                <Group gap={7}>
                  {session?.user && (
                    <>
                      <Avatar
                        src={session.user.image}
                        alt={session.user.name ?? ""}
                        radius="xl"
                        size={20}
                      />
                      <Text fw={500} size="sm" lh={1} mr={3}>
                        {session.user.name}
                      </Text>
                    </>
                  )}
                  <IconChevronDown size={12} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <ThemeToggle />
            <Menu.Dropdown>
              <Menu.Label>Settings</Menu.Label>
              <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
                Account settings
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={16} stroke={1.5} />}
                onClick={async () => {
                  await signOut();
                }}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Divider my="sm" />
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Group gap={7}>
                {session?.user && (
                  <>
                    <Avatar
                      src={session.user.image}
                      alt={session.user.name ?? ""}
                      radius="xl"
                      size={20}
                    />
                    <Text fw={500} size="sm" lh={1} mr={3}>
                      {session.user.name}
                    </Text>
                  </>
                )}
              </Group>
              <IconChevronDown size={16} color={theme.colors.blue[6]} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>

          {/* <Divider my="sm" />
          <Group px="md">
            <ThemeToggle />
            <Text size="md">Theme</Text>
          </Group> */}

          {/* <Group justify="center" grow pb="xl" px="md">
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
          </Group> */}
        </ScrollArea>
      </Drawer>
    </div>
  );
};

export default Header;
