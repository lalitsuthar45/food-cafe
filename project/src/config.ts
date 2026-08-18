const host =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "127.0.0.1"
    : window.location.hostname;

export const API_URL = `http://${host}:8000`;