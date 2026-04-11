// src/pages/ServiceDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EuroIcon from "@mui/icons-material/Euro";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";
import { BRAND } from "../brand/brand.js";
import { getServices } from "../api/services.js";

const MotionBox = motion(Box);

const MOCK_SERVICES = [
  { id: 1, name: "Classic Haircut", description: "Precision cut tailored to your style. Our barbers take the time to understand your preferred look and deliver a result that suits your face shape and lifestyle.", duration: 30, price: 20, category: "Hair" },
  { id: 2, name: "Beard Trim", description: "Sharp lines and a clean finish. We shape, trim, and define your beard with precision tools.", duration: 15, price: 12, category: "Beard" },
  { id: 3, name: "Haircut & Beard Combo", description: "The full groom — a precision cut followed by a detailed beard trim and shape.", duration: 45, price: 30, category: "Combo" },
  { id: 4, name: "Hot Towel Shave", description: "A traditional straight-razor shave with a hot towel prep. The classic barbershop experience.", duration: 30, price: 22, category: "Beard" },
  { id: 5, name: "Hair & Style", description: "Cut, wash, and finish with premium styling products for a polished look.", duration: 45, price: 28, category: "Hair" },
  { id: 6, name: "Full Grooming Package", description: "The complete Sharp Society experience — haircut, beard trim, hot towel, and finish.", duration: 60, price: 45, category: "Combo" },
];

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getServices()
      .then((res) => {
        const list = res.data.data || res.data;
        const found = list.find((s) => String(s.id) === String(id));
        setService(found || null);
      })
      .catch(() => {
        const found = MOCK_SERVICES.find((s) => String(s.id) === String(id));
        setService(found || null);
        if (!found) setError("Service not found.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 12 }}>
        <CircularProgress sx={{ color: "#C7A86B" }} />
      </Box>
    );

  if (!service || error)
    return (
      <Box sx={{ py: 10 }}>
        <Container maxWidth="md">
          <Alert severity="error" sx={{ mb: 3 }}>Service not found.</Alert>
          <Button variant="outlined" component={RouterLink} to="/services" startIcon={<ArrowBackIcon />}>
            Back to Services
          </Button>
        </Container>
      </Box>
    );

  return (
    <Box sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="md">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          {/* Back */}
          <Button
            component={RouterLink}
            to="/services"
            startIcon={<ArrowBackIcon />}
            color="inherit"
            sx={{ opacity: 0.7, mb: 4, pl: 0 }}
          >
            All Services
          </Button>

          {/* Overline */}
          <Typography variant="overline" sx={{ letterSpacing: "0.32em", opacity: 0.65 }}>
            {BRAND.name.toUpperCase()}
          </Typography>

          {/* Category chip */}
          {service.category && (
            <Chip
              label={service.category}
              size="small"
              sx={{
                ml: 1.5,
                bgcolor: "rgba(199,168,107,0.15)",
                color: "#C7A86B",
                fontWeight: 600,
                fontSize: "0.72rem",
                verticalAlign: "middle",
              }}
            />
          )}

          {/* Title */}
          <Typography
            sx={{
              mt: 1.5,
              fontFamily: "Playfair Display, serif",
              fontWeight: 700,
              fontSize: { xs: "2.4rem", md: "3.2rem" },
              lineHeight: 1.05,
            }}
          >
            {service.name}
          </Typography>

          {/* Stats row */}
          <Box sx={{ display: "flex", gap: 4, mt: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <AccessTimeIcon sx={{ color: "#C7A86B", fontSize: 20 }} />
              <Box>
                <Typography sx={{ fontSize: "0.75rem", opacity: 0.6 }}>Duration</Typography>
                <Typography sx={{ fontWeight: 700 }}>{service.duration} minutes</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <EuroIcon sx={{ color: "#C7A86B", fontSize: 20 }} />
              <Box>
                <Typography sx={{ fontSize: "0.75rem", opacity: 0.6 }}>Price</Typography>
                <Typography sx={{ fontWeight: 700, color: "#C7A86B" }}>
                  €{Number(service.price).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 4, opacity: 0.2 }} />

          {/* Description */}
          <Typography
            sx={{
              opacity: 0.85,
              lineHeight: 1.9,
              fontSize: "1.05rem",
              maxWidth: 680,
            }}
          >
            {service.description || "No description available."}
          </Typography>

          {/* What's included */}
          <Box
            sx={{
              mt: 5,
              p: 3,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <Typography
              variant="overline"
              sx={{ letterSpacing: "0.24em", opacity: 0.6, display: "block", mb: 1.5 }}
            >
              What to expect
            </Typography>
            <Stack spacing={1}>
              <Typography sx={{ opacity: 0.8, fontSize: "0.95rem" }}>✓ Professional consultation</Typography>
              <Typography sx={{ opacity: 0.8, fontSize: "0.95rem" }}>✓ Premium grooming products</Typography>
              <Typography sx={{ opacity: 0.8, fontSize: "0.95rem" }}>✓ Experienced barbers</Typography>
              <Typography sx={{ opacity: 0.8, fontSize: "0.95rem" }}>✓ Instant booking confirmation</Typography>
            </Stack>
          </Box>

          {/* CTAs */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 5 }}>
            <Button
              variant="contained"
              size="large"
              sx={{ py: 1.4 }}
              onClick={() => navigate(`/book-appointment?service=${service.id}`)}
            >
              Book this Service
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={RouterLink}
              to="/services"
            >
              View All Services
            </Button>
          </Stack>
        </MotionBox>
      </Container>
    </Box>
  );
}
