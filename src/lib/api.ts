/**
 * api.ts — Centralized API client for MedAssist AI Backend
 * Base URL: http://localhost:5000/api
 */

const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");

// ─── Token Management ──────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem("medassist_token");
export const getUser  = () => {
  const u = localStorage.getItem("medassist_user");
  return u ? JSON.parse(u) : null;
};
export const setAuth  = (token: string, user: object) => {
  localStorage.setItem("medassist_token", token);
  localStorage.setItem("medassist_user", JSON.stringify(user));
};
export const clearAuth = () => {
  localStorage.removeItem("medassist_token");
  localStorage.removeItem("medassist_user");
};

// ─── HTTP helpers ──────────────────────────────────────────────────────────────
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `HTTP ${res.status}: Request failed`);
  }
  return data;
}

async function upload<T>(endpoint: string, formData: FormData): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data;
}

// ─── Auth API ──────────────────────────────────────────────────────────────────
export const authApi = {
  register: (body: {
    name: string; email: string; password: string;
    role?: string; clinicId?: string; phone?: string;
  }) => request<ApiResponse>("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string; role?: string }) =>
    request<ApiResponse>("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  me: () => request<ApiResponse>("/auth/me"),
};

// ─── Clinic API ────────────────────────────────────────────────────────────────
export const clinicApi = {
  register: (body: object) =>
    request<ApiResponse>("/clinic/register", { method: "POST", body: JSON.stringify(body) }),
  get: (id: string) => request<ApiResponse>(`/clinic/${id}`),
  getAll: () => request<ApiResponse>("/clinic"),
};

// ─── Staff API ─────────────────────────────────────────────────────────────────
export const staffApi = {
  add:    (body: object) => request<ApiResponse>("/staff/add", { method: "POST", body: JSON.stringify(body) }),
  list:   (params?: Record<string, string>) => request<ApiResponse>(`/staff/list${params ? "?" + new URLSearchParams(params) : ""}`),
  get:    (id: string) => request<ApiResponse>(`/staff/${id}`),
  update: (id: string, body: object) => request<ApiResponse>(`/staff/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id: string) => request<ApiResponse>(`/staff/${id}`, { method: "DELETE" }),
};

// ─── Patient API ───────────────────────────────────────────────────────────────
export const patientApi = {
  register: (body: object) =>
    request<ApiResponse>("/patient/register", { method: "POST", body: JSON.stringify(body) }),
  list:  (params?: Record<string, string>) =>
    request<ApiResponse>(`/patient/list${params ? "?" + new URLSearchParams(params) : ""}`),
  queue: () => request<ApiResponse>("/patient/queue"),
  get:   (id: string) => request<ApiResponse>(`/patient/${id}`),
  update:(id: string, body: object) =>
    request<ApiResponse>(`/patient/${id}`, { method: "PUT", body: JSON.stringify(body) }),
};

// ─── Speech API ────────────────────────────────────────────────────────────────
export const speechApi = {
  transcribe: (audioFile?: File, mockTranscript?: string) => {
    const form = new FormData();
    if (audioFile) form.append("audio", audioFile);
    if (mockTranscript) form.append("mockTranscript", mockTranscript);
    return upload<ApiResponse>("/speech", form);
  },
};

// ─── Agent API ─────────────────────────────────────────────────────────────────
export const agentApi = {
  process: (text: string) =>
    request<ApiResponse>("/agent/process", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
};

// ─── Prescription API ──────────────────────────────────────────────────────────
export const prescriptionApi = {
  create: (body: object) =>
    request<ApiResponse>("/prescription/create", { method: "POST", body: JSON.stringify(body) }),
  getByPatient: (patientId: string) =>
    request<ApiResponse>(`/prescription/${patientId}`),
  getAll: (params?: Record<string, string>) =>
    request<ApiResponse>(`/prescription/clinic/all${params ? "?" + new URLSearchParams(params) : ""}`),
  get: (id: string) => request<ApiResponse>(`/prescription/single/${id}`),
};

// ─── Reminder API ──────────────────────────────────────────────────────────────
export const reminderApi = {
  create: (body: object) =>
    request<ApiResponse>("/reminder/create", { method: "POST", body: JSON.stringify(body) }),
  getByPatient: (patientId: string) =>
    request<ApiResponse>(`/reminder/${patientId}`),
  markTaken: (id: string, scheduleIndex: number) =>
    request<ApiResponse>(`/reminder/${id}/taken`, {
      method: "PUT",
      body: JSON.stringify({ scheduleIndex }),
    }),
};

// ─── AI Chat API ───────────────────────────────────────────────────────────────
export const aiApi = {
  chat: (message: string, role?: string) =>
    request<ApiResponse>("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message, role }),
    }),
};

// ─── Dashboard API ─────────────────────────────────────────────────────────────
export const dashboardApi = {
  admin:     () => request<ApiResponse>("/dashboard/admin"),
  doctor:    () => request<ApiResponse>("/dashboard/doctor"),
  reception: () => request<ApiResponse>("/dashboard/reception"),
};

// ─── Health Check ──────────────────────────────────────────────────────────────
export const healthCheck = () => request<ApiResponse>("/health");

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: unknown;
  count?: number;
  total?: number;
  error?: string;
}
