
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
    setLoading(true);

    try {
      const credentials = { email, password };
      console.log("Tentative de connexion avec :", credentials);

      // Appel au service d'authentification approprié
      const response = mode === "pro" 
        ? await authService.login(credentials)
        : await authService.loginCandidate(credentials);
      
      console.log("Réponse de l'API:", response);

      if (response.access_token) {
        // S'assurer que l'utilisateur a bien un rôle
        const user = response.user || response; // Gestion des deux formats de réponse
        console.log("Utilisateur connecté:", user);

        // Stockage des informations utilisateur
        localStorage.setItem("token", response.access_token);
        localStorage.setItem("user", JSON.stringify(user));

        // informer l'application qu'une nouvelle session est disponible
        window.dispatchEvent(new Event('auth-changed'));

        // Détermination du tableau de bord en fonction du rôle
        let redirectPath = response.redirect_to || "/"; // préférence au backend

        if (!response.redirect_to) {
          if (user.role === "admin") {
            redirectPath = "/admin/dashboard";
          } else if (user.role === "school") {
            redirectPath = "/ecole/dashboard";
          } else if (user.role === "etudiant" || user.role === "student" || user.role === "user") {
            redirectPath = "/candidat/dashboard";
          }
        }
        
        console.log("Redirection vers:", redirectPath);
        navigate(redirectPath, { replace: true });
      } else {
        console.error("Pas de token d'accès dans la réponse:", response);
        setError("Erreur d'authentification: réponse inattendue du serveur");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">

      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-[#1579de] font-semibold transition-colors"
      >
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

          <p className="text-gray-500 mt-2 font-medium">
            Connectez-vous à votre espace
          </p>
        </div>

        <div className="bg-white p-10 rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-50">
          {/* Tabs */}
          <div className="flex bg-slate-50 p-1 rounded-xl mb-8">
            <button

              onClick={() => setMode("pro")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === "pro"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Personnel
            </button>
            <button

              onClick={() => setMode("candidat")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === "candidat"
                  ? "bg-white text-[#1579de] shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
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

                {mode === "pro" ? "Email professionnel" : "Numéro Matricule"}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input

                  type={mode === "pro" ? "email" : "text"}
                  required
                  placeholder={
                    mode === "pro" ? "nom@ecole.com" : "Ex: 2025ABCDE"
                  }
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1579de] transition-all outline-none font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>

              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Mot de passe
              </label>
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

              {mode === "pro" && (
                <div className="text-right mt-2">
                  <a
                    href="#"
                    className="text-xs font-bold text-[#1579de] hover:underline"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#1579de] text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >

              {loading ? "Connexion..." : "Se connecter"}{" "}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Footer Login */}
        <p className="text-center mt-8 text-gray-500 font-medium">

          Nouvel établissement ?{" "}
          <Link
            to="/register-ecole"
            className="text-[#ec8626] font-bold hover:underline"
          >
            Inscrivez-vous ici
          </Link>
        </p>
      </div>
    </div>
  );
};


export default Login;
