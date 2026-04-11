// src/pages/ServicesCatalogue.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EuroIcon from "@mui/icons-material/Euro";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "framer-motion";
import { BRAND } from "../brand/brand.js";
import { getServices } from "../api/services.js";

import ImgHair from "../assets/brand/sharp-society-assets/images/hair.jpg";
import ImgBeard from "../assets/brand/sharp-society-assets/images/beard.jpg";
import ImgCombo from "../assets/brand/sharp-society-assets/images/hair and beard.jpg";

const MotionBox = motion(Box);

/* ─── EXPANDING CARD (reusable) ─────────────────────────────────────── */
function ExpandCard({ img, bgColor, kicker, title, body, isActive, onClick, children, icon }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        overflow: "hidden",
        flex: isActive ? 5 : 1,
        minWidth: 60,
        minHeight: { xs: 200, md: 340 },
        borderRadius: 3,
        cursor: "pointer",
        transition: "flex .5s cubic-bezier(0.05, 0.61, 0.41, 0.95), border-color .3s ease",
        border: "1px solid",
        borderColor: isActive ? "rgba(199,168,107,0.55)" : "rgba(231,224,214,0.08)",
        backgroundImage: img ? `url(${img})` : undefined,
        backgroundColor: bgColor || "#1a1a1c",
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&:hover": { borderColor: "rgba(199,168,107,0.35)" },
      }}
    >
      {/* overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: isActive
            ? "linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.78) 55%, rgba(0,0,0,0.35) 100%)"
            : "rgba(0,0,0,0.84)",
          transition: "background .5s ease",
        }}
      />

      {/* brass glow — active only */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: isActive ? 1 : 0,
          transition: "opacity .4s ease",
          background:
            "radial-gradient(280px 160px at 85% 8%, rgba(199,168,107,0.18) 0%, transparent 65%)",
        }}
      />

      {/* content */}
      <Box
        sx={{
          position: "relative",
          height: "100%",
          p: { xs: 2.5, md: 3.5 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* collapsed: icon + vertical label */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            opacity: isActive ? 0 : 1,
            transition: "opacity .3s ease",
            pointerEvents: isActive ? "none" : "auto",
          }}
        >
          {/* emoji icon */}
          <Typography sx={{ fontSize: { xs: "1.3rem", md: "1.6rem" }, lineHeight: 1, userSelect: "none" }}>
            {icon}
          </Typography>

          {/* vertical service name */}
          <Typography
            sx={{
              fontFamily: "Playfair Display, serif",
              fontWeight: 800,
              fontSize: { xs: "0.75rem", md: "0.88rem" },
              color: "#C7A86B",
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              letterSpacing: "0.18em",
              overflow: "hidden",
              textShadow: "0 1px 4px rgba(0,0,0,0.8)",
            }}
          >
            {kicker}
          </Typography>
        </Box>

        {/* expanded content */}
        <Box
          sx={{
            opacity: isActive ? 1 : 0,
            transform: isActive ? "translateY(0)" : "translateY(14px)",
            transition: "opacity .35s ease .15s, transform .35s ease .15s",
            pointerEvents: isActive ? "auto" : "none",
          }}
        >
          <Typography
            variant="overline"
            sx={{
              letterSpacing: "0.32em",
              color: "#C7A86B",
              display: "block",
              mb: 1,
              fontSize: "0.68rem",
              fontWeight: 700,
              textShadow: "0 0 8px rgba(0,0,0,1), 0 2px 4px rgba(0,0,0,1)",
            }}
          >
            {kicker}
          </Typography>

          <Typography
            sx={{
              fontFamily: "Playfair Display, serif",
              fontWeight: 800,
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              color: "#FFFFFF",
              lineHeight: 1.2,
              mb: 1.2,
              textShadow: "0 0 12px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,1)",
            }}
          >
            {title}
          </Typography>

          {body && (
            <Typography
              sx={{
                fontSize: "0.875rem",
                color: "#F0EBE1",
                lineHeight: 1.75,
                mb: 2,
                textShadow: "0 1px 8px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,1)",
              }}
            >
              {body}
            </Typography>
          )}

          {children}
        </Box>

        {/* arrow button */}
        <Box
          sx={{
            alignSelf: "flex-end",
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid rgba(199,168,107,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isActive ? 1 : 0.4,
            transition: "opacity .3s ease",
          }}
        >
          <ArrowForwardIcon sx={{ fontSize: 15, color: "#C7A86B" }} />
        </Box>
      </Box>
    </Box>
  );
}

/* ─── SERVICE ICON MAP ───────────────────────────────────────────────── */
function getServiceIcon(name = "") {
  const n = name.toLowerCase();
  if (n.includes("deluxe") || n.includes("package"))  return "⭐";
  if (n.includes("colour") || n.includes("color"))    return "🎨";
  if (n.includes("kids")   || n.includes("child"))    return "👦";
  if (n.includes("shave")  || n.includes("towel"))    return "🪒";
  if (n.includes("buzz"))                             return "⚡";
  if (n.includes("combo")  || n.includes("&"))        return "💈";
  if (n.includes("beard"))                            return "🧔";
  return "✂️";
}

/* ─── SERVICE BG COLOURS (when no image) ────────────────────────────── */
const SVC_COLORS = [
  "#1a1410", "#12151a", "#111813",
  "#1a1410", "#12151a", "#111813",
];

/* ─── MOCK DATA ──────────────────────────────────────────────────────── */
const MOCK_SERVICES = [
  { id: 1, name: "Classic Haircut",       description: "Precision cut tailored to your style.",               duration: 30, price: 20, category: "Hair"  },
  { id: 2, name: "Beard Trim",            description: "Sharp lines and a clean finish.",                     duration: 15, price: 12, category: "Beard" },
  { id: 3, name: "Haircut & Beard Combo", description: "Full groom package — cut and beard.",                 duration: 45, price: 30, category: "Combo" },
  { id: 4, name: "Hot Towel Shave",       description: "Traditional straight-razor hot towel shave.",         duration: 30, price: 22, category: "Beard" },
  { id: 5, name: "Hair & Style",          description: "Cut, wash, and finish with premium products.",        duration: 45, price: 28, category: "Hair"  },
  { id: 6, name: "Full Grooming Package", description: "The complete Sharp Society experience.",              duration: 60, price: 45, category: "Combo" },
];

/* ─── PAGE ───────────────────────────────────────────────────────────── */
export default function ServicesCatalogue() {
  const navigate = useNavigate();
  const [services, setServices]   = useState([]);
  const [search,   setSearch]     = useState("");
  const [filter,   setFilter]     = useState("All");
  const [loading,  setLoading]    = useState(true);
  const [error,    setError]      = useState("");

  // which service card is expanded
  const [svcActive,  setSvcActive]  = useState(0);

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data.data || res.data))
      .catch(() => { setError("Could not reach server — showing sample services."); setServices(MOCK_SERVICES); })
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(services.map((s) => s.category).filter(Boolean))];

  const filtered = services.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || s.category === filter;
    return matchSearch && matchFilter;
  });

  // map service category → image
  const catImg = { Hair: ImgHair, Beard: ImgBeard, Combo: ImgCombo };

  return (
    <Box>
      {/* ── HEADER ───────────────────────────────────── */}
      <Box sx={{ pt: { xs: 8, md: 10 }, pb: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <Typography variant="overline" sx={{ letterSpacing: "0.32em", opacity: 0.65 }}>
              {BRAND.name.toUpperCase()}
            </Typography>
            <Typography
              sx={{
                mt: 1.5,
                fontFamily: "Playfair Display, serif",
                fontWeight: 700,
                fontSize: { xs: "2.2rem", md: "3rem" },
                lineHeight: 1.05,
              }}
            >
              Our Services
            </Typography>
            <Typography sx={{ mt: 2, opacity: 0.75, maxWidth: 600, lineHeight: 1.8 }}>
              Choose a service to see pricing, duration, and available barbers. Book in under a minute.
            </Typography>
          </MotionBox>
        </Container>
      </Box>

      {/* ── SEARCH + FILTER ──────────────────────────── */}
      <Box sx={{ pt: { xs: 6, md: 8 }, pb: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: "flex-start" }}>
            <TextField
              placeholder="Search services…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ width: { xs: "100%", sm: 300 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 18, opacity: 0.6 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  clickable
                  onClick={() => setFilter(cat)}
                  variant={filter === cat ? "filled" : "outlined"}
                  sx={
                    filter === cat
                      ? { bgcolor: "#C7A86B", color: "#0B0B0C", fontWeight: 700, borderColor: "#C7A86B" }
                      : { borderColor: "rgba(231,224,214,0.25)", color: "rgba(231,224,214,0.75)" }
                  }
                />
              ))}
            </Box>
          </Box>

          {error && <Alert severity="warning" sx={{ mt: 3 }}>{error}</Alert>}
        </Container>
      </Box>

      {/* ── SERVICE EXPANDING CARDS ───────────────────── */}
      <Box sx={{ pb: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <CircularProgress sx={{ color: "#C7A86B" }} />
            </Box>
          ) : filtered.length === 0 ? (
            <Typography sx={{ opacity: 0.6, py: 6 }}>No services match your search.</Typography>
          ) : (
            <Box sx={{ display: "flex", gap: 1.5, height: { xs: 240, md: 360 } }}>
              {filtered.map((svc, idx) => (
                <ExpandCard
                  key={svc.id}
                  img={catImg[svc.category] || null}
                  bgColor={SVC_COLORS[idx % SVC_COLORS.length]}
                  kicker={svc.name}
                  title={svc.name}
                  body={svc.description}
                  isActive={svcActive === idx}
                  onClick={() => setSvcActive(idx)}
                  icon={getServiceIcon(svc.name)}
                >
                  {/* price + duration row */}
                  <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 14, color: "#fff" }} />
                      <Typography sx={{ fontSize: "0.85rem", color: "#fff", fontWeight: 600, textShadow: "0 1px 6px rgba(0,0,0,1)" }}>
                        {svc.duration} min
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                      <EuroIcon sx={{ fontSize: 14, color: "#C7A86B" }} />
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: "#C7A86B", textShadow: "0 1px 6px rgba(0,0,0,1)" }}>
                        {Number(svc.price).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => { e.stopPropagation(); navigate(`/services/${svc.id}`); }}
                    sx={{
                      borderColor: "rgba(199,168,107,0.5)",
                      color: "#C7A86B",
                      fontSize: "0.78rem",
                      py: 0.5,
                      "&:hover": { borderColor: "#C7A86B", bgcolor: "rgba(199,168,107,0.08)" },
                    }}
                  >
                    View details →
                  </Button>
                </ExpandCard>
              ))}
            </Box>
          )}

          {/* CTA */}
          {!loading && filtered.length > 0 && (
            <Box sx={{ mt: 7, textAlign: "center" }}>
              <Button variant="contained" size="large" onClick={() => navigate("/book")}>
                Book an Appointment
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
}
