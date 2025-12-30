import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, ArrowLeft } from "lucide-react";
import { authService } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // Identifier (username or email)
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
        const user = response.user || response;
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
        <div className="bg-white rounded-[32px] shadow-xl shadow-blue-900/5 p-12 border border-blue-50">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-[#1579de] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 rotate-3">
              <GraduationCap className="w-8 h-8 text-white -rotate-3" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter uppercase">
              Exam<span className="text-[#1579de]">Flow</span>
            </h1>
            <p className="text-gray-500 text-center font-bold text-sm uppercase tracking-wide">
              Connectez-vous à votre espace
            </p>
          </div>

          <div className="flex p-1 bg-gray-100 rounded-2xl mb-8">
            <button
              onClick={() => setMode("pro")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${mode === "pro"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Personnel
            </button>
            <button
              onClick={() => setMode("candidat")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${mode === "candidat"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Candidat
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-2xl animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                {mode === "pro" ? "Email professionnel" : "Numéro Matricule"}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  placeholder={mode === "pro" ? "admin@exam.com" : "Ex: 2025ABCDE"}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Mot de passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-4 px-6 bg-[#1579de] hover:bg-[#126bc4] text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/20 active:transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowLeft className="ml-2 w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 font-medium pt-8">
              Nouvel établissement ?{" "}
              <button
                type="button"
                onClick={() => navigate("/register-school")}
                className="text-orange-500 font-black hover:underline"
              >
                Inscrivez-vous ici
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
