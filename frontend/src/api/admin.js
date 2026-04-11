import client from "./client";

// ── Barbers ──────────────────────────────────────────────
export const getAllBarbers    = ()       => client.get("/barbers/all");
export const createBarber     = (data)   => client.post("/barbers", data);
export const updateBarber     = (id, d)  => client.put(`/barbers/${id}`, d);
export const deactivateBarber = (id)     => client.delete(`/barbers/${id}`);

// ── Services ─────────────────────────────────────────────
export const getAllServices    = ()       => client.get("/services");
export const createService     = (data)   => client.post("/services", data);
export const updateService     = (id, d)  => client.put(`/services/${id}`, d);
export const deactivateService = (id)     => client.delete(`/services/${id}`);

// ── Appointments (admin view) ─────────────────────────────
export const getAllAppointments  = ()          => client.get("/appointments/all");
export const updateApptStatus   = (id, status) => client.put(`/appointments/${id}/status`, { status });
