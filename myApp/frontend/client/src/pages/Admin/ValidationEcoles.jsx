import { useState, useEffect } from 'react';
import { Check, X, Eye, FileText, AlertCircle, Search, MapPin, Calendar } from 'lucide-react';
import { schoolService } from '../../services/api';

const ValidationEcoles = () => {
  const [ecoles, setEcoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'active'

  const fetchSchools = async () => {
    setLoading(true);
    try {
      // If tab is 'pending', we ask for pending, else we ask for active
      // Or we fetch all and filter client side? Let's use API filtering
      const response = await schoolService.getAll(activeTab === 'all' ? null : activeTab);
      setEcoles(response.data);
    } catch (err) {
      console.error("Failed to fetch schools", err);
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
      setEcoles(ecoles.map(e => e.id === ecole.id ? { ...e, is_center: !e.is_center } : e));
    } catch (err) {
      alert("Erreur lors du changement de statut centre");
    }
  };

  const filteredEcoles = ecoles.filter(e =>
    e.school_name?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Gestion des Écoles</h1>
          <p className="text-slate-500 font-medium mt-1">Validez les inscriptions et définissez les centres d'examen.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
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
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'pending' ? 'bg-[#ec8626] text-white shadow-lg shadow-orange-100' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
        >
          En Attente
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'active' ? 'bg-[#1579de] text-white shadow-lg shadow-blue-100' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
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
              <h2 className="text-xl font-bold text-slate-400">Aucune école trouvée dans cette section</h2>
            </div>
          )}

          {filteredEcoles.map((ecole) => (
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
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
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
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-4">
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
                        Désactiver
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ValidationEcoles;