// src/pages/AdminManageSlots.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box, Container, Typography, Alert, Button, Divider, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, CircularProgress, Snackbar,
  Select, MenuItem, FormControl, InputLabel,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";
import { BRAND } from "../brand/brand.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getAllBarbers, createBarber, updateBarber, deactivateBarber,
  getAllServices, createService, updateService, deactivateService,
  getAllAppointments, updateApptStatus,
} from "../api/admin.js";

const MotionBox = motion(Box);

// ── helpers ────────────────────────────────────────────────────────────────
const statusColor = (s) =>
  ({ pending: "warning", confirmed: "info", completed: "success", cancelled: "error" }[s] ?? "default");

const emptyBarber  = { name: "", specialty: "", experience_years: 0, bio: "", rating: 0, available: 1 };
const emptyService = { name: "", description: "", price: "", duration: "", active: 1 };

// ── component ──────────────────────────────────────────────────────────────
export default function AdminManageSlots() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab]         = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState({ open: false, msg: "", sev: "success" });

  // Data
  const [barbers,      setBarbers]      = useState([]);
  const [services,     setServices]     = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Dialog state
  const [barberDlg, setBarberDlg]   = useState({ open: false, data: null }); // null = new
  const [serviceDlg, setServiceDlg] = useState({ open: false, data: null });

  // ── auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user)                   { navigate("/login");     return; }
    if (user.role !== "admin")   { navigate("/dashboard"); return; }
  }, [user, navigate]);

  // ── fetch data ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || user.role !== "admin") return;
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [b, s, a] = await Promise.all([getAllBarbers(), getAllServices(), getAllAppointments()]);
      setBarbers(b.data.data      ?? []);
      setServices(s.data.data     ?? []);
      setAppointments(a.data.data ?? []);
    } catch (e) {
      showToast("Failed to load data. Is the backend running?", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, sev = "success") => setToast({ open: true, msg, sev });

  // ── barber CRUD ───────────────────────────────────────────────────────────
  const saveBarber = async (formData) => {
    try {
      if (formData.id) {
        await updateBarber(formData.id, formData);
        showToast("Barber updated.");
      } else {
        await createBarber(formData);
        showToast("Barber added.");
      }
      setBarberDlg({ open: false, data: null });
      fetchAll();
    } catch {
      showToast("Error saving barber.", "error");
    }
  };

  const removeBarber = async (id) => {
    try {
      await deactivateBarber(id);
      showToast("Barber deactivated.");
      fetchAll();
    } catch {
      showToast("Error deactivating barber.", "error");
    }
  };

  // ── service CRUD ──────────────────────────────────────────────────────────
  const saveService = async (formData) => {
    try {
      if (formData.id) {
        await updateService(formData.id, formData);
        showToast("Service updated.");
      } else {
        await createService(formData);
        showToast("Service added.");
      }
      setServiceDlg({ open: false, data: null });
      fetchAll();
    } catch {
      showToast("Error saving service.", "error");
    }
  };

  const removeService = async (id) => {
    try {
      await deactivateService(id);
      showToast("Service deactivated.");
      fetchAll();
    } catch {
      showToast("Error deactivating service.", "error");
    }
  };

  // ── appointment status ────────────────────────────────────────────────────
  const changeApptStatus = async (id, status) => {
    try {
      await updateApptStatus(id, status);
      showToast(`Appointment marked as ${status}.`);
      fetchAll();
    } catch {
      showToast("Error updating appointment.", "error");
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <Box sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="lg">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <AdminPanelSettingsIcon sx={{ color: "#C7A86B", fontSize: 36 }} />
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: "0.32em", opacity: 0.65 }}>
                {BRAND.name.toUpperCase()}
              </Typography>
              <Typography sx={{ fontFamily: "Playfair Display, serif", fontWeight: 700, fontSize: { xs: "1.8rem", md: "2.5rem" }, lineHeight: 1.1 }}>
                Admin Panel
              </Typography>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            Signed in as <strong>{user.name}</strong> (admin)
          </Alert>

          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
            <Tab label="Barbers" />
            <Tab label="Services" />
            <Tab label="Appointments" />
          </Tabs>
          <Divider sx={{ mb: 3, opacity: 0.2 }} />

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress sx={{ color: "#C7A86B" }} />
            </Box>
          )}

          {/* ── TAB 0: Barbers ── */}
          {!loading && tab === 0 && (
            <>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  sx={{ bgcolor: "#C7A86B", color: "#0B0B0C", "&:hover": { bgcolor: "#b5976a" } }}
                  onClick={() => setBarberDlg({ open: true, data: { ...emptyBarber } })}
                >
                  Add Barber
                </Button>
              </Box>
              <TableContainer component={Paper} sx={{ bgcolor: "background.paper" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {["Name","Specialty","Exp (yrs)","Rating","Status","Actions"].map(h => (
                        <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {barbers.map((b) => (
                      <TableRow key={b.id} hover>
                        <TableCell>{b.name}</TableCell>
                        <TableCell>{b.specialty}</TableCell>
                        <TableCell>{b.experience_years}</TableCell>
                        <TableCell>{b.rating}</TableCell>
                        <TableCell>
                          <Chip
                            label={b.available ? "Active" : "Inactive"}
                            color={b.available ? "success" : "default"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => setBarberDlg({ open: true, data: { ...b } })}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => removeBarber(b.id)} disabled={!b.available}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {barbers.length === 0 && (
                      <TableRow><TableCell colSpan={6} align="center" sx={{ opacity: 0.5, py: 4 }}>No barbers found</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {/* ── TAB 1: Services ── */}
          {!loading && tab === 1 && (
            <>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  sx={{ bgcolor: "#C7A86B", color: "#0B0B0C", "&:hover": { bgcolor: "#b5976a" } }}
                  onClick={() => setServiceDlg({ open: true, data: { ...emptyService } })}
                >
                  Add Service
                </Button>
              </Box>
              <TableContainer component={Paper} sx={{ bgcolor: "background.paper" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {["Name","Description","Price (€)","Duration (min)","Status","Actions"].map(h => (
                        <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {services.map((s) => (
                      <TableRow key={s.id} hover>
                        <TableCell>{s.name}</TableCell>
                        <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {s.description}
                        </TableCell>
                        <TableCell>€{Number(s.price).toFixed(2)}</TableCell>
                        <TableCell>{s.duration}</TableCell>
                        <TableCell>
                          <Chip
                            label={s.active ? "Active" : "Inactive"}
                            color={s.active ? "success" : "default"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => setServiceDlg({ open: true, data: { ...s } })}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => removeService(s.id)} disabled={!s.active}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {services.length === 0 && (
                      <TableRow><TableCell colSpan={6} align="center" sx={{ opacity: 0.5, py: 4 }}>No services found</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {/* ── TAB 2: Appointments ── */}
          {!loading && tab === 2 && (
            <TableContainer component={Paper} sx={{ bgcolor: "background.paper" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {["ID","Customer","Barber","Service","Date","Time","Status","Update"].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map((a) => (
                    <TableRow key={a.id} hover>
                      <TableCell>#{a.id}</TableCell>
                      <TableCell>{a.customer_name}<br /><Typography variant="caption" sx={{ opacity: 0.6 }}>@{a.username}</Typography></TableCell>
                      <TableCell>{a.barber_name}</TableCell>
                      <TableCell>{a.service_name}</TableCell>
                      <TableCell>{new Date(a.appointment_date).toLocaleDateString("en-IE")}</TableCell>
                      <TableCell>{a.appointment_time?.slice(0,5)}</TableCell>
                      <TableCell><Chip label={a.status} color={statusColor(a.status)} size="small" /></TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 130 }}>
                          <Select
                            value={a.status}
                            onChange={(e) => changeApptStatus(a.id, e.target.value)}
                          >
                            {["pending","confirmed","completed","cancelled"].map(s => (
                              <MenuItem key={s} value={s}>{s}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  ))}
                  {appointments.length === 0 && (
                    <TableRow><TableCell colSpan={8} align="center" sx={{ opacity: 0.5, py: 4 }}>No appointments found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ mt: 5 }}>
            <Button variant="outlined" component={RouterLink} to="/dashboard">Back to Dashboard</Button>
          </Box>
        </MotionBox>
      </Container>

      {/* ── Barber Dialog ── */}
      <BarberDialog
        open={barberDlg.open}
        initial={barberDlg.data}
        onClose={() => setBarberDlg({ open: false, data: null })}
        onSave={saveBarber}
      />

      {/* ── Service Dialog ── */}
      <ServiceDialog
        open={serviceDlg.open}
        initial={serviceDlg.data}
        onClose={() => setServiceDlg({ open: false, data: null })}
        onSave={saveService}
      />

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast(t => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.sev} onClose={() => setToast(t => ({ ...t, open: false }))}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// ── BarberDialog ───────────────────────────────────────────────────────────
function BarberDialog({ open, initial, onClose, onSave }) {
  const [form, setForm] = useState(initial ?? { ...emptyBarber });
  useEffect(() => { if (initial) setForm(initial); }, [initial]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{form.id ? "Edit Barber" : "Add Barber"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Name *"             value={form.name}             onChange={set("name")}             fullWidth />
          <TextField label="Specialty *"        value={form.specialty}        onChange={set("specialty")}        fullWidth />
          <TextField label="Experience (years)" value={form.experience_years} onChange={set("experience_years")} fullWidth type="number" />
          <TextField label="Bio"                value={form.bio ?? ""}        onChange={set("bio")}              fullWidth multiline rows={3} />
          <TextField label="Rating (0–5)"       value={form.rating}           onChange={set("rating")}           fullWidth type="number" inputProps={{ step: 0.1, min: 0, max: 5 }} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "#C7A86B", color: "#0B0B0C" }}
          startIcon={<CheckCircleIcon />}
          onClick={() => onSave(form)}
          disabled={!form.name || !form.specialty}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── ServiceDialog ──────────────────────────────────────────────────────────
function ServiceDialog({ open, initial, onClose, onSave }) {
  const [form, setForm] = useState(initial ?? { ...emptyService });
  useEffect(() => { if (initial) setForm(initial); }, [initial]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{form.id ? "Edit Service" : "Add Service"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Name *"              value={form.name}        onChange={set("name")}        fullWidth />
          <TextField label="Description"         value={form.description ?? ""} onChange={set("description")} fullWidth multiline rows={2} />
          <TextField label="Price (€) *"         value={form.price}       onChange={set("price")}       fullWidth type="number" inputProps={{ min: 0, step: 0.5 }} />
          <TextField label="Duration (min) *"    value={form.duration}    onChange={set("duration")}    fullWidth type="number" inputProps={{ min: 1 }} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "#C7A86B", color: "#0B0B0C" }}
          startIcon={<CheckCircleIcon />}
          onClick={() => onSave(form)}
          disabled={!form.name || !form.price || !form.duration}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
