<<<<<<< HEAD:myApp/frontend/client/src/services/api.js
import axios from 'axios';

// Using PHP built-in server is more reliable for simple setups than configuring XAMPP apache aliases manually
const API_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Dynamically detect the backend port so the app works even if Laravel chooses a different one
const candidatePorts = [8000, 8001, 8002, 8003, 8004, 9000];

async function tryPort(port) {
    const url = `http://localhost:${port}`;
    try {
        const res = await fetch(`${url}/up`, { method: 'GET' });
        return res.ok ? url : null;
    } catch {
        return null;
    }
}

async function detectBackend() {
    const override = localStorage.getItem('API_URL');
    if (override) return override;
    for (const p of candidatePorts) {
        const found = await tryPort(p);
        if (found) return found;
    }
    return API_URL;
}

const apiReady = detectBackend()
    .then((base) => {
        api.defaults.baseURL = base;
    })
    .catch(() => null);

api.interceptors.request.use(async (config) => {
    await apiReady;
    return config;
});

// Interceptor to attach token if we were using JWT (prepared for future)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export const authService = {
    login: async (credentials) => {
        // credentials: { username/email, password }
        const response = await api.post('/auth/login', credentials);
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    loginCandidate: async (credentials) => {
        // credentials: { matricule, password }
        const response = await api.post('/auth/login-candidate', credentials);
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    registerSchool: async (data) => {
        // data: { username, password, school_name, email }
        return await api.post('/auth/register', data);
    },
    logout: () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    },
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    }
};

export const schoolService = {
    getAll: async (status = null) => {
        const query = status ? `?status=${status}` : '';
        return await api.get(`/schools${query}`);
    },
    updateStatus: async (id, status) => {
        return await api.put(`/schools/${id}`, { status });
    },
    update: async (id, data) => {
        return await api.put(`/schools/${id}`, data);
    },
    delete: async (id) => {
        return await api.delete(`/schools/${id}`);
    }
};

export const candidateService = {
    create: async (data) => {
        return await api.post('/candidats', data);
    },
    getBySchool: async (schoolId) => {
        return await api.get(`/candidats?school_id=${schoolId}`);
    },
    getAll: async () => {
        return await api.get('/candidats');
    },
    delete: async (id) => {
        return await api.delete(`/candidats/${id}`);
    },
    getTranscript: async (id) => {
        return await api.get(`/exam/transcript?candidate_id=${id}`);
    }
};

export const commonService = {
    getSeries: async () => {
        return await api.get('/series');
    }
};

export const gradeService = {
    getByCandidate: async (candidateId) => {
        return await api.get(`/grades?candidate_id=${candidateId}`);
    },
    save: async (data) => {
        // data: { candidate_id, grades: [{subject_id, score}, ...] }
        return await api.post('/grades', data);
    }
};

export const adminService = {
    getStats: async () => {
        const response = await api.get('/admin/dashboard_stats');
        return response.data;
    },
    getSessions: async () => {
        const response = await api.get('/api/admin/sessions');
        // Backend now returns { data: [...], meta: {...} }
        return response.data?.data ?? response.data;
    },
    createSession: async (data) => {
        const response = await api.post('/api/admin/session', data);
        return response.data;
    },
    updateSession: async (id, data) => {
        const response = await api.put(`/api/admin/session/${id}`, data);
        return response.data;
    }
=======
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

export const authService = {
  login: async (credentials) => {
    // credentials: { username/email, password }
    const response = await api.post("/login", credentials);
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  loginCandidate: async (credentials) => {
    // credentials: { matricule, password }
    const response = await api.post("/login", credentials);
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  registerSchool: async (data) => {
    // data: { username, password, school_name, email }
    return await api.post("/register-school", data);
  },
  logout: () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  },
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  },
};

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
};

export const candidateService = {
  create: async (data) => {
    return await api.post("/school/register-students", data);
  },
  getBySchool: async () => {
    return await api.get(`/my-students`);
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

export const commonService = {
  getSeries: async () => {
    return await api.get("/series");
  },
};

export const gradeService = {
  getByCandidate: async (candidateId) => {
    return await api.get(`/grades?candidate_id=${candidateId}`);
  },
  save: async (data) => {
    // data: { candidate_id, grades: [{subject_id, score}, ...] }
    return await api.post("/grades", data);
  },
};

export const adminService = {
  getStats: async () => {
    const response = await api.get("/admin/dashboard_stats");
    return response.data;
  },
  getSessions: async () => {
    return await api.get("/admin/sessions");
  },
  createSession: async (data) => {
    return await api.post("/admin/session", data);
  },
  updateSession: async (id, data) => {
    return await api.put("/admin/session", { id, ...data });
  },
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/services/api.js
};

export default api;
