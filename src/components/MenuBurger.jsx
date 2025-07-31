// src/components/MenuBurger.jsx
import { useState } from "react";
import { Drawer, Button, Stack, Title } from "@mantine/core";
import { Link } from "react-router-dom";

export default function MenuBurger() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpened(true)}
        variant="gradient"
        gradient={{ from: "orange", to: "pink", deg: 45 }}
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 1000,
        }}
      >
        ☰
      </Button>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        padding="xl"
        size="sm"
        title={<Title order={3} style={{ color: "#fff" }}>Menu</Title>}
        styles={{
          drawer: {
            background: "linear-gradient(160deg, #0f172a, #3b1c4c, #ff7f50)",
            color: "#fff",
          },
        }}
      >
        <Stack spacing="lg">
          <Link to="/" onClick={() => setOpened(false)} style={{ color: "#fff" }}>Accueil</Link>
          <Link to="/about" onClick={() => setOpened(false)} style={{ color: "#fff" }}>À propos</Link>
        </Stack>
      </Drawer>
    </>
  );
}