// src/pages/MyBookings.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import EuroIcon from "@mui/icons-material/Euro";
import { motion } from "framer-motion";
import { BRAND } from "../brand/brand.js";
import { getMyAppointments, cancelAppointment } from "../api/appointments.js";
import { useAuth } from "../context/AuthContext.jsx";

const MotionBox = motion(Box);

const statusColor = {
  pending: { bg: "rgba(199,168,107,0.18)", color: "#C7A86B" },
  confirmed: { bg: "rgba(76,175,80,0.15)", color: "#81c784" },
  cancelled: { bg: "rgba(244,67,54,0.12)", color: "#e57373" },
  completed: { bg: "rgba(100,181,246,0.12)", color: "#64b5f6" },
};

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelId, setCancelId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    getMyAppointments()
      .then((res) => setAppointments(res.data.data || res.data))
      .catch(() => setError("Could not load your appointments. Make sure you are logged in and the server is running."))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelAppointment(cancelId);
      setAppointments((prev) =>
        prev.map((a) => (a.id === cancelId ? { ...a, status: "cancelled" } : a))
      );
      setCancelId(null);
    } catch {
      setError("Could not cancel appointment.");
    } finally {
      setCancelling(false);
    }
  };

  const active = appointments.filter((a) => a.status !== "cancelled" && a.status !== "completed");
  const past = appointments.filter((a) => a.status === "cancelled" || a.status === "completed");

  if (!user) return null;

  return (
    <Box sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="md">
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
              mb: 1,
              fontFamily: "Playfair Display, serif",
              fontWeight: 700,
              fontSize: { xs: "2.2rem", md: "3rem" },
              lineHeight: 1.05,
            }}
          >
            My Bookings
          </Typography>
          <Typography sx={{ opacity: 0.7, mb: 5, lineHeight: 1.8 }}>
            All your upcoming and past appointments in one place.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
              <CircularProgress sx={{ color: "#C7A86B" }} />
            </Box>
          ) : appointments.length === 0 ? (
            <Box
              sx={{
                p: 5,
                textAlign: "center",
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <Typography sx={{ opacity: 0.7, mb: 3 }}>
                You don&apos;t have any bookings yet.
              </Typography>
              <Button variant="contained" component={RouterLink} to="/book">
                Book an Appointment
              </Button>
            </Box>
          ) : (
            <>
              {/* Active */}
              {active.length > 0 && (
                <>
                  <Typography
                    variant="overline"
                    sx={{ letterSpacing: "0.24em", opacity: 0.6, display: "block", mb: 2 }}
                  >
                    Upcoming
                  </Typography>
                  <Stack spacing={2} sx={{ mb: 5 }}>
                    {active.map((appt, idx) => (
                      <AppointmentCard
                        key={appt.id}
                        appt={appt}
                        idx={idx}
                        onCancel={() => setCancelId(appt.id)}
                      />
                    ))}
                  </Stack>
                </>
              )}

              {/* Past */}
              {past.length > 0 && (
                <>
                  <Divider sx={{ my: 4, opacity: 0.18 }} />
                  <Typography
                    variant="overline"
                    sx={{ letterSpacing: "0.24em", opacity: 0.6, display: "block", mb: 2 }}
                  >
                    Past & Cancelled
                  </Typography>
                  <Stack spacing={2}>
                    {past.map((appt, idx) => (
                      <AppointmentCard key={appt.id} appt={appt} idx={idx} readonly />
                    ))}
                  </Stack>
                </>
              )}
            </>
          )}

          <Box sx={{ mt: 5 }}>
            <Button variant="outlined" component={RouterLink} to="/book">
              + Book Another Appointment
            </Button>
          </Box>
        </MotionBox>
      </Container>

      {/* Cancel dialog */}
      <Dialog open={Boolean(cancelId)} onClose={() => setCancelId(null)}>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel this appointment? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelId(null)}>Keep it</Button>
          <Button color="error" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? <CircularProgress size={18} /> : "Cancel Booking"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function AppointmentCard({ appt, idx, onCancel, readonly }) {
  const status = statusColor[appt.status] || statusColor.pending;
  const formatted = new Date(appt.appointment_date).toLocaleDateString("en-IE", {
    weekday: "short", year: "numeric", month: "short", day: "numeric",
  });

  return (
    <MotionBox
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.06 }}
    >
      <Card sx={{ opacity: readonly ? 0.75 : 1 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 1 }}>
            <Typography sx={{ fontFamily: "Playfair Display, serif", fontWeight: 700, fontSize: "1.1rem" }}>
              {appt.service_name}
            </Typography>
            <Chip
              label={appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
              size="small"
              sx={{ bgcolor: status.bg, color: status.color, fontWeight: 600, fontSize: "0.75rem" }}
            />
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5, mt: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <PersonIcon sx={{ fontSize: 15, opacity: 0.6 }} />
              <Typography sx={{ fontSize: "0.85rem", opacity: 0.75 }}>{appt.barber_name}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarMonthIcon sx={{ fontSize: 15, opacity: 0.6 }} />
              <Typography sx={{ fontSize: "0.85rem", opacity: 0.75 }}>{formatted}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 15, opacity: 0.6 }} />
              <Typography sx={{ fontSize: "0.85rem", opacity: 0.75 }}>
                {appt.appointment_time} · {appt.duration} min
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <EuroIcon sx={{ fontSize: 15, opacity: 0.6 }} />
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#C7A86B" }}>
                {Number(appt.price).toFixed(2)}
              </Typography>
            </Box>
          </Box>

          {!readonly && appt.status !== "cancelled" && (
            <Box sx={{ mt: 2.5 }}>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={onCancel}
                sx={{ borderColor: "rgba(229,115,115,0.4)", color: "#e57373" }}
              >
                Cancel Appointment
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </MotionBox>
  );
}
