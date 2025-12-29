import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// --- PAGES PUBLIQUES ---
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterEcole from './pages/Ecole/Register';
import PrintLayout from './pages/PrintLayout';
import NotFound from './pages/NotFound';

// --- PAGES PRIVÉES (Admin) ---
import AdminDashboard from './pages/Admin/Dashboard';
import Sessions from './pages/Admin/Sessions';
import ValidationEcoles from './pages/Admin/ValidationEcoles';
import Deliberation from './pages/Admin/Deliberation';

// --- PAGES PRIVÉES (Ecole) ---
import EcoleDashboard from './pages/Ecole/Dashboard';
import InscriptionCandidats from './pages/Ecole/Inscription';
import MesCandidats from './pages/Ecole/MesCandidats';

// --- PAGES PRIVÉES (Etudiant) ---
import CandidatDashboard from './pages/Candidat/Dashboard';
import Resultats from './pages/Etudiant/Resultats';
import MaConvocation from './pages/Etudiant/MaConvocation';

import { authService } from './services/api';

function App() {
  const computeUser = () => {
    const storedUser = authService.getCurrentUser();
    return storedUser ? { loggedIn: true, ...storedUser } : { loggedIn: false };
  };

  const [user, setUser] = useState(computeUser);

  useEffect(() => {
    const syncUser = () => setUser(computeUser());

    window.addEventListener('storage', syncUser);
    window.addEventListener('auth-changed', syncUser);

    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('auth-changed', syncUser);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* ROUTES PUBLIQUES (Accessibles sans connexion)*/}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-ecole" element={<RegisterEcole />} />

        {/* Routes d'Impression */}
        <Route path="/print/transcript/:id" element={<PrintLayout type="transcript" />} />
        <Route path="/print/convocation/:id" element={<PrintLayout type="convocation" />} />

        {/* ==========================================================
            ROUTES PRIVÉES (Nécessitent d'être connecté)
        =========================================================== */}
        {user.loggedIn ? (
          /* Le Layout contient la Sidebar et reçoit le rôle pour filtrer le menu */
          <Route element={<Layout userRole={user.role} />}>

            {/* --- Espace ADMINISTRATEUR MINISTÉRIEL --- */}
            {user.role === 'admin' && (
              <>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/sessions" element={<Sessions />} />
                <Route path="/admin/deliberations" element={<Deliberation />} />
                <Route path="/admin/validation" element={<ValidationEcoles />} />
              </>
            )}

            {/* --- Espace ÉTABLISSEMENT / ÉCOLE --- */}
            {user.role === 'school' && (
              <>
                <Route path="/ecole/dashboard" element={<EcoleDashboard />} />
                <Route path="/ecole/inscription" element={<InscriptionCandidats />} />
                <Route path="/ecole/candidats" element={<MesCandidats />} />
              </>
            )}

            {/* --- Espace ÉTUDIANT / CANDIDAT --- */}
            {(user.role === 'etudiant' || user.role === 'student') && (
              <>
                <Route path="/candidat/dashboard" element={<CandidatDashboard />} />
                <Route path="/etudiant/resultats" element={<Resultats />} />
                <Route path="/etudiant/convocation/:sessionId" element={<MaConvocation />} />
              </>
            )}

            {/* Redirection intelligente */}
            <Route path="/dashboard" element={<Navigate to={
              user.role === 'school' ? '/ecole/dashboard' :
                user.role === 'admin' ? '/admin/dashboard' :
                  '/candidat/dashboard'
            } />} />
          </Route>
        ) : (
          /* --- PROTECTION : Redirige vers Login si on tente d'entrer sans compte --- */
          <>
            <Route path="/admin/*" element={<Navigate to="/login" />} />
            <Route path="/ecole/*" element={<Navigate to="/login" />} />
            <Route path="/candidat/*" element={<Navigate to="/login" />} />
          </>
        )}

        {/* --- PAGE 404 --- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;