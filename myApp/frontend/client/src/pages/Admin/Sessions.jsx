import { useState, useEffect, useRef } from 'react';
import { Plus, Calendar, Clock, ChevronRight, Settings2, X, Check, Loader2, Users } from 'lucide-react';
import { adminService } from '../../services/api';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSession, setNewSession] = useState({ name: '', start_date: '', end_date: '', exam_type: 'BAC' });
  const [submitting, setSubmitting] = useState(false);
  const [classGroups, setClassGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [examSubjects, setExamSubjects] = useState(null);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const formRef = useRef(null);

  const fetchSessions = async () => {
    try {
      const response = await adminService.getSessions();
      const normalized = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];

      setSessions(normalized);
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchClassGroups = async () => {
    setLoadingGroups(true);
    try {
      const response = await adminService.getClassGroups();
      const list = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];
      setClassGroups(list);
    } catch (error) {
      console.error('Failed to load class groups', error);
    } finally {
      setLoadingGroups(false);
    }
  };

  const fetchExamSubjects = async (examType) => {
    setLoadingSubjects(true);
    try {
      const response = await adminService.getExamSubjects(examType);
      setExamSubjects(response);
    } catch (error) {
      console.error('Failed to load exam subjects', error);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
    fetchClassGroups();
    fetchExamSubjects(newSession.exam_type || 'BAC');
  };

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

      const sessionData = {
        ...newSession,
        class_groups: selectedGroups,
      };

      // Ajouter la configuration des matières si des matières sont sélectionnées
      if (selectedSubjects.length > 0 && examSubjects) {
        sessionData.subjects_config = {
          exam_type: newSession.exam_type || 'BAC',
          subjects: selectedSubjects.map(subjId => {
            const subject = examSubjects.subjects.find(s => s.id === subjId);
            if (subject) {
              return {
                subject_id: parseInt(subject.id, 10), // S'assurer que c'est un entier
                coefficients: subject.coefficients
              };
            }
            return null;
          }).filter(Boolean)
        };
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/22859b6d-3cf2-487c-8676-a3e06666edd0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Sessions.jsx:128',message:'Sending session data',data:{sessionData,subjectsConfig:sessionData.subjects_config},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
      // #endregion

      await adminService.createSession(sessionData);
      setShowModal(false);
      setNewSession({ name: '', start_date: '', end_date: '', exam_type: 'BAC' });
      setSelectedGroups([]);
      setSelectedSubjects([]);
      setExamSubjects(null);
      fetchSessions();
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/22859b6d-3cf2-487c-8676-a3e06666edd0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Sessions.jsx:140',message:'Error creating session',data:{error:error.message,status:error.response?.status,errors:error.response?.data?.errors,responseData:error.response?.data},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      console.error(error);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : "Erreur lors de la création de la session";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Confirmer le changement de statut vers : ${status} ?`)) return;
    try {
      await adminService.updateSession(id, { status });
      fetchSessions();
    } catch (error) {
      console.error(error);
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
          onClick={openModal}
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
          <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-8 pb-4 flex-shrink-0">
              <h2 className="text-2xl font-black text-slate-800 uppercase">Nouvelle Session</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <form ref={formRef} onSubmit={handleCreate} className="space-y-6 overflow-y-auto flex-1 px-8 pb-4">
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

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Type d'examen</label>
                <select
                  required
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1579de] outline-none font-medium"
                  value={newSession.exam_type || 'BAC'}
                  onChange={(e) => {
                    const examType = e.target.value;
                    setNewSession({ ...newSession, exam_type: examType });
                    fetchExamSubjects(examType);
                    setSelectedSubjects([]);
                  }}
                >
                  <option value="BAC">BAC (Baccalauréat)</option>
                  <option value="BEPC">BEPC (Brevet d'Études du Premier Cycle)</option>
                </select>
              </div>

              {/* Sélection des matières */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Matières d'examen <span className="text-xs font-normal text-slate-400">(avec coefficients par filière)</span>
                </label>
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 max-h-96 overflow-y-auto">
                  {loadingSubjects ? (
                    <div className="flex items-center justify-center py-6 text-slate-400 text-sm">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Chargement des matières...
                    </div>
                  ) : !examSubjects || examSubjects.subjects?.length === 0 ? (
                    <p className="text-sm text-slate-400">Aucune matière disponible pour ce type d'examen.</p>
                  ) : (
                    <div className="space-y-3">
                      {examSubjects.subjects?.map((subject) => {
                        const checked = selectedSubjects.includes(subject.id);
                        const filieres = examSubjects.filières || {};
                        return (
                          <div
                            key={subject.id}
                            className={`p-4 rounded-2xl border transition-all ${
                              checked ? 'border-[#1579de] bg-white shadow-sm' : 'border-slate-200 bg-white'
                            }`}
                          >
                            <label className="flex items-start gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                className="mt-1 w-4 h-4 text-[#1579de] rounded"
                                checked={checked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedSubjects([...selectedSubjects, subject.id]);
                                  } else {
                                    setSelectedSubjects(selectedSubjects.filter(id => id !== subject.id));
                                  }
                                }}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-bold text-slate-700">{subject.name}</p>
                                {subject.description && (
                                  <p className="text-xs text-slate-400 mt-1">{subject.description}</p>
                                )}
                                {checked && Object.keys(subject.coefficients || {}).length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-slate-100">
                                    <p className="text-xs font-semibold text-slate-600 mb-1">Coefficients par filière:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {Object.entries(subject.coefficients).map(([filiereCode, coeff]) => {
                                        if (coeff === 0) return null;
                                        const filiereName = filieres[filiereCode] || filiereCode;
                                        return (
                                          <span
                                            key={filiereCode}
                                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
                                          >
                                            {filiereName}: {coeff}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                {selectedSubjects.length > 0 && (
                  <p className="text-xs text-slate-500 ml-1">
                    {selectedSubjects.length} matière{selectedSubjects.length > 1 ? 's' : ''} sélectionnée{selectedSubjects.length > 1 ? 's' : ''}
                  </p>
                )}
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

              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Classes concernées</label>
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 max-h-64 overflow-y-auto">
                  {loadingGroups ? (
                    <div className="flex items-center justify-center py-6 text-slate-400 text-sm">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Chargement des classes...
                    </div>
                  ) : classGroups.length === 0 ? (
                    <p className="text-sm text-slate-400">Aucune classe disponible pour le moment.</p>
                  ) : (
                    <div className="space-y-3">
                      {classGroups.map((group) => {
                        const checked = selectedGroups.includes(group.id);
                        return (
                          <label
                            key={group.id}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                              checked ? 'border-[#1579de] bg-white shadow-sm' : 'border-slate-200 bg-white'
                            }`}
                          >
                            <div>
                              <p className="text-sm font-bold text-slate-700">{group.label}</p>
                              <p className="text-xs text-slate-400 flex items-center gap-1"><Users size={12} /> {group.students_count} inscrits</p>
                            </div>
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-[#1579de] rounded"
                              checked={checked}
                              onChange={(event) => {
                                setSelectedGroups((prev) =>
                                  event.target.checked
                                    ? [...prev, group.id]
                                    : prev.filter((id) => id !== group.id)
                                );
                              }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

            </form>
            
            <div className="px-8 pb-8 pt-4 border-t border-slate-100 flex-shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (formRef.current) {
                    formRef.current.requestSubmit();
                  }
                }}
                disabled={submitting}
                className="w-full py-4 bg-[#1579de] text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? "Création..." : "Créer la session"} <Check size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sessions;