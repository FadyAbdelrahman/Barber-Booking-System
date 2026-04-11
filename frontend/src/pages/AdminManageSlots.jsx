// src/pages/AdminManageSlots.jsx
import { useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Alert,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { motion } from "framer-motion";
import { BRAND } from "../brand/brand.js";
import { useAuth } from "../context/AuthContext.jsx";

const MotionBox = motion(Box);

export default function AdminManageSlots() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "admin") navigate("/dashboard");
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  return (
    <Box sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="lg">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <AdminPanelSettingsIcon sx={{ color: "#C7A86B", fontSize: 36 }} />
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: "0.32em", opacity: 0.65 }}>
                {BRAND.name.toUpperCase()}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Playfair Display, serif",
                  fontWeight: 700,
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                  lineHeight: 1.1,
                }}
              >
                Admin Panel
              </Typography>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mb: 4 }}>
            You are signed in as <strong>{user.name}</strong> with admin privileges.
          </Alert>

          <Divider sx={{ my: 3, opacity: 0.18 }} />

          <Stack spacing={3}>
            <Box
              sx={{
                p: 3,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Manage Appointments</Typography>
              <Typography sx={{ opacity: 0.7, mb: 2, fontSize: "0.9rem" }}>
                View all bookings across all users and update their status.
              </Typography>
              <Typography sx={{ opacity: 0.5, fontSize: "0.85rem", fontStyle: "italic" }}>
                Full admin management UI — connect to GET /api/appointments/all (admin route)
              </Typography>
            </Box>

            <Box
              sx={{
                p: 3,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Manage Barbers</Typography>
              <Typography sx={{ opacity: 0.7, mb: 2, fontSize: "0.9rem" }}>
                Add, edit, or remove barbers from the system.
              </Typography>
              <Typography sx={{ opacity: 0.5, fontSize: "0.85rem", fontStyle: "italic" }}>
                Connect to POST/PUT/DELETE /api/barbers
              </Typography>
            </Box>

            <Box
              sx={{
                p: 3,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Manage Services</Typography>
              <Typography sx={{ opacity: 0.7, mb: 2, fontSize: "0.9rem" }}>
                Add or update the services offered (name, price, duration).
              </Typography>
              <Typography sx={{ opacity: 0.5, fontSize: "0.85rem", fontStyle: "italic" }}>
                Connect to POST/PUT/DELETE /api/services
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ mt: 5 }}>
            <Button variant="outlined" component={RouterLink} to="/dashboard">
              Back to Dashboard
            </Button>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
}
