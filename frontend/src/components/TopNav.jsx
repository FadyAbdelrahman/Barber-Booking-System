// src/components/TopNav.jsx
import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Container,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "./Logo.jsx";
import { BRAND } from "../brand/brand.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function TopNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const nav = [
    { label: "Home", to: "/" },
    { label: "Services", to: "/services" },
    { label: "Book", to: "/book" },
    ...(user ? [{ label: "My Bookings", to: "/my-bookings" }] : []),
  ];

  const isHome = location.pathname === "/";

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/");
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: isHome ? "rgba(11,11,12,0.35)" : "rgba(11,11,12,0.70)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: 0 }}>
            {/* Brand */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.2,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Logo size={34} />
              <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                <Typography
                  sx={{
                    fontFamily: "Playfair Display, serif",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontSize: "0.98rem",
                  }}
                >
                  {BRAND.name}
                </Typography>
                <Typography sx={{ fontSize: "0.72rem", opacity: 0.7 }}>
                  {BRAND.tagline}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
              {nav.map((l) => (
                <Button key={l.to} component={RouterLink} to={l.to} color="inherit">
                  {l.label}
                </Button>
              ))}
              <Box sx={{ width: 12 }} />
              {user ? (
                <>
                  <Avatar
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: "#C7A86B",
                      color: "#0B0B0C",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                    }}
                  >
                    {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
                  </Avatar>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    <MenuItem disabled sx={{ opacity: 0.6, fontSize: "0.85rem" }}>
                      {user.name || user.username}
                    </MenuItem>
                    <Divider />
                    <MenuItem component={RouterLink} to="/dashboard" onClick={() => setAnchorEl(null)}>
                      Dashboard
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/my-bookings" onClick={() => setAnchorEl(null)}>
                      My Bookings
                    </MenuItem>
                    {user.role === "admin" && (
                      <MenuItem component={RouterLink} to="/admin/manage-slots" onClick={() => setAnchorEl(null)}>
                        Admin Panel
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button variant="outlined" component={RouterLink} to="/login">
                    Login
                  </Button>
                  <Button variant="contained" component={RouterLink} to="/register">
                    Register
                  </Button>
                </>
              )}
            </Box>

            {/* Mobile */}
            <IconButton
              color="inherit"
              sx={{ display: { xs: "inline-flex", md: "none" }, ml: 1 }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 320 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <Box sx={{ px: 2, py: 2, display: "flex", alignItems: "center", gap: 1.2 }}>
            <Logo size={34} />
            <Box>
              <Typography
                sx={{
                  fontFamily: "Playfair Display, serif",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {BRAND.name}
              </Typography>
              <Typography sx={{ opacity: 0.7, mt: 0.2 }}>{BRAND.tagline}</Typography>
            </Box>
          </Box>

          <Divider />

          <List>
            {nav.map((l) => (
              <ListItemButton key={l.to} component={RouterLink} to={l.to}>
                <ListItemText primary={l.label} />
              </ListItemButton>
            ))}
          </List>

          <Divider />

          {user ? (
            <List>
              <ListItemButton component={RouterLink} to="/dashboard">
                <ListItemText primary="Dashboard" />
              </ListItemButton>
              {user.role === "admin" && (
                <ListItemButton component={RouterLink} to="/admin/manage-slots">
                  <ListItemText primary="Admin Panel" />
                </ListItemButton>
              )}
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          ) : (
            <List>
              <ListItemButton component={RouterLink} to="/login">
                <ListItemText primary="Login" />
              </ListItemButton>
              <ListItemButton component={RouterLink} to="/register">
                <ListItemText primary="Register" />
              </ListItemButton>
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
}
