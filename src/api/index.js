// src/api/index.js
// Central API helper — all backend calls go through here

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("ak_token");
}

async function req(method, path, body, isFormData = false) {
  const headers = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

/* ── Auth ── */
export const apiLogin    = (u, p)    => req("POST", "/auth/login",  { username: u, password: p });
export const apiVerify   = ()        => req("GET",  "/auth/verify");

/* ── Profile ── */
export const apiGetProfile    = ()      => req("GET",   "/profile");
export const apiUpdateProfile = (data)  => req("PATCH", "/profile", data);

/* ── Logo upload ── */
export const apiUploadLogo = (file) => {
  const fd = new FormData();
  fd.append("logo", file);
  return req("POST", "/upload/logo", fd, true);
};

/* ── Skills ── */
export const apiGetSkills    = ()          => req("GET",    "/skills");
export const apiAddSkill     = (data)      => req("POST",   "/skills",      data);
export const apiUpdateSkill  = (id, data)  => req("PATCH",  `/skills/${id}`, data);
export const apiDeleteSkill  = (id)        => req("DELETE", `/skills/${id}`);

/* ── Projects ── */
export const apiGetProjects   = ()         => req("GET",    "/projects");
export const apiAddProject    = (data)     => req("POST",   "/projects",       data);
export const apiUpdateProject = (id, data) => req("PATCH",  `/projects/${id}`, data);
export const apiDeleteProject = (id)       => req("DELETE", `/projects/${id}`);

/* ── Education ── */
export const apiGetEducation    = ()          => req("GET",    "/education");
export const apiAddEducation    = (data)      => req("POST",   "/education",       data);
export const apiUpdateEducation = (id, data)  => req("PATCH",  `/education/${id}`, data);
export const apiDeleteEducation = (id)        => req("DELETE", `/education/${id}`);

/* ── Experience ── */
export const apiGetExperience    = ()          => req("GET",    "/experience");
export const apiAddExperience    = (data)      => req("POST",   "/experience",       data);
export const apiUpdateExperience = (id, data)  => req("PATCH",  `/experience/${id}`, data);
export const apiDeleteExperience = (id)        => req("DELETE", `/experience/${id}`);

/* ── Messages ── */
export const apiGetMessages    = ()          => req("GET",    "/messages");
export const apiMarkRead       = (id)        => req("PATCH",  `/messages/${id}`, { read: true });
export const apiDeleteMessage  = (id)        => req("DELETE", `/messages/${id}`);

/* ── Public contact form ── */
export const apiSendMessage = (data) => req("POST", "/messages", data);