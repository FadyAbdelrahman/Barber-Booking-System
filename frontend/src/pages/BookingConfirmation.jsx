// src/pages/BookingConfirmation.jsx
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { motion } from "framer-motion";
import { BRAND } from "../brand/brand.js";

const MotionBox = motion(Box);

export default function BookingConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { service, barber, date, time } = state || {};

  if (!service) {
    return (
      <Box sx={{ py: 10 }}>
        <Container maxWidth="sm">
          <Typography sx={{ mb: 3 }}>No booking details found.</Typography>
          <Button variant="contained" onClick={() => navigate("/book")}>Make a Booking</Button>
        </Container>
      </Box>
    );
  }

  const formatted = new Date(date + "T00:00:00").toLocaleDateString("en-IE", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="sm">
        <MotionBox
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          sx={{ textAlign: "center" }}
        >
          {/* Success icon */}
          <CheckCircleOutlineIcon
            sx={{ fontSize: 72, color: "#C7A86B", mb: 2 }}
          />

          <Typography variant="overline" sx={{ letterSpacing: "0.32em", opacity: 0.65 }}>
            {BRAND.name.toUpperCase()}
          </Typography>

          <Typography
            sx={{
              mt: 1.5,
              mb: 1,
              fontFamily: "Playfair Display, serif",
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.6rem" },
              lineHeight: 1.1,
            }}
          >
            Booking Confirmed
          </Typography>

          <Typography sx={{ opacity: 0.7, mb: 5, lineHeight: 1.75 }}>
            Your appointment has been booked successfully. We look forward to seeing you.
          </Typography>

          {/* Summary card */}
          <Box
            sx={{
              p: 3.5,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              textAlign: "left",
              mb: 5,
            }}
          >
            <Typography variant="overline" sx={{ opacity: 0.6, letterSpacing: "0.24em" }}>
              Appointment Details
            </Typography>
            <Divider sx={{ my: 2, opacity: 0.2 }} />
            <Stack spacing={2}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ opacity: 0.7 }}>Service</Typography>
                <Typography sx={{ fontWeight: 700 }}>{service.name}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ opacity: 0.7 }}>Barber</Typography>
                <Typography sx={{ fontWeight: 700 }}>{barber.name}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ opacity: 0.7 }}>Date</Typography>
                <Typography sx={{ fontWeight: 700 }}>{formatted}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ opacity: 0.7 }}>Time</Typography>
                <Typography sx={{ fontWeight: 700 }}>{time}</Typography>
              </Box>
              <Divider sx={{ opacity: 0.2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography sx={{ fontWeight: 800, color: "#C7A86B", fontSize: "1.1rem" }}>
                  €{Number(service.price).toFixed(2)}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button variant="contained" component={RouterLink} to="/my-bookings" size="large">
              View My Bookings
            </Button>
            <Button variant="outlined" component={RouterLink} to="/" size="large">
              Back to Home
            </Button>
          </Stack>
        </MotionBox>
      </Container>
    </Box>
  );
}
