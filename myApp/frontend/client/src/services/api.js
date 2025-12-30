import axios from "axios";

// Base URL par défaut
const DEFAULT_API_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: DEFAULT_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Détection auto du port backend via /up pour supporter les ports variables (8000..)
const candidatePorts = [8000, 8001, 8002, 8003, 8004, 9000];

async function tryPort(port) {
  const url = `http://localhost:${port}`;
  try {
    const res = await fetch(`${url}/up`, { method: "GET" });
    return res.ok ? url : null;
  } catch {
    return null;
  }
}

async function detectBackend() {
  const override = localStorage.getItem("API_URL");
  if (override) return override;

  for (const p of candidatePorts) {
    const found = await tryPort(p);
    if (found) return found;
  }
  return DEFAULT_API_URL;
}

const apiReady = detectBackend()
  .then((base) => {
    api.defaults.baseURL = base;
  })
  .catch(() => null);

api.interceptors.request.use(
  async (config) => {
    await apiReady;
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========== AUTH ==========
export const authService = {
  login: async (credentials) => {
    const response = await api.post("/api/login", credentials);
    if (response.data?.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    if (response.data?.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  loginCandidate: async (credentials) => {
    const response = await api.post("/api/login", credentials);
    if (response.data?.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    if (response.data?.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  registerSchool: async (data) => {
    return await api.post("/api/register-school", data);
  },
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  },
  getCurrentUser: () => JSON.parse(localStorage.getItem("user")),
};

// ========== ECOLES ==========
export const schoolService = {
  getAll: async (status = null) => {
    const query = status ? `?status=${status}` : "";
    return await api.get(`/api/admin/schools${query}`);
  },
  getPending: async () => {
    const response = await api.get("/api/admin/pending-schools");
    return response.data;
  },
  getActive: async () => {
    const response = await api.get("/api/admin/active-schools");
    return response.data;
  },
  getRejected: async () => {
    const response = await api.get("/api/admin/rejected-schools");
    return response.data;
  },
  updateStatus: async (id, status) => {
    return await api.put(`/api/admin/schools/${id}/status`, { status });
  },
  update: async (id, data) => {
    return await api.put(`/api/admin/schools/${id}`, data);
  },
  delete: async (id) => {
    return await api.delete(`/api/admin/schools/${id}`);
  },
  getSchoolStats: async () => api.get("/api/school/stats").then((res) => res.data),
};

// ========== CANDIDATS ==========
export const candidateService = {
  create: async (data) => {
    return await api.post("/api/school/register-students", data);
  },
  getBySchool: async () => {
    return await api.get(`/api/school/my-students`);
  },
  getAll: async () => {
    return await api.get("/api/candidats");
  },
  delete: async (id) => {
    return await api.delete(`/api/candidats/${id}`);
  },
  getTranscript: async (id) => {
    return await api.get(`/api/exam/transcript?candidate_id=${id}`);
  },
};

// ========== COMMUN ==========
export const commonService = {
  getSeries: async () => {
    return await api.get("/api/series");
  },
};

// ========== NOTES ==========
export const gradeService = {
  getByCandidate: async (candidateId) => {
    return await api.get(`/api/grades?candidate_id=${candidateId}`);
  },
  save: async (data) => {
    return await api.post("/api/grades", data);
  },
};

// ========== ADMIN: SESSIONS ==========
export const adminService = {
  getStats: async () => {
    const response = await api.get("/api/admin/dashboard_stats");
    return response.data;
  },
  getSessions: async () => {
    const response = await api.get("/api/admin/sessions");
    return response.data?.data ?? response.data;
  },
  getClassGroups: async () => {
    const response = await api.get("/api/admin/class-groups");
    return response.data;
  },
  getSessionStudents: async (sessionId) => {
    const response = await api.get(`/api/admin/sessions/${sessionId}/students`);
    return response.data?.data?.students ?? response.data?.students ?? response.data;
  },
  getExamSubjects: async (examType = "BAC") => {
    const response = await api.get(`/api/admin/exam-subjects?exam_type=${examType}`);
    return response.data?.data ?? response.data;
  },
  createSession: async (data) => {
    const response = await api.post("/api/admin/session", data);
    return response.data;
  },
  updateSession: async (id, data) => {
    const response = await api.put(`/api/admin/session/${id}`, data);
    return response.data;
  },
  saveStudentGrades: async (payload) => {
    const response = await api.post("/api/admin/deliberations/save-grades", payload);
    return response.data;
  },
  getStudentTranscriptDetails: async (studentId, sessionId) => {
    const response = await api.get(`/api/admin/student/${studentId}/transcript-details/${sessionId}`);
    return response.data;
  },
  getStudentConvocationDetails: async (studentId, sessionId) => {
    const response = await api.get(`/api/admin/student/${studentId}/convocation-details/${sessionId}`);
    return response.data;
  },
  downloadConvocation: async (studentId, sessionId) => {
    const response = await api.get(`/api/admin/student/${studentId}/convocation/${sessionId}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },
  downloadTranscript: async (studentId, sessionId) => {
    const response = await api.get(`/api/admin/student/${studentId}/transcript/${sessionId}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },
};

// ========== ADMIN: DELIBERATIONS ==========
export const deliberationService = {
  calculate: async (sessionId) => {
    const response = await api.post(`/api/admin/exam-sessions/${sessionId}/calculate-deliberations`);
    return response.data;
  },
  validate: async (sessionId) => {
    const response = await api.post(`/api/admin/exam-sessions/${sessionId}/validate-deliberations`);
    return response.data;
  },
  getDeliberations: async (sessionId) => {
    const response = await api.get(`/api/admin/exam-sessions/${sessionId}/deliberations`);
    return response.data;
  },
};

// ========== STUDENT: RESULTS & CONVOCATIONS ==========
export const studentService = {
  getMyResults: async () => {
    const response = await api.get("/api/student/my-results");
    return response.data;
  },
  getMyConvocation: async (sessionId) => {
    const response = await api.get(`/api/student/convocation/${sessionId}`);
    return response.data;
  },
  downloadConvocation: async (sessionId) => {
    const response = await api.get(`/api/student/convocation/${sessionId}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },
  downloadTranscript: async (sessionId) => {
    const response = await api.get(`/api/student/transcript/${sessionId}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },
  getTranscriptDetails: async (sessionId) => {
    const response = await api.get(`/api/student/transcript-details/${sessionId}`);
    return response.data;
  },
};

export default api;