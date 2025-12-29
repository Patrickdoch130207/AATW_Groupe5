import axios from "axios";

// Using PHP built-in server is more reliable for simple setups than configuring XAMPP apache aliases manually
const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Ajoute le credential de session à l'en-tête de chaque requête
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
    const response = await api.post('/login', credentials);
    // Compat: stocke access_token si fourni par le backend
    if (response.data?.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    if (response.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  loginCandidate: async (credentials) => {
    const response = await api.post('/login', credentials);
    if (response.data?.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    if (response.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  registerSchool: async (data) => {
    return await api.post('/register-school', data);
  },
  logout: () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  getCurrentUser: () => JSON.parse(localStorage.getItem('user')),
};

// ========== ECOLES ==========
export const schoolService = {
  getActive: async () => {
    return await api.get('/admin/schools/active')
  },
  updateStatus: async (id, status) => {
    return await api.put(`/admin/validate-school/${id}/validate`, { status });
  },
  update: async (id, data) => {
    return await api.put(`/schools/${id}`, data);
  },
  delete: async (id) => {
    return await api.delete(`/schools/${id}`);
  },

  getPending: async () => {
    const response = await api.get("/admin/pending");
    return response.data;
  },

  getSchoolStats: async () => api.get('/school/stats').then(res => res.data),
    
};

// ========== CANDIDATS ==========
export const candidateService = {
  create: async (data) => {
    return await api.post("/school/register-students", data);
  },
  getBySchool: async () => {
    return await api.get(`/school/my-students`);
  },
  getAll: async () => {
    return await api.get("/candidats");
  },
  delete: async (id) => {
    return await api.delete(`/candidats/${id}`);
  },
  getTranscript: async (id) => {
    return await api.get(`/exam/transcript?candidate_id=${id}`);
  },
};

// ========== COMMUN ==========
export const commonService = {
  getSeries: async () => {
    return await api.get('/series');
  },
};

// ========== NOTES ==========
export const gradeService = {
  getByCandidate: async (candidateId) => {
    return await api.get(`/grades?candidate_id=${candidateId}`);
  },
  save: async (data) => {
    // data: { candidate_id, grades: [{subject_id, score}, ...] }
    return await api.post('/grades', data);
  },
};

// ========== ADMIN: SESSIONS ==========
export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  getSessions: async () => {
    const response = await api.get('/admin/sessions');
    // Backend peut renvoyer { data: [...], meta: {...} } → on retourne la liste
    return response.data?.data ?? response.data;
  },
  getClassGroups: async () => {
    const response = await api.get('/admin/class-groups');
    return response.data;
  },
  getSessionStudents: async (sessionId) => {
    const response = await api.get(`/admin/sessions/${sessionId}/students`);
    return response.data?.data?.students ?? response.data?.students ?? response.data;
  },
  getExamSubjects: async (examType = 'BAC') => {
    const response = await api.get(`/admin/exam-subjects?exam_type=${examType}`);
    return response.data?.data ?? response.data;
  },
  createSession: async (data) => {
    const response = await api.post('/admin/session', data);
    return response.data;
  },
  updateSession: async (id, data) => {
    const response = await api.put(`/admin/session/${id}`, data);
    return response.data;
  },
  saveStudentGrades: async (payload) => {
    const response = await api.post('/admin/deliberations/save-grades', payload);
    return response.data;
  },
};

// ========== ADMIN: DELIBERATIONS ==========
export const deliberationService = {
  calculate: async (sessionId) => {
    const response = await api.post(`/admin/exam-sessions/${sessionId}/calculate-deliberations`);
    return response.data;
  },
  validate: async (sessionId) => {
    const response = await api.post(`/admin/exam-sessions/${sessionId}/validate-deliberations`);
    return response.data;
  },
  getDeliberations: async (sessionId) => {
    const response = await api.get(`/admin/exam-sessions/${sessionId}/deliberations`);
    return response.data;
  },
};

// ========== STUDENT: RESULTS & CONVOCATIONS ==========
export const studentService = {
  getMyResults: async () => {
    const response = await api.get('/student/my-results');
    return response.data;
  },
  getMyConvocation: async (sessionId) => {
    const response = await api.get(`/student/convocation/${sessionId}`);
    return response.data;
  },
  downloadConvocation: async (sessionId) => {
    const response = await api.get(`/student/convocation/${sessionId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
  downloadTranscript: async (sessionId) => {
    const response = await api.get(`/student/transcript/${sessionId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api;