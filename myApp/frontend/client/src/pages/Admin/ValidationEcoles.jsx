<<<<<<< HEAD:myApp/frontend/client/src/pages/Admin/ValidationEcoles.jsx
import { useState, useEffect } from 'react';
import { Check, X, Eye, FileText, AlertCircle, Search, MapPin, Calendar } from 'lucide-react';
import { schoolService } from '../../services/api';
=======
import { useState, useEffect } from "react";
import {
  Check,
  X,
  Eye,
  FileText,
  AlertCircle,
  Search,
  MapPin,
  Calendar,
} from "lucide-react";
import { schoolService } from "../../services/api";
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Admin/ValidationEcoles.jsx

const ValidationEcoles = () => {
  const [ecoles, setEcoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
<<<<<<< HEAD:myApp/frontend/client/src/pages/Admin/ValidationEcoles.jsx
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'active'
=======
  const [activeTab, setActiveTab] = useState("pending"); // 'pending' or 'active'
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Admin/ValidationEcoles.jsx

  const fetchSchools = async () => {
    setLoading(true);
    try {
<<<<<<< HEAD:myApp/frontend/client/src/pages/Admin/ValidationEcoles.jsx
      // If tab is 'pending', we ask for pending, else we ask for active
      // Or we fetch all and filter client side? Let's use API filtering
      const response = await schoolService.getAll(activeTab === 'all' ? null : activeTab);
      setEcoles(response.data);
    } catch (err) {
      console.error("Failed to fetch schools", err);
=======
      // Utiliser la nouvelle méthode selon l'onglet
      const response =
        activeTab === "pending"
          ? await schoolService.getPending()
          : await schoolService.getActive();

      // Axios place la réponse du contrôleur dans .data
      setEcoles(response.data || response);
    } catch (err) {
      console.error("Erreur lors de la récupération des écoles", err);
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Admin/ValidationEcoles.jsx
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [activeTab]);

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm("Confirmer le changement de statut ?")) return;
    try {
      await schoolService.updateStatus(id, newStatus);
      fetchSchools();
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleCenterToggle = async (ecole) => {
    try {
      await schoolService.update(ecole.id, { is_center: !ecole.is_center });
      // Optimistic update or refetch
<<<<<<< HEAD:myApp/frontend/client/src/pages/Admin/ValidationEcoles.jsx
      setEcoles(ecoles.map(e => e.id === ecole.id ? { ...e, is_center: !e.is_center } : e));
=======
      setEcoles(
        ecoles.map((e) =>
          e.id === ecole.id ? { ...e, is_center: !e.is_center } : e
        )
      );
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Admin/ValidationEcoles.jsx
    } catch (err) {
      alert("Erreur lors du changement de statut centre");
    }
  };

<<<<<<< HEAD:myApp/frontend/client/src/pages/Admin/ValidationEcoles.jsx
  const filteredEcoles = ecoles.filter(e =>
    e.school_name?.toLowerCase().includes(filter.toLowerCase())
=======
  const filteredEcoles = ecoles.filter((e) =>
    e.name?.toLowerCase().includes(filter.toLowerCase())
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Admin/ValidationEcoles.jsx
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
<<<<<<< HEAD:myApp/frontend/client/src/pages/Admin/ValidationEcoles.jsx
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Gestion des Écoles</h1>
          <p className="text-slate-500 font-medium mt-1">Validez les inscriptions et définissez les centres d'examen.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
=======
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
            Gestion des Écoles
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Validez les inscriptions et définissez les centres d'examen.
          </p>
        </div>

        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Admin/ValidationEcoles.jsx
          <input
            type="text"
            placeholder="Rechercher une école..."
            className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[20px] shadow-sm w-full md:w-80 focus:ring-2 focus:ring-[#1579de] outline-none"
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
<<<<<<< HEAD:myApp/frontend/client/src/pages/Admin/ValidationEcoles.jsx
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'pending' ? 'bg-[#ec8626] text-white shadow-lg shadow-orange-100' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
=======
          onClick={() => setActiveTab("pending")}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === "pending"
              ? "bg-[#ec8626] text-white shadow-lg shadow-orange-100"
              : "bg-white text-slate-500 hover:bg-slate-50"
          }`}
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Admin/ValidationEcoles.jsx
        >
          En Attente
        </button>
        <button
<<<<<<< HEAD:myApp/frontend/client/src/pages/Admin/ValidationEcoles.jsx
          onClick={() => setActiveTab('active')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'active' ? 'bg-[#1579de] text-white shadow-lg shadow-blue-100' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
=======
          onClick={() => setActiveTab("active")}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === "active"
              ? "bg-[#1579de] text-white shadow-lg shadow-blue-100"
              : "bg-white text-slate-500 hover:bg-slate-50"
          }`}
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Admin/ValidationEcoles.jsx
        >
          Écoles Validées
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="p-10 text-center text-slate-400">Chargement...</div>
      ) : (
        /* Grille des dossiers */
        <div className="grid gap-6">
          {filteredEcoles.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
              <AlertCircle size={48} className="mx-auto text-slate-200 mb-4" />
<<<<<<< HEAD:myApp/frontend/client/src/pages/Admin/ValidationEcoles.jsx
              <h2 className="text-xl font-bold text-slate-400">Aucune école trouvée dans cette section</h2>
=======
              <h2 className="text-xl font-bold text-slate-400">
                Aucune école trouvée dans cette section
              </h2>
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Admin/ValidationEcoles.jsx
            </div>
          )}

          {filteredEcoles.map((ecole) => (
<<<<<<< HEAD:myApp/frontend/client/src/pages/Admin/ValidationEcoles.jsx
            <div key={ecole.id} className="group bg-white rounded-[32px] p-2 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center p-4 gap-6">

                {/* Info Principale */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center shrink-0 ${ecole.is_center ? 'bg-purple-100 text-purple-600' : 'bg-blue-50 text-[#1579de]'}`}>
                      {ecole.is_center ? <MapPin size={28} /> : <FileText size={28} />}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800 leading-tight flex items-center gap-2">
                        {ecole.school_name}
                        {ecole.is_center && <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] rounded-md uppercase tracking-wider">Centre</span>}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <MapPin size={14} className="text-[#ec8626]" /> {ecole.city || ecole.department || 'Non renseigné'}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <Calendar size={14} /> {new Date(ecole.created_at).toLocaleDateString()}
                        </span>
=======
            <div
              key={ecole.id}
              className="group bg-white rounded-[32px] p-2 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center p-4 gap-6">
                {/* Info Principale */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    {/* Info Principale */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-14 h-14 rounded-[22px] flex items-center justify-center shrink-0 ${
                            ecole.is_center
                              ? "bg-purple-100 text-purple-600"
                              : "bg-blue-50 text-[#1579de]"
                          }`}
                        >
                          {ecole.is_center ? (
                            <MapPin size={28} />
                          ) : (
                            <FileText size={28} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <h3 className="text-xl font-black text-slate-800 leading-tight truncate">
                              {ecole.name || ecole.school_name}
                            </h3>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-slate-200">
                              Arrêté: {ecole.decree_number || "2025-201"}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Direction */}
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                Direction
                              </p>
                              <p className="text-sm font-black text-slate-700">
                                {ecole.director_name || "Non renseigné"}
                              </p>
                            </div>

                            {/* Contact & Email - Affichage intégral */}
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                Contact & Email
                              </p>
                              <p className="text-sm font-bold text-slate-700">
                                {ecole.phone || "---"}
                              </p>
                              <p className="text-xs font-medium text-slate-400 break-all">
                                {ecole.user?.email || "censeur@gmail.com"}
                              </p>
                            </div>

                            {/* Localisation */}
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                Localisation
                              </p>
                              <p className="text-sm font-bold text-slate-700">
                                {ecole.address || "Quartier Zogbadjè"}
                              </p>
                              <div className="flex items-center gap-1 text-[#ec8626]">
                                <MapPin size={10} />
                                <span className="text-[10px] font-bold uppercase tracking-tighter">
                                  {ecole.city || "Abomey-Calavi"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Date en bas */}
                          <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase">
                            <Calendar size={12} />
                            Inscrit le{" "}
                            {new Date(ecole.created_at).toLocaleDateString()}
                          </div>
                        </div>
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Admin/ValidationEcoles.jsx
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
<<<<<<< HEAD:myApp/frontend/client/src/pages/Admin/ValidationEcoles.jsx
                <div className="flex items-center gap-3 pl-4 border-l border-slate-50">
                  {activeTab === 'pending' ? (
                    <>
                      <button
                        className="flex items-center gap-2 px-6 py-4 bg-[#1d6d1f] text-white rounded-[20px] font-bold text-sm shadow-lg shadow-green-100 hover:scale-105 active:scale-95 transition-all"
                        onClick={() => handleStatusChange(ecole.id, 'active')}
                      >
                        <Check size={18} /> Approuver
                      </button>
                      <button
                        className="p-4 bg-red-50 text-red-500 rounded-[20px] hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        onClick={() => handleStatusChange(ecole.id, 'rejected')}
                      >
                        <X size={20} />
=======
                <div className="flex items-center gap-3 lg:pl-6 lg:border-l border-slate-100">
                  {activeTab === "pending" ? (
                    <>
                      <button
                        className="flex items-center gap-2 px-5 py-3 bg-[#1d6d1f] text-white rounded-2xl font-bold text-sm shadow-lg shadow-green-100 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                        onClick={() => handleStatusChange(ecole.id, "active")}
                      >
                        <Check size={16} /> Approuver
                      </button>
                      <button
                        className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        onClick={() => handleStatusChange(ecole.id, "rejected")}
                      >
                        <X size={18} />
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Admin/ValidationEcoles.jsx
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-4">
<<<<<<< HEAD:myApp/frontend/client/src/pages/Admin/ValidationEcoles.jsx
                      <div className="flex items-center gap-3 cursor-pointer group/toggle" onClick={() => handleCenterToggle(ecole)}>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-700">Centre d'Examen</p>
                          <p className="text-[10px] text-slate-400">{Number(ecole.is_center) ? 'Oui' : 'Non'}</p>
                        </div>
                        <div className={`w-14 h-8 rounded-full p-1 transition-colors ${Number(ecole.is_center) ? 'bg-purple-600' : 'bg-slate-200'}`}>
                          <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${Number(ecole.is_center) ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                      </div>
                      <button className="p-4 bg-red-50 text-red-500 rounded-[20px] hover:bg-red-100 transition-all font-bold text-xs" onClick={() => handleStatusChange(ecole.id, 'rejected')}>
=======
                      <div
                        className="flex items-center gap-3 cursor-pointer group/toggle"
                        onClick={() => handleCenterToggle(ecole)}
                      >
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-700">
                            Centre d'Examen
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {Number(ecole.is_center) ? "Oui" : "Non"}
                          </p>
                        </div>
                        <div
                          className={`w-14 h-8 rounded-full p-1 transition-colors ${
                            Number(ecole.is_center)
                              ? "bg-purple-600"
                              : "bg-slate-200"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
                              Number(ecole.is_center)
                                ? "translate-x-6"
                                : "translate-x-0"
                            }`}
                          ></div>
                        </div>
                      </div>
                      <button
                        className="p-4 bg-red-50 text-red-500 rounded-[20px] hover:bg-red-100 transition-all font-bold text-xs"
                        onClick={() => handleStatusChange(ecole.id, "rejected")}
                      >
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Admin/ValidationEcoles.jsx
                        Désactiver
                      </button>
                    </div>
                  )}
                </div>
<<<<<<< HEAD:myApp/frontend/client/src/pages/Admin/ValidationEcoles.jsx

=======
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Admin/ValidationEcoles.jsx
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

<<<<<<< HEAD:myApp/frontend/client/src/pages/Admin/ValidationEcoles.jsx
export default ValidationEcoles;
=======
export default ValidationEcoles;
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Admin/ValidationEcoles.jsx
