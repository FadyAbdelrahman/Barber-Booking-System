// src/api/barbers.js
import client from "./client";

export const getBarbers = () => client.get("/barbers");
