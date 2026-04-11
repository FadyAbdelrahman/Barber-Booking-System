// src/components/Hero.jsx
import { Box, Container, Typography, Stack, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { BRAND } from "../brand/brand.js";

import HeroLogo from "../assets/brand/sharp-society-assets/png/sharp-society-primary-transparent.png";
import HeroBg from "../assets/brand/sharp-society-assets/images/barber-hero.jpg";

// ValueProps images (your paths)
import ImgCraft from "../assets/brand/sharp-society-assets/images/hair.jpg";
import ImgTime from "../assets/brand/sharp-society-assets/images/hair and beard.jpg";
import ImgConfidence from "../assets/brand/sharp-society-assets/images/beard.jpg";

const MotionBox = motion(Box);

/* -------------------------
   ValuePropsSection (INLINE)
-------------------------- */
const valueCards = [
  {
    kicker: "CRAFT",
    title: "Classic technique. Modern finish.",
    body: "Precision cuts and clean detail, tailored to your style. Walk out sharper, every time.",
    img: ImgCraft,
  },
  {
    kicker: "TIME",
    title: "Book in under a minute.",
    body: "Choose a service, pick a date, select a slot. Instant confirmation, no back-and-forth.",
    img: ImgTime,
  },
  {
    kicker: "CONFIDENCE",
    title: "Consistent experience.",
    body: "Clear pricing, reliable timing, and a smooth booking flow from start to finish.",
    img: ImgConfidence,
  },
];

function ValuePropsSection() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        backgroundColor: "#0B0B0C",
        color: "rgba(231,224,214,0.92)",
        py: { xs: 8, md: 12 },
        borderTop: "1px solid rgba(231,224,214,0.08)",
        borderBottom: "1px solid rgba(231,224,214,0.08)",
      }}
    >
      {/* subtle background sheen */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(900px 420px at 20% 20%, rgba(199,168,107,0.08) 0%, rgba(199,168,107,0) 60%), radial-gradient(900px 420px at 80% 40%, rgba(231,224,214,0.05) 0%, rgba(231,224,214,0) 55%)",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        {/* Kicker */}
        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Typography
            variant="overline"
            sx={{
              letterSpacing: "0.32em",
              opacity: 0.65,
              display: "block",
              mb: 1.5,
            }}
          >
            {BRAND.name.toUpperCase()}
          </Typography>
        </MotionBox>

        {/* Title + subcopy */}
        <MotionBox
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          sx={{ maxWidth: 980 }}
        >
          <Typography
            sx={{
              fontFamily: "Playfair Display, serif",
              fontWeight: 700,
              lineHeight: 1.05,
              fontSize: { xs: "2.4rem", md: "3.4rem" },
              mb: 2,
            }}
          >
            Purveyors of premium cuts
          </Typography>

          <Typography
            sx={{
              maxWidth: 720,
              opacity: 0.82,
              lineHeight: 1.85,
              fontSize: { xs: "1rem", md: "1.05rem" },
            }}
          >
            A clean, classic booking experience inspired by heritage barbershops. Choose a service,
            see available times, and book with confidence.
          </Typography>
        </MotionBox>

        {/* Proof row */}
        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
          sx={{
            mt: 4,
            display: "flex",
            flexWrap: "wrap",
            gap: 2.5,
            color: "rgba(231,224,214,0.72)",
          }}
        >
          <Typography sx={{ fontSize: "0.95rem" }}>★ 4.9 average</Typography>
          <Typography sx={{ fontSize: "0.95rem" }}>⏱ 30–45 min appointments</Typography>
          <Typography sx={{ fontSize: "0.95rem" }}>📍 Dublin (demo)</Typography>
          <Typography sx={{ fontSize: "0.95rem" }}>🗓 Mon–Sat</Typography>
        </MotionBox>

        {/* Cards */}
        <Box
          sx={{
            mt: { xs: 5, md: 6 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 2.5,
          }}
        >
          {valueCards.map((c, idx) => (
            <MotionBox
              key={c.kicker}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 * idx }}
              sx={{
                height: "100%",
                borderRadius: 3,
                border: "1px solid rgba(231,224,214,0.10)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
                p: { xs: 3, md: 3.5 },
                position: "relative",
                overflow: "hidden",

                // image wallpaper
                backgroundImage: `url(${c.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* dark overlay so text is readable */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.78) 100%)",
                }}
              />

              {/* corner accent */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background:
                    "radial-gradient(380px 180px at 85% 20%, rgba(199,168,107,0.18) 0%, rgba(199,168,107,0) 60%)",
                  opacity: 0.9,
                }}
              />

              <Box sx={{ position: "relative" }}>
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: "0.28em",
                    opacity: 0.65,
                    display: "block",
                    mb: 1,
                  }}
                >
                  {c.kicker}
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.12rem",
                    lineHeight: 1.3,
                    mb: 1.2,
                    color: "rgba(231,224,214,0.94)",
                  }}
                >
                  {c.title}
                </Typography>

                <Typography sx={{ opacity: 0.80, lineHeight: 1.75 }}>
                  {c.body}
                </Typography>
              </Box>
            </MotionBox>
          ))}
        </Box>

        {/* Divider + CTAs */}
        <Box
          sx={{
            mt: { xs: 5, md: 6 },
            pt: { xs: 4, md: 5 },
            borderTop: "1px solid rgba(231,224,214,0.10)",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              opacity: 0.72,
              fontFamily: "Playfair Display, serif",
              fontStyle: "italic",
            }}
          >
            Ready when you are. Choose a service to see available slots.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="contained" component={RouterLink} to="/book">
              Book now
            </Button>
            <Button variant="outlined" component={RouterLink} to="/services">
              View services
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

/* -------------------------
   Hero helpers
-------------------------- */
function OpeningStrip() {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        color: "rgba(231,224,214,0.82)",
        mb: { xs: 4, md: 5 },
      }}
    >
      <Typography
        sx={{
          fontFamily: "Playfair Display, serif",
          fontStyle: "italic",
          letterSpacing: "0.02em",
          fontSize: { xs: "0.98rem", md: "1.05rem" },
          opacity: 0.92,
          whiteSpace: "nowrap",
        }}
      >
        Open Monday – Saturday*
      </Typography>

      <Box sx={{ width: 44, height: 44, opacity: 0.9 }}>
        <svg viewBox="0 0 48 48" width="44" height="44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="16" stroke="#C7A86B" strokeWidth="2" opacity="0.85" />
          <path d="M16 14c10 5 10 15 0 20" stroke="#E7E0D6" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
          <path
            d="M18 17h8M18 21h10M18 25h11M18 29h10M18 33h8"
            stroke="#E7E0D6"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.35"
          />
        </svg>
      </Box>

      <Box sx={{ width: 28, opacity: 0.7 }}>
        <svg viewBox="0 0 64 24" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 12h52" stroke="#C7A86B" strokeWidth="2" strokeLinecap="round" />
          <path d="M44 4l10 8-10 8" stroke="#C7A86B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Box>

      <Box sx={{ width: 44, height: 44, opacity: 0.9 }}>
        <svg viewBox="0 0 48 48" width="44" height="44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="16" stroke="#C7A86B" strokeWidth="2" opacity="0.85" />
          <path d="M32 14c-10 5-10 15 0 20" stroke="#E7E0D6" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
          <path
            d="M30 17h-8M30 21h-10M30 25h-11M30 29h-10M30 33h-8"
            stroke="#E7E0D6"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.35"
          />
        </svg>
      </Box>
    </MotionBox>
  );
}

function ScrollDown({ targetId = "home-section-2" }) {
  const onClick = () => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <MotionBox
      onClick={onClick}
      role="button"
      aria-label="Scroll down"
      sx={{
        mt: { xs: 5, md: 6 },
        width: 46,
        height: 46,
        borderRadius: "999px",
        border: "1px solid rgba(231,224,214,0.28)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "transform 150ms ease, border-color 150ms ease",
        "&:hover": { transform: "translateY(1px)", borderColor: "rgba(231,224,214,0.55)" },
      }}
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRight: "2px solid rgba(231,224,214,0.85)",
          borderBottom: "2px solid rgba(231,224,214,0.85)",
          transform: "rotate(45deg)",
          mt: "-2px",
        }}
      />
    </MotionBox>
  );
}

/* -------------------------
   Hero main
-------------------------- */
export default function Hero() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
  };

  const item = {
    hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: "easeOut" } },
  };

  const reveal = {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <>
      {/* HERO (full-bleed fullscreen) */}
      <Box
        sx={{
          position: "relative",
          width: "100vw",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          borderBottom: "1px solid rgba(231,224,214,0.10)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${HeroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transform: "scale(1.06)",
            filter: "grayscale(1) contrast(1.18) brightness(0.72)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(11,11,12,0.92) 0%, rgba(11,11,12,0.70) 45%, rgba(11,11,12,0.55) 100%)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(1200px 650px at 50% 45%, rgba(11,11,12,0) 0%, rgba(11,11,12,0.55) 70%, rgba(11,11,12,0.92) 100%)",
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", py: { xs: 7, md: 10 } }}>
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <MotionBox variants={container} initial="hidden" animate="show" sx={{ width: "100%" }}>
              <MotionBox variants={item}>
                <Box
                  component="img"
                  src={HeroLogo}
                  alt="Sharp Society"
                  sx={{
                    width: { xs: "min(520px, 92vw)", md: 860 },
                    maxWidth: "100%",
                    mb: 2.5,
                    opacity: 0.98,
                    userSelect: "none",
                  }}
                />
              </MotionBox>

              <MotionBox variants={item}>
                <Typography
                  sx={{
                    opacity: 0.84,
                    mt: 0.5,
                    maxWidth: 760,
                    mx: "auto",
                    lineHeight: 1.8,
                    fontSize: { xs: "0.98rem", md: "1.05rem" },
                  }}
                >
                  Choose a service, select a time slot, and walk out sharper.
                </Typography>
              </MotionBox>

              <MotionBox variants={item}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4, justifyContent: "center", alignItems: "center" }}>
                  <Button variant="contained" component={RouterLink} to="/book">
                    Book Appointment
                  </Button>
                  <Button variant="outlined" component={RouterLink} to="/services">
                    View Services
                  </Button>
                </Stack>
              </MotionBox>

              <MotionBox variants={item}>
                <Typography variant="overline" sx={{ letterSpacing: "0.28em", opacity: 0.65, display: "block", mt: 5 }}>
                  {BRAND.name.toUpperCase()}
                </Typography>
              </MotionBox>

              <MotionBox variants={item}>
                <ScrollDown targetId="home-section-2" />
              </MotionBox>
            </MotionBox>
          </Box>
        </Container>
      </Box>

      {/* SECTION 2 (gray block like Benicky) */}
      <Box
        id="home-section-2"
        sx={{
          position: "relative",
          width: "100vw",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          backgroundColor: "#2F343B",
          color: "rgba(231,224,214,0.92)",
          py: { xs: 8, md: 12 },
          borderBottom: "1px solid rgba(231,224,214,0.10)",
        }}
      >
        <Container maxWidth="lg">
          <OpeningStrip />

          <MotionBox initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={reveal}>
            <Typography
              sx={{
                textAlign: "center",
                fontFamily: "Playfair Display, serif",
                fontStyle: "italic",
                color: "rgba(231,224,214,0.78)",
                mb: 4,
              }}
            >
              *Visit our booking platform to see available times
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
                gap: { xs: 4, md: 6 },
                alignItems: "start",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontSize: { xs: "1.2rem", md: "1.35rem" },
                    color: "rgba(231,224,214,0.86)",
                    mb: 1.5,
                  }}
                >
                  WE ARE SHARP SOCIETY
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "Playfair Display, serif",
                    fontWeight: 700,
                    lineHeight: 1.1,
                    fontSize: { xs: "2.2rem", md: "3.2rem" },
                  }}
                >
                  Purveyors of premium quality
                  <br />& expertly crafted cuts
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontFamily: "Playfair Display, serif",
                    fontStyle: "italic",
                    color: "rgba(231,224,214,0.86)",
                    lineHeight: 1.3,
                    fontSize: { xs: "1.05rem", md: "1.1rem" },
                    mb: 3,
                  }}
                >
                  We invite you in. As you step into Sharp Society, you will be met with the sensory overload of an era
                  bygone, steeped in tradition and authenticity.
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 2.5,
                    color: "rgba(231,224,214,0.78)",
                  }}
                >
                  <Typography sx={{ fontSize: "0.98rem" }}>
                    To serve all, no matter title or rank. Constantly striving towards a consistent higher standard.
                  </Typography>
                  <Typography sx={{ fontSize: "0.98rem" }}>
                    More than just a cut, allow us to make you feel like the man you were put on this earth to be.
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-start" }, mt: 4 }}>
                  <Button
                    variant="outlined"
                    component={RouterLink}
                    to="/book"
                    sx={{
                      borderColor: "rgba(199,168,107,0.8)",
                      color: "rgba(231,224,214,0.9)",
                      "&:hover": { borderColor: "rgba(199,168,107,1)" },
                    }}
                  >
                    Book Online
                  </Button>
                </Box>
              </Box>
            </Box>
          </MotionBox>
        </Container>
      </Box>

      {/* SECTION 3 (Value Props) */}
      <ValuePropsSection />
    </>
  );
}
 