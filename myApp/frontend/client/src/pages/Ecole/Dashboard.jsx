import { CheckCircle, Clock, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { schoolService } from "../../services/api";
import { useNavigate } from "react-router-dom";

const EcoleDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ count: 0 });

  useEffect(() => {
    schoolService
      .getSchoolStats()
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        console.error("Impossible de charger les stats");
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-[#1579de] to-[#1d6d1f] rounded-[32px] p-10 text-white mb-10">
        <h1 className="text-3xl font-black mb-2">Bienvenue sur votre espace</h1>
        <p className="opacity-90">
          Gérez vos candidatures et suivez l'état de vos dossiers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-100">
          <div className="text-[#1d6d1f] mb-4">
            <CheckCircle size={40} />
          </div>
          <h3 className="text-xl font-bold mb-2">État de l'Agrément</h3>
          <p className="text-slate-500 mb-4">
            Votre établissement est officiellement reconnu pour la session 2025.
          </p>
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
            Actif
          </span>
        </div>

        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-100">
          <div className="text-[#ec8626] mb-4">
            <FileText size={40} />
          </div>
          <h3 className="text-xl font-bold mb-2">Inscriptions</h3>
          <p className="text-slate-500 mb-4">
            Vous avez inscrit {stats.count}{" "}
            {stats.count > 1 ? "candidats" : "candidat"} pour le moment.
          </p>
          <button
            className="text-[#1579de] font-bold hover:underline"
            onClick={() => navigate("/ecole/inscription")}
          >
            Commencer une inscription →
          </button>
        </div>
      </div>
    </div>
  );
};

export default EcoleDashboard;
