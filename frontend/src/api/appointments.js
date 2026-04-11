// src/api/appointments.js
import client from "./client";

export const getMyAppointments = () => client.get("/appointments");
export const createAppointment = (data) => client.post("/appointments", data);
export const cancelAppointment = (id) => client.put(`/appointments/${id}/cancel`);
