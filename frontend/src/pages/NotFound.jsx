// src/pages/NotFound.jsx
import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { motion } from "framer-motion";
import Logo from "../components/Logo.jsx";
import { BRAND } from "../brand/brand.js";

const MotionBox = motion(Box);

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        py: 10,
      }}
    >
      <Container maxWidth="sm">
        <MotionBox
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          sx={{ textAlign: "center" }}
        >
          <Logo size={56} />

          <Typography
            sx={{
              mt: 3,
              fontFamily: "Playfair Display, serif",
              fontWeight: 800,
              fontSize: { xs: "5rem", md: "7rem" },
              lineHeight: 1,
              color: "#C7A86B",
              opacity: 0.6,
            }}
          >
            404
          </Typography>

          <Typography
            sx={{
              mt: 2,
              fontFamily: "Playfair Display, serif",
              fontWeight: 700,
              fontSize: { xs: "1.6rem", md: "2rem" },
            }}
          >
            Page Not Found
          </Typography>

          <Typography sx={{ mt: 2, opacity: 0.65, lineHeight: 1.75 }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </Typography>

          <Typography
            sx={{
              mt: 3,
              fontFamily: "Playfair Display, serif",
              fontStyle: "italic",
              opacity: 0.5,
            }}
          >
            — {BRAND.tagline}
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" sx={{ mt: 5 }}>
            <Button variant="contained" component={RouterLink} to="/">
              Go Home
            </Button>
            <Button variant="outlined" component={RouterLink} to="/services">
              View Services
            </Button>
          </Stack>
        </MotionBox>
      </Container>
    </Box>
  );
}
