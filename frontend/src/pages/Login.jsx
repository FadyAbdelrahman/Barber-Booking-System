// src/pages/Login.jsx
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
} from "@mui/material";
import { motion } from "framer-motion";
import Logo from "../components/Logo.jsx";
import { BRAND } from "../brand/brand.js";
import { login } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";

const MotionBox = motion(Box);

export default function Login() {
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required";
    if (!form.password) e.password = "Password is required";
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
      const res = await login(form);
      loginSuccess(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed. Please try again.");
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
      <Container maxWidth="xs">
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
              Sign in to manage your bookings
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
              Welcome back
            </Typography>

            {serverError && (
              <Alert severity="error" sx={{ mb: 2.5 }}>
                {serverError}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              error={Boolean(errors.username)}
              helperText={errors.username}
              autoComplete="username"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              autoComplete="current-password"
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              size="large"
              sx={{ py: 1.4 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Sign In"}
            </Button>

            <Divider sx={{ my: 3, opacity: 0.4 }} />

            <Typography sx={{ textAlign: "center", fontSize: "0.9rem", opacity: 0.75 }}>
              Don&apos;t have an account?{" "}
              <Link component={RouterLink} to="/register" underline="hover" sx={{ color: "#C7A86B" }}>
                Register here
              </Link>
            </Typography>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
}
