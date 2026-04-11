// src/components/TopNav.jsx
import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Box, IconButton, Drawer,
  Divider, Container, Avatar, List, ListItemButton, ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "./Logo.jsx";
import { BRAND } from "../brand/brand.js";
import { useAuth } from "../context/AuthContext.jsx";

// ── Animated hamburger icon ────────────────────────────────────────────────
function HamburgerIcon({ open }) {
  const bar = {
    display: "block",
    width: 22,
    height: 1.5,
    backgroundColor: "#E7E0D6",
    borderRadius: 2,
    transition: "transform 0.35s ease, opacity 0.25s ease",
  };
  return (
    <Box sx={{ width: 22, height: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", cursor: "pointer" }}>
      <Box component="span" sx={{ ...bar, transform: open ? "translateY(7px) rotate(45deg)" : "none" }} />
      <Box component="span" sx={{ ...bar, opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "none" }} />
      <Box component="span" sx={{ ...bar, transform: open ? "translateY(-7px) rotate(-45deg)" : "none" }} />
    </Box>
  );
}

// ── Nav links config ───────────────────────────────────────────────────────
const NAV = [
  { label: "Home",     to: "/" },
  { label: "Services", to: "/services" },
  { label: "Book",     to: "/book" },
];

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();

  const allNav = [
    ...NAV,
    ...(user ? [{ label: "My Bookings", to: "/my-bookings" }] : []),
  ];

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const handleLogout = () => { setOpen(false); logout(); navigate("/"); };

  return (
    <>
      {/* ── AppBar ─────────────────────────────────────────────────────── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(26,22,20,0.82)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(199,168,107,0.12)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: 0, minHeight: { xs: 60, md: 68 } }}>

            {/* Brand */}
            <Box
              component={RouterLink} to="/"
              sx={{ display: "inline-flex", alignItems: "center", gap: 1.4, textDecoration: "none", color: "inherit" }}
            >
              <Logo size={32} />
              <Box>
                <Typography sx={{ fontFamily: "Playfair Display, serif", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.95rem", lineHeight: 1.1 }}>
                  {BRAND.name}
                </Typography>
                <Typography sx={{ fontSize: "0.65rem", opacity: 0.55, letterSpacing: "0.12em" }}>
                  {BRAND.tagline}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop nav links */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5, mr: 3 }}>
              {allNav.map((l) => (
                <Box
                  key={l.to}
                  component={RouterLink}
                  to={l.to}
                  sx={{
                    position: "relative",
                    px: 1.8,
                    py: 0.6,
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    color: isActive(l.to) ? "#C7A86B" : "rgba(231,224,214,0.72)",
                    transition: "color 0.2s ease",
                    "&:hover": { color: "#E7E0D6" },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -2,
                      left: "50%",
                      transform: isActive(l.to) ? "translateX(-50%) scaleX(1)" : "translateX(-50%) scaleX(0)",
                      transformOrigin: "center",
                      width: "60%",
                      height: "1px",
                      bgcolor: "#C7A86B",
                      transition: "transform 0.3s ease",
                    },
                    "&:hover::after": { transform: "translateX(-50%) scaleX(1)" },
                  }}
                >
                  {l.label}
                </Box>
              ))}
            </Box>

            {/* Desktop user avatar */}
            {user && (
              <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", mr: 2 }}>
                <Avatar
                  sx={{ width: 32, height: 32, bgcolor: "#C7A86B", color: "#1A1614", fontWeight: 800, fontSize: "0.85rem", cursor: "pointer", border: "1.5px solid rgba(199,168,107,0.4)" }}
                  onClick={() => navigate("/dashboard")}
                >
                  {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
                </Avatar>
              </Box>
            )}

            {/* Hamburger — always visible */}
            <IconButton
              disableRipple
              onClick={() => setOpen((v) => !v)}
              sx={{ p: 1, borderRadius: 2, border: "1px solid rgba(199,168,107,0.2)", "&:hover": { borderColor: "rgba(199,168,107,0.5)", bgcolor: "rgba(199,168,107,0.06)" }, transition: "all 0.2s ease" }}
            >
              <HamburgerIcon open={open} />
            </IconButton>

          </Toolbar>
        </Container>
      </AppBar>

      {/* ── Premium Drawer ─────────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "85vw", sm: 380 },
            background: "#1A1614",
            borderLeft: "1px solid rgba(199,168,107,0.15)",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header */}
        <Box sx={{ px: 3.5, pt: 3, pb: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box component={RouterLink} to="/" onClick={() => setOpen(false)} sx={{ display: "flex", alignItems: "center", gap: 1.4, textDecoration: "none", color: "inherit" }}>
            <Logo size={32} />
            <Box>
              <Typography sx={{ fontFamily: "Playfair Display, serif", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.95rem" }}>
                {BRAND.name}
              </Typography>
              <Typography sx={{ fontSize: "0.65rem", opacity: 0.5, letterSpacing: "0.12em" }}>
                {BRAND.tagline}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setOpen(false)} sx={{ color: "rgba(231,224,214,0.6)", "&:hover": { color: "#E7E0D6" } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Gold divider */}
        <Box sx={{ mx: 3.5, height: "1px", background: "linear-gradient(90deg, #C7A86B 0%, rgba(199,168,107,0.15) 100%)", mb: 1 }} />

        {/* User info strip */}
        {user && (
          <Box sx={{ px: 3.5, py: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: "#C7A86B", color: "#1A1614", fontWeight: 800, fontSize: "1rem" }}>
              {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>{user.name}</Typography>
              <Typography sx={{ fontSize: "0.75rem", opacity: 0.5, letterSpacing: "0.06em" }}>@{user.username}</Typography>
            </Box>
          </Box>
        )}

        {/* Nav links */}
        <Box sx={{ px: 2, mt: 1, flexGrow: 1 }}>
          {allNav.map((l) => (
            <Box
              key={l.to}
              component={RouterLink}
              to={l.to}
              onClick={() => setOpen(false)}
              sx={{
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 1.6,
                mb: 0.5,
                borderRadius: 2,
                textDecoration: "none",
                color: isActive(l.to) ? "#C7A86B" : "rgba(231,224,214,0.8)",
                bgcolor: isActive(l.to) ? "rgba(199,168,107,0.08)" : "transparent",
                borderLeft: isActive(l.to) ? "2px solid #C7A86B" : "2px solid transparent",
                fontSize: "0.88rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                transition: "all 0.2s ease",
                "&:hover": { color: "#E7E0D6", bgcolor: "rgba(231,224,214,0.05)", borderLeftColor: "rgba(199,168,107,0.4)" },
              }}
            >
              {l.label}
            </Box>
          ))}
        </Box>

        {/* Bottom section */}
        <Box sx={{ px: 2, pb: 3 }}>
          <Box sx={{ mx: 1.5, mb: 2, height: "1px", bgcolor: "rgba(231,224,214,0.08)" }} />

          {user ? (
            <>
              {user.role === "admin" && (
                <Box
                  component={RouterLink} to="/admin/manage-slots"
                  onClick={() => setOpen(false)}
                  sx={{ display: "flex", alignItems: "center", px: 2, py: 1.4, mb: 0.5, borderRadius: 2, textDecoration: "none", color: "#C7A86B", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", bgcolor: "rgba(199,168,107,0.06)", border: "1px solid rgba(199,168,107,0.18)", "&:hover": { bgcolor: "rgba(199,168,107,0.12)" }, transition: "all 0.2s ease" }}
                >
                  ⚙ Admin Panel
                </Box>
              )}
              <Box
                onClick={handleLogout}
                sx={{ display: "flex", alignItems: "center", px: 2, py: 1.4, borderRadius: 2, cursor: "pointer", color: "rgba(231,224,214,0.5)", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", "&:hover": { color: "#E7E0D6", bgcolor: "rgba(231,224,214,0.04)" }, transition: "all 0.2s ease" }}
              >
                Sign Out
              </Box>
            </>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, px: 1.5 }}>
              <Box
                component={RouterLink} to="/login"
                onClick={() => setOpen(false)}
                sx={{ textAlign: "center", py: 1.4, borderRadius: 999, border: "1px solid rgba(199,168,107,0.45)", color: "#E7E0D6", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", "&:hover": { borderColor: "#C7A86B", bgcolor: "rgba(199,168,107,0.06)" }, transition: "all 0.2s ease" }}
              >
                Sign In
              </Box>
              <Box
                component={RouterLink} to="/register"
                onClick={() => setOpen(false)}
                sx={{ textAlign: "center", py: 1.4, borderRadius: 999, bgcolor: "#C7A86B", color: "#1A1614", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", "&:hover": { bgcolor: "#b5976a" }, transition: "all 0.2s ease" }}
              >
                Create Account
              </Box>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}
