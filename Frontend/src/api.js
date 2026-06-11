const BASE = "http://localhost:5000/api";

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const api = {
  get: (path) => fetch(`${BASE}${path}`, { headers: headers() }).then((r) => r.json()),
  post: (path, body) => fetch(`${BASE}${path}`, { method: "POST", headers: headers(), body: JSON.stringify(body) }).then((r) => r.json()),
  put: (path, body) => fetch(`${BASE}${path}`, { method: "PUT", headers: headers(), body: JSON.stringify(body) }).then((r) => r.json()),
  del: (path) => fetch(`${BASE}${path}`, { method: "DELETE", headers: headers() }).then((r) => r.json()),
};
