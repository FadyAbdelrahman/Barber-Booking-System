// src/pages/Register.jsx
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Link,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import Logo from "../components/Logo.jsx";
import { BRAND } from "../brand/brand.js";
import { register } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";

const MotionBox = motion(Box);

export default function Register() {
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.username.trim() || form.username.trim().length < 3)
      e.username = "Username must be at least 3 characters";
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email address is required";
    if (!form.password || form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await register({
        username: form.username,
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
      });
      loginSuccess(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="sm">
        <MotionBox
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          {/* Logo + heading */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
            <Logo size={48} />
            <Typography
              sx={{
                mt: 2,
                fontFamily: "Playfair Display, serif",
                fontWeight: 800,
                fontSize: "1.85rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {BRAND.name}
            </Typography>
            <Typography sx={{ opacity: 0.6, mt: 0.5, fontSize: "0.9rem" }}>
              Create your account to start booking
            </Typography>
          </Box>

          {/* Form card */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              p: { xs: 3, sm: 4 },
            }}
          >
            <Typography
              variant="overline"
              sx={{ letterSpacing: "0.28em", opacity: 0.6, display: "block", mb: 2.5 }}
            >
              New account
            </Typography>

            {serverError && (
              <Alert severity="error" sx={{ mb: 2.5 }}>
                {serverError}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                  autoComplete="name"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  error={Boolean(errors.username)}
                  helperText={errors.username}
                  autoComplete="username"
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  autoComplete="email"
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Phone (optional)"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  autoComplete="new-password"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword}
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              size="large"
              sx={{ py: 1.4, mt: 3 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Create Account"}
            </Button>

            <Divider sx={{ my: 3, opacity: 0.4 }} />

            <Typography sx={{ textAlign: "center", fontSize: "0.9rem", opacity: 0.75 }}>
              Already have an account?{" "}
              <Link component={RouterLink} to="/login" underline="hover" sx={{ color: "#C7A86B" }}>
                Sign in here
              </Link>
            </Typography>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
}
