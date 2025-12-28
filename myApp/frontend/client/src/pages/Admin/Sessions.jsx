import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, ChevronRight, Settings2, X, Check, Loader2 } from 'lucide-react';
import { adminService } from '../../services/api';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSession, setNewSession] = useState({ name: '', start_date: '', end_date: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchSessions = async () => {
    try {
      const response = await adminService.getSessions();
      setSessions(response.data || []);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Basic client-side validation to avoid 422
      if (!newSession.name?.trim()) {
        alert('Le nom de la session est requis.');
        return;
      }
      if (!newSession.start_date || !newSession.end_date) {
        alert('Veuillez renseigner la date de début et la date de fin.');
        return;
      }
      const sd = new Date(newSession.start_date);
      const ed = new Date(newSession.end_date);
      const today = new Date();
      // Normalise today to 00:00
      today.setHours(0,0,0,0);
      if (isNaN(sd.getTime()) || isNaN(ed.getTime())) {
        alert('Format de date invalide.');
        return;
      }
      if (ed <= sd) {
        alert('La date de fin doit être postérieure à la date de début.');
        return;
      }
      if (sd < today) {
        alert("La date de début doit être aujourd'hui ou après.");
        return;
      }

      await adminService.createSession(newSession);
      setShowModal(false);
      setNewSession({ name: '', start_date: '', end_date: '' });
      fetchSessions();
    } catch (err) {
      const errors = err?.response?.data?.errors || err?.response?.data;
      console.error('Validation errors:', errors || err);
      const msg = errors
        ? Object.entries(errors).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n')
        : (err?.response?.data?.message || 'Erreur lors de la création de la session');
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Confirmer le changement de statut vers : ${status} ?`)) return;
    try {
      await adminService.updateSession(id, { status });
      fetchSessions();
    } catch (err) {
      console.error("Erreur lors de la mise à jour", err);
      alert("Erreur lors de la mise à jour");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-[#1579de] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Sessions d'Examen</h1>
          <p className="text-slate-500 font-medium">Configurez les périodes d'inscription et de passage</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1579de] text-white px-6 py-4 rounded-[20px] font-bold shadow-lg shadow-blue-100 hover:scale-105 transition-transform"
        >
          <Plus size={20} /> Nouvelle Session
        </button>
      </div>

      <div className="grid gap-6">
        {sessions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200 text-slate-400">
            Aucune session enregistrée.
          </div>
        ) : sessions.map((s) => (
          <div key={s.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors group">
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center ${s.status === 'open' ? 'bg-blue-50 text-[#1579de]' : 'bg-slate-50 text-slate-400'}`}>
                <Calendar size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{s.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><Clock size={14} /> Du {new Date(s.start_date).toLocaleDateString()} au {new Date(s.end_date).toLocaleDateString()}</span>
                  <span className="font-bold text-[#1d6d1f] italic">{s.candidates_count || 0} inscrits</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${s.status === 'open' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                {s.status === 'open' ? 'Ouverte' : 'Clôturée'}
              </span>
              {s.status === 'open' ? (
                <button
                  onClick={() => handleUpdateStatus(s.id, 'closed')}
                  className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                >
                  Clôturer
                </button>
              ) : (
                <button
                  onClick={() => handleUpdateStatus(s.id, 'open')}
                  className="px-4 py-2 bg-blue-50 text-[#1579de] rounded-xl text-xs font-bold hover:bg-[#1579de] hover:text-white transition-all"
                >
                  Réouvrir
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nouvelle Session */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 uppercase">Nouvelle Session</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Nom de la session</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: BAC Technique 2025"
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1579de] outline-none font-medium"
                  value={newSession.name}
                  onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Date de début</label>
                  <input
                    required
                    type="date"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1579de] outline-none font-medium text-sm"
                    value={newSession.start_date}
                    onChange={(e) => setNewSession({ ...newSession, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Date de fin</label>
                  <input
                    required
                    type="date"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1579de] outline-none font-medium text-sm"
                    value={newSession.end_date}
                    onChange={(e) => setNewSession({ ...newSession, end_date: e.target.value })}
                  />
                </div>
              </div>

              <button
                disabled={submitting}
                className="w-full py-4 bg-[#1579de] text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? "Création..." : "Créer la session"} <Check size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sessions;