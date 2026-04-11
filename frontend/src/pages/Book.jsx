// src/pages/Book.jsx — landing page for booking, redirects to BookAppointment
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EuroIcon from "@mui/icons-material/Euro";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { BRAND } from "../brand/brand.js";
import { getServices } from "../api/services.js";
import { useAuth } from "../context/AuthContext.jsx";

const MotionBox = motion(Box);

const MOCK_SERVICES = [
  { id: 1, name: "Classic Haircut", duration: 30, price: 20, category: "Hair" },
  { id: 2, name: "Beard Trim", duration: 15, price: 12, category: "Beard" },
  { id: 3, name: "Haircut & Beard Combo", duration: 45, price: 30, category: "Combo" },
  { id: 4, name: "Hot Towel Shave", duration: 30, price: 22, category: "Beard" },
  { id: 5, name: "Hair & Style", duration: 45, price: 28, category: "Hair" },
  { id: 6, name: "Full Grooming Package", duration: 60, price: 45, category: "Combo" },
];

export default function Book() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data.data || res.data))
      .catch(() => {
        setError("Could not load live services — showing samples.");
        setServices(MOCK_SERVICES);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (svcId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/book-appointment?service=${svcId}`);
  };

  return (
    <Box sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="lg">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
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
            Book an Appointment
          </Typography>
          <Typography sx={{ mt: 2, opacity: 0.75, maxWidth: 640, lineHeight: 1.8 }}>
            {user
              ? "Select a service below to choose your date and barber."
              : "Please sign in to book. Select a service to get started — you will be prompted to log in."}
          </Typography>
        </MotionBox>

        {error && <Alert severity="warning" sx={{ mt: 3 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress sx={{ color: "#C7A86B" }} />
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {services.map((svc, idx) => (
              <Grid item xs={12} sm={6} md={4} key={svc.id}>
                <MotionBox
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                >
                  <Card
                    sx={{
                      transition: "border-color 200ms ease, box-shadow 200ms ease",
                      "&:hover": {
                        borderColor: "rgba(199,168,107,0.5)",
                        boxShadow: "0 8px 32px rgba(199,168,107,0.12)",
                      },
                    }}
                  >
                    <CardActionArea onClick={() => handleSelect(svc.id)}>
                      <CardContent>
                        {svc.category && (
                          <Chip
                            label={svc.category}
                            size="small"
                            sx={{
                              mb: 1.5,
                              bgcolor: "rgba(199,168,107,0.15)",
                              color: "#C7A86B",
                              fontWeight: 600,
                              fontSize: "0.72rem",
                            }}
                          />
                        )}
                        <Typography
                          sx={{
                            fontFamily: "Playfair Display, serif",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            mb: 2,
                          }}
                        >
                          {svc.name}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 15, opacity: 0.6 }} />
                            <Typography sx={{ fontSize: "0.85rem", opacity: 0.7 }}>
                              {svc.duration} min
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <EuroIcon sx={{ fontSize: 15, opacity: 0.6 }} />
                            <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#C7A86B" }}>
                              {Number(svc.price).toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        )}

        {!user && (
          <Box sx={{ mt: 6, p: 3, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 3, maxWidth: 480 }}>
            <Typography sx={{ opacity: 0.8, mb: 2 }}>
              You need to be signed in to complete a booking.
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" onClick={() => navigate("/login")}>Sign In</Button>
              <Button variant="outlined" onClick={() => navigate("/register")}>Register</Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
