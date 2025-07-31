// src/components/Menu.jsx
import { useState } from "react";
import {
  AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemButton,
  ListItemText, Box, Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/psychographe", label: "Psychographe" },
  { to: "/psychotheque", label: "Psychothèque" },
  { to: "/profil", label: "Profil", protected: true },
];

export default function Menu() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const location = useLocation();

  return (
    <>
      <AppBar
        position="fixed"
        elevation={4}
        sx={{
          bgcolor: "rgba(36,40,74,0.7)",
          backdropFilter: "blur(14px)",
          color: "#fff",
        }}
      >
        <Toolbar>
          {/* Burger (mobile) */}
          <IconButton edge="start" color="inherit" onClick={() => setOpen(true)} sx={{ mr: 2, display: { xs: "block", md: "none" } }}>
            <MenuIcon />
          </IconButton>

          {/* Logo / titre */}
          <Box sx={{ flexGrow: 1 }}>
            <Link
              to="/"
              style={{
                color: "inherit",
                textDecoration: "none",
                fontWeight: 900,
                fontSize: 22,
              }}
            >
              Psychograph
            </Link>
          </Box>

          {/* Liens desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {links.map((l) => (!l.protected || user) && (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  color: location.pathname === l.to ? "#46a5ff" : "inherit",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 16,
                  marginLeft: 8,
                  transition: "color 0.2s ease",
                }}
              >
                {l.label}
              </Link>
            ))}
            {!user && (
              <Link
                to="/auth"
                style={{ color: "#fff", textDecoration: "none", fontWeight: 700, marginLeft: 18 }}
              >
                Connexion
              </Link>
            )}
            {user && (
              <IconButton color="inherit" component={Link} to="/profil" sx={{ ml: 1 }}>
                <AccountCircle />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer mobile */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 220, mt: 6 }}>
          <List>
            {links.map((l) => (!l.protected || user) && (
              <ListItem key={l.to} disablePadding>
                <ListItemButton component={Link} to={l.to} onClick={() => setOpen(false)}>
                  <ListItemText primary={l.label} />
                </ListItemButton>
              </ListItem>
            ))}
            {!user && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/auth" onClick={() => setOpen(false)}>
                  <ListItemText primary="Connexion" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/mentions-legales" onClick={() => setOpen(false)}>
                <ListItemText primary="Mentions légales" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Décalage contenu */}
      <Toolbar />
    </>
  );
}