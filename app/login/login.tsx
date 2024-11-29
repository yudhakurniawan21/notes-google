"use client";

import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Flex,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { upperFirst, useToggle } from "@mantine/hooks";
import { GoogleButton } from "./google-button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthError } from "next-auth";

export function AuthenticationForm(props: PaperProps) {
  const [type, toggle] = useToggle(["login", "register"]);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const handleSubmit = async () => {
    if (type === "register") {
      // Handle registration
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.values.name,
            email: form.values.email,
            password: form.values.password,
          }),
        });

        if (!res.ok) {
          const { error } = await res.json();
          console.log(error);

          notifications.show({
            color: "red",
            title: "Registration failed",
            message: "Please check your email and password",
          });
          return;
        }

        // Redirect to login or auto-login after registration
        toggle();
      } catch (err) {
        if (err instanceof AuthError) {
          notifications.show({
            color: "red",
            title: "Registration failed",
            message: `Error during registration: ${err.message}`,
          });
        } else {
          notifications.show({
            color: "red",
            title: "Registration failed",
            message: `An unknown error occurred`,
          });
        }
      }
    } else {
      // Handle login
      const result = await signIn("credentials", {
        redirect: false,
        email: form.values.email,
        password: form.values.password,
      });

      console.log(result);
      if (result?.error) {
        notifications.show({
          color: "red",
          title: "Login failed",
          message: "Please check your email and password",
        });
      } else {
        router.push("/"); // Redirect to the homepage or dashboard
      }
    }
  };

  return (
    <Flex
      mih="100vh"
      justify="center"
      align="center"
      direction="row"
      wrap="wrap"
    >
      <Paper radius="md" p="xl" withBorder {...props} w={400}>
        <Text size="lg" fw={500}>
          Welcome to Notes, {type} with
        </Text>

        <Group grow mb="md" mt="md">
          <GoogleButton
            radius="xl"
            onClick={() => {
              signIn("google", { callbackUrl: "/" });
            }}
          >
            Google
          </GoogleButton>
        </Group>

        <Divider
          label="Or continue with email"
          labelPosition="center"
          my="lg"
        />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {type === "register" && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) =>
                  form.setFieldValue("name", event.currentTarget.value)
                }
                radius="md"
                required
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={form.errors.password}
              radius="md"
            />

            {type === "register" && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) =>
                  form.setFieldValue("terms", event.currentTarget.checked)
                }
              />
            )}
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === "register"
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </Flex>
  );
}
