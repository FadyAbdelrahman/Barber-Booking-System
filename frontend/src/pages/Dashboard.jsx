// src/pages/Dashboard.jsx
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Button,
  Divider,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { motion } from "framer-motion";
import { BRAND } from "../brand/brand.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect } from "react";

const MotionBox = motion(Box);

const quickLinks = [
  {
    icon: <ContentCutIcon sx={{ fontSize: 32, color: "#C7A86B" }} />,
    title: "Browse Services",
    desc: "See all available cuts and grooming services.",
    to: "/services",
  },
  {
    icon: <CalendarMonthIcon sx={{ fontSize: 32, color: "#C7A86B" }} />,
    title: "Book Appointment",
    desc: "Select a service, barber, date and time.",
    to: "/book",
  },
  {
    icon: <ListAltIcon sx={{ fontSize: 32, color: "#C7A86B" }} />,
    title: "My Bookings",
    desc: "View and manage your upcoming appointments.",
    to: "/my-bookings",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <Box sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="lg">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          {/* Welcome */}
          <Typography variant="overline" sx={{ letterSpacing: "0.32em", opacity: 0.65 }}>
            {BRAND.name.toUpperCase()}
          </Typography>
          <Typography
            sx={{
              mt: 1.5,
              fontFamily: "Playfair Display, serif",
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.8rem" },
              lineHeight: 1.1,
            }}
          >
            {greeting},{" "}
            <Box component="span" sx={{ color: "#C7A86B" }}>
              {user.name || user.username}
            </Box>
          </Typography>
          <Typography sx={{ mt: 1.5, opacity: 0.7, lineHeight: 1.8 }}>
            Welcome to your Sharp Society dashboard. Book a new appointment or manage your existing ones.
          </Typography>

          <Divider sx={{ my: 5, opacity: 0.18 }} />

          {/* Quick links */}
          <Typography
            variant="overline"
            sx={{ letterSpacing: "0.28em", opacity: 0.6, display: "block", mb: 3 }}
          >
            Quick Actions
          </Typography>
          <Grid container spacing={3}>
            {quickLinks.map((item, idx) => (
              <Grid item xs={12} sm={4} key={item.title}>
                <MotionBox
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      transition: "border-color 200ms ease, box-shadow 200ms ease",
                      "&:hover": {
                        borderColor: "rgba(199,168,107,0.45)",
                        boxShadow: "0 8px 28px rgba(199,168,107,0.10)",
                      },
                    }}
                  >
                    <CardActionArea
                      component={RouterLink}
                      to={item.to}
                      sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}
                    >
                      <CardContent>
                        <Box sx={{ mb: 2 }}>{item.icon}</Box>
                        <Typography
                          sx={{
                            fontFamily: "Playfair Display, serif",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            mb: 1,
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography sx={{ opacity: 0.7, fontSize: "0.9rem", lineHeight: 1.7 }}>
                          {item.desc}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </MotionBox>
              </Grid>
            ))}
          </Grid>

          {/* Admin shortcut */}
          {user.role === "admin" && (
            <Box sx={{ mt: 5, p: 3, bgcolor: "background.paper", border: "1px solid", borderColor: "rgba(199,168,107,0.3)", borderRadius: 3 }}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Admin Panel</Typography>
              <Typography sx={{ opacity: 0.7, mb: 2, fontSize: "0.9rem" }}>
                Manage available time slots and appointments.
              </Typography>
              <Button variant="outlined" component={RouterLink} to="/admin/manage-slots">
                Open Admin Panel
              </Button>
            </Box>
          )}
        </MotionBox>
      </Container>
    </Box>
  );
}
