<<<<<<< HEAD:myApp/frontend/client/src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

import { authService } from '../services/api';
import { Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); // Serves as identifier (username or email)
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState('pro'); // 'pro' or 'candidat'

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
=======
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";

import { authService } from "../services/api";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // Serves as identifier (username or email)
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState("pro"); // 'pro' or 'candidat'

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Login.jsx
    setLoading(true);

    try {
      let response;
<<<<<<< HEAD:myApp/frontend/client/src/pages/Login.jsx
      if (mode === 'pro') {
        response = await authService.login({ username: email, email: email, password });
      } else {
        response = await authService.loginCandidate({ matricule: email, password });
      }

      if (response.success) {
        const user = response.user;
        localStorage.setItem('user', JSON.stringify(user));

        if (user.role === 'admin') window.location.href = '/admin/dashboard';
        else if (user.role === 'school') window.location.href = '/ecole/dashboard';
        else window.location.href = '/candidat/dashboard';
=======

      const credentials = { email, password };

      if (mode === "pro") {
        response = await authService.login(credentials);
      } else {
        response = await authService.loginCandidate(credentials);
      }

      if (response.access_token) {
        const user = response.user;
        // Stockage du token pour les futures requêtes
        localStorage.setItem("token", response.access_token);
        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "admin") window.location.href = "/admin/dashboard";
        else if (user.role === "school")
          window.location.href = "/ecole/dashboard";
        else window.location.href = "/candidat/dashboard";
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Login.jsx
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
<<<<<<< HEAD:myApp/frontend/client/src/pages/Login.jsx
      <button onClick={() => navigate('/')} className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-[#1579de] font-semibold transition-colors">
=======
      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-[#1579de] font-semibold transition-colors"
      >
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Login.jsx
        <ArrowLeft className="w-5 h-5" /> Retour
      </button>

      <div className="w-full max-w-[450px]">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#1579de] rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 mx-auto mb-4">
            <GraduationCap className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
            Exam<span className="text-[#1579de]">Flow</span>
          </h1>
<<<<<<< HEAD:myApp/frontend/client/src/pages/Login.jsx
          <p className="text-gray-500 mt-2 font-medium">Connectez-vous à votre espace</p>
=======
          <p className="text-gray-500 mt-2 font-medium">
            Connectez-vous à votre espace
          </p>
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Login.jsx
        </div>

        <div className="bg-white p-10 rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-50">
          {/* Tabs */}
          <div className="flex bg-slate-50 p-1 rounded-xl mb-8">
            <button
<<<<<<< HEAD:myApp/frontend/client/src/pages/Login.jsx
              onClick={() => setMode('pro')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'pro' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
=======
              onClick={() => setMode("pro")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === "pro"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Login.jsx
            >
              Personnel
            </button>
            <button
<<<<<<< HEAD:myApp/frontend/client/src/pages/Login.jsx
              onClick={() => setMode('candidat')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'candidat' ? 'bg-white text-[#1579de] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
=======
              onClick={() => setMode("candidat")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === "candidat"
                  ? "bg-white text-[#1579de] shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Login.jsx
            >
              Candidat
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
<<<<<<< HEAD:myApp/frontend/client/src/pages/Login.jsx
                {mode === 'pro' ? 'Email professionnel' : 'Numéro Matricule'}
=======
                {mode === "pro" ? "Email professionnel" : "Numéro Matricule"}
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Login.jsx
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
<<<<<<< HEAD:myApp/frontend/client/src/pages/Login.jsx
                  type={mode === 'pro' ? "email" : "text"}
                  required
                  placeholder={mode === 'pro' ? "nom@ecole.com" : "Ex: 2025ABCDE"}
=======
                  type={mode === "pro" ? "email" : "text"}
                  required
                  placeholder={
                    mode === "pro" ? "nom@ecole.com" : "Ex: 2025ABCDE"
                  }
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Login.jsx
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1579de] transition-all outline-none font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
<<<<<<< HEAD:myApp/frontend/client/src/pages/Login.jsx
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Mot de passe</label>
=======
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Mot de passe
              </label>
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Login.jsx
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1579de] transition-all outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
<<<<<<< HEAD:myApp/frontend/client/src/pages/Login.jsx
              {mode === 'pro' && (
                <div className="text-right mt-2">
                  <a href="#" className="text-xs font-bold text-[#1579de] hover:underline">Mot de passe oublié ?</a>
=======
              {mode === "pro" && (
                <div className="text-right mt-2">
                  <a
                    href="#"
                    className="text-xs font-bold text-[#1579de] hover:underline"
                  >
                    Mot de passe oublié ?
                  </a>
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Login.jsx
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#1579de] text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
<<<<<<< HEAD:myApp/frontend/client/src/pages/Login.jsx
              {loading ? "Connexion..." : "Se connecter"} <ArrowRight className="w-5 h-5" />
=======
              {loading ? "Connexion..." : "Se connecter"}{" "}
              <ArrowRight className="w-5 h-5" />
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Login.jsx
            </button>
          </form>
        </div>

        {/* Footer Login */}
        <p className="text-center mt-8 text-gray-500 font-medium">
<<<<<<< HEAD:myApp/frontend/client/src/pages/Login.jsx
          Nouvel établissement ? {' '}
          <Link to="/register-ecole" className="text-[#ec8626] font-bold hover:underline">Inscrivez-vous ici</Link>
=======
          Nouvel établissement ?{" "}
          <Link
            to="/register-ecole"
            className="text-[#ec8626] font-bold hover:underline"
          >
            Inscrivez-vous ici
          </Link>
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Login.jsx
        </p>
      </div>
    </div>
  );
};

<<<<<<< HEAD:myApp/frontend/client/src/pages/Login.jsx
export default Login;
=======
export default Login;
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Login.jsx
