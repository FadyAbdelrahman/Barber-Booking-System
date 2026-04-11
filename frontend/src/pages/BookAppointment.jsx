// src/pages/BookAppointment.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Stack,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  Divider,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EuroIcon from "@mui/icons-material/Euro";
import PersonIcon from "@mui/icons-material/Person";
import { motion } from "framer-motion";
import { BRAND } from "../brand/brand.js";
import { getServices } from "../api/services.js";
import { getBarbers } from "../api/barbers.js";
import { createAppointment } from "../api/appointments.js";
import { useAuth } from "../context/AuthContext.jsx";

const MotionBox = motion(Box);

const MOCK_SERVICES = [
  { id: 1, name: "Classic Haircut", duration: 30, price: 20 },
  { id: 2, name: "Beard Trim", duration: 15, price: 12 },
  { id: 3, name: "Haircut & Beard Combo", duration: 45, price: 30 },
  { id: 4, name: "Hot Towel Shave", duration: 30, price: 22 },
];
const MOCK_BARBERS = [
  { id: 1, name: "James O'Brien", specialty: "Classic cuts & fades" },
  { id: 2, name: "Declan Murphy", specialty: "Beard grooming & hot towel" },
  { id: 3, name: "Sean Kavanagh", specialty: "Modern styles & colour" },
];

// Time slots available each day
const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

// Minimum date = today
function todayISO() {
  return new Date().toISOString().split("T")[0];
}

const STEPS = ["Service", "Barber", "Date & Time", "Confirm"];

export default function BookAppointment() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const preselect = params.get("service");
    Promise.allSettled([getServices(), getBarbers()])
      .then(([sRes, bRes]) => {
        const svcList = sRes.status === "fulfilled" ? (sRes.value.data.data || sRes.value.data) : MOCK_SERVICES;
        const barbList = bRes.status === "fulfilled" ? (bRes.value.data.data || bRes.value.data) : MOCK_BARBERS;
        setServices(svcList);
        setBarbers(barbList);
        if (preselect) {
          const found = svcList.find((s) => String(s.id) === String(preselect));
          if (found) { setSelectedService(found); setStep(1); }
        }
      })
      .finally(() => setLoadingData(false));
  }, [params]);

  const canNext = () => {
    if (step === 0) return Boolean(selectedService);
    if (step === 1) return Boolean(selectedBarber);
    if (step === 2) return Boolean(selectedDate && selectedTime);
    return true;
  };

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setSubmitting(true);
    setApiError("");
    try {
      await createAppointment({
        service_id: selectedService.id,
        barber_id: selectedBarber.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        notes: notes || undefined,
      });
      navigate("/booking-confirmation", {
        state: { service: selectedService, barber: selectedBarber, date: selectedDate, time: selectedTime },
      });
    } catch (err) {
      setApiError(err.response?.data?.message || "Could not create booking. Please try again.");
      setSubmitting(false);
    }
  };

  if (!user) return null;
  if (loadingData)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 12 }}>
        <CircularProgress sx={{ color: "#C7A86B" }} />
      </Box>
    );

  return (
    <Box sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="md">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography variant="overline" sx={{ letterSpacing: "0.32em", opacity: 0.65 }}>
            {BRAND.name.toUpperCase()}
          </Typography>
          <Typography
            sx={{
              mt: 1.5,
              mb: 5,
              fontFamily: "Playfair Display, serif",
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.8rem" },
            }}
          >
            Book Appointment
          </Typography>

          <Stepper activeStep={step} sx={{ mb: 6 }}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {apiError && <Alert severity="error" sx={{ mb: 3 }}>{apiError}</Alert>}

          {/* STEP 0 — SERVICE */}
          {step === 0 && (
            <Box>
              <Typography sx={{ mb: 3, opacity: 0.75 }}>Choose the service you&apos;d like to book.</Typography>
              <Stack spacing={1.5}>
                {services.map((svc) => (
                  <Card
                    key={svc.id}
                    sx={{
                      border: "1px solid",
                      borderColor: selectedService?.id === svc.id ? "#C7A86B" : "divider",
                      boxShadow: selectedService?.id === svc.id ? "0 0 0 2px rgba(199,168,107,0.35)" : "none",
                    }}
                  >
                    <CardActionArea onClick={() => setSelectedService(svc)}>
                      <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                          <Typography sx={{ fontWeight: 700 }}>{svc.name}</Typography>
                          <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                              <AccessTimeIcon sx={{ fontSize: 14, opacity: 0.6 }} />
                              <Typography sx={{ fontSize: "0.82rem", opacity: 0.7 }}>{svc.duration} min</Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Typography sx={{ fontWeight: 700, color: "#C7A86B", fontSize: "1.1rem" }}>
                          €{Number(svc.price).toFixed(2)}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </Stack>
            </Box>
          )}

          {/* STEP 1 — BARBER */}
          {step === 1 && (
            <Box>
              <Typography sx={{ mb: 3, opacity: 0.75 }}>Choose your preferred barber.</Typography>
              <Stack spacing={1.5}>
                {barbers.map((b) => (
                  <Card
                    key={b.id}
                    sx={{
                      border: "1px solid",
                      borderColor: selectedBarber?.id === b.id ? "#C7A86B" : "divider",
                      boxShadow: selectedBarber?.id === b.id ? "0 0 0 2px rgba(199,168,107,0.35)" : "none",
                    }}
                  >
                    <CardActionArea onClick={() => setSelectedBarber(b)}>
                      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            bgcolor: "rgba(199,168,107,0.18)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <PersonIcon sx={{ color: "#C7A86B" }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 700 }}>{b.name}</Typography>
                          {b.specialty && (
                            <Typography sx={{ fontSize: "0.85rem", opacity: 0.65 }}>{b.specialty}</Typography>
                          )}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </Stack>
            </Box>
          )}

          {/* STEP 2 — DATE & TIME */}
          {step === 2 && (
            <Box>
              <Typography sx={{ mb: 3, opacity: 0.75 }}>Select a date and available time slot.</Typography>

              <TextField
                label="Appointment Date"
                type="date"
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(""); }}
                inputProps={{ min: todayISO() }}
                sx={{ mb: 4 }}
                fullWidth
              />

              {selectedDate && (
                <>
                  <Typography sx={{ mb: 2, opacity: 0.75, fontSize: "0.9rem" }}>Available times</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                    {TIME_SLOTS.map((t) => (
                      <Chip
                        key={t}
                        label={t}
                        clickable
                        onClick={() => setSelectedTime(t)}
                        variant={selectedTime === t ? "filled" : "outlined"}
                        sx={
                          selectedTime === t
                            ? { bgcolor: "#C7A86B", color: "#0B0B0C", fontWeight: 700, borderColor: "#C7A86B" }
                            : { borderColor: "rgba(231,224,214,0.25)", color: "rgba(231,224,214,0.75)" }
                        }
                      />
                    ))}
                  </Box>
                </>
              )}

              <TextField
                label="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                rows={3}
                fullWidth
                sx={{ mt: 4 }}
                placeholder="Any preferences or special requests…"
              />
            </Box>
          )}

          {/* STEP 3 — CONFIRM */}
          {step === 3 && (
            <Box>
              <Typography sx={{ mb: 3, opacity: 0.75 }}>Review your booking before confirming.</Typography>
              <Box
                sx={{
                  p: 3.5,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                }}
              >
                <Typography variant="overline" sx={{ opacity: 0.6, letterSpacing: "0.24em" }}>
                  Booking Summary
                </Typography>

                <Divider sx={{ my: 2, opacity: 0.2 }} />

                <Stack spacing={2}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ opacity: 0.7 }}>Service</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{selectedService?.name}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ opacity: 0.7 }}>Barber</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{selectedBarber?.name}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ opacity: 0.7 }}>Date</Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IE", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric",
                      })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ opacity: 0.7 }}>Time</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{selectedTime}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ opacity: 0.7 }}>Duration</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{selectedService?.duration} min</Typography>
                  </Box>
                  <Divider sx={{ opacity: 0.2 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                    <Typography sx={{ fontWeight: 800, color: "#C7A86B", fontSize: "1.15rem" }}>
                      €{Number(selectedService?.price).toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>

                {notes && (
                  <Box sx={{ mt: 2.5 }}>
                    <Typography sx={{ opacity: 0.6, fontSize: "0.85rem" }}>Notes</Typography>
                    <Typography sx={{ opacity: 0.85, mt: 0.5 }}>{notes}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* Navigation buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 5 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={step === 0}
              sx={{ visibility: step === 0 ? "hidden" : "visible" }}
            >
              Back
            </Button>

            {step < 3 ? (
              <Button variant="contained" onClick={handleNext} disabled={!canNext()} sx={{ px: 4 }}>
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitting}
                sx={{ px: 4 }}
              >
                {submitting ? <CircularProgress size={20} color="inherit" /> : "Confirm Booking"}
              </Button>
            )}
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
}
