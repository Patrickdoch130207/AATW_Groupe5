import { useEffect, useState } from 'react';
import { Save, Loader2, CheckCircle, XCircle, AlertTriangle, Calendar, FileText, Award } from 'lucide-react';
import { adminService, deliberationService } from '../../services/api';

const Deliberation = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({}); // { [studentId]: [{subject, note, coef}] }
  const [saving, setSaving] = useState(false);
  const [deliberationStatus, setDeliberationStatus] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Charger les sessions
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const sessionsData = await adminService.getSessions();
        setSessions(Array.isArray(sessionsData) ? sessionsData : []);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Charger les étudiants et leurs délibérations quand une session est sélectionnée
  useEffect(() => {
    if (!selectedSession?.id) {
      setStudents([]);
      setGrades({});
      return;
    }

    const loadSessionData = async () => {
      setLoading(true);
      try {
        // 1. Récupérer les étudiants et les délibérations en parallèle
        const [studentsResponse, deliberationsResponse] = await Promise.all([
          adminService.getSessionStudents(selectedSession.id),
          deliberationService.getDeliberations(selectedSession.id).catch(() => ({ data: [] }))
        ]);

        const studentsData = Array.isArray(studentsResponse) ? studentsResponse : [];
        const deliberationsMap = {};

        if (deliberationsResponse?.data) {
          deliberationsResponse.data.forEach(del => {
            deliberationsMap[del.student_id] = {
              average: del.average,
              decision: del.decision,
              is_validated: del.is_validated
            };
          });
        }

        // 2. Préparer l'objet des notes
        const gradesObj = {};
        studentsData.forEach(student => {
          // Fusionner les infos de délibération dans l'objet étudiant
          if (deliberationsMap[student.id]) {
            student.deliberation = deliberationsMap[student.id];
          }

          gradesObj[student.id] = student.subjects?.map(subject => ({
            ...subject,
            note: subject.pivot?.note !== null && subject.pivot?.note !== undefined ? subject.pivot.note : (subject.note || ''),
            coef: subject.pivot?.coefficient || subject.coef || 1
          })) || [];
        });

        setStudents(studentsData);
        setGrades(gradesObj);

      } catch (error) {
        console.error('Erreur lors du chargement des données de la session:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSessionData();
  }, [selectedSession]);

  const handleGradeChange = (studentId, subjectId, value) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: prev[studentId].map(g =>
        g.id === subjectId ? { ...g, note: value } : g
      )
    }));
  };

  const saveGrades = async (studentId) => {
    setSaving(studentId);
    try {
      const studentGrades = grades[studentId].map(g => ({
        subject_id: g.id,
        note: g.note === '' || g.note === null ? null : g.note,
        coef: g.coef
      }));

      await adminService.saveStudentGrades({
        student_id: studentId,
        session_id: selectedSession.id,
        grades: studentGrades
      });

      // Mettre à jour localement l'état visuel sans recharger tout
      alert('Notes enregistrées avec succès !');

    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de la sauvegarde des notes.';
      alert(errorMessage);
    } finally {
      setSaving(null);
    }
  };

  const calculateDeliberations = async () => {
    if (!selectedSession) return;
    setIsCalculating(true);
    try {
      await deliberationService.calculate(selectedSession.id);
      // Recharger les données pour voir les nouvelles moyennes
      const deliberationsResponse = await deliberationService.getDeliberations(selectedSession.id);
      if (deliberationsResponse?.data) {
        const deliberationsMap = {};
        deliberationsResponse.data.forEach(del => {
          deliberationsMap[del.student_id] = {
            average: del.average,
            decision: del.decision,
            is_validated: del.is_validated
          };
        });

        setStudents(prev => prev.map(s => ({
          ...s,
          deliberation: deliberationsMap[s.id] || s.deliberation
        })));
      }
      alert('Calcul des délibérations terminé !');
    } catch (error) {
      console.error('Erreur de calcul:', error);
      alert('Erreur lors du calcul des délibérations.');
    } finally {
      setIsCalculating(false);
    }
  };

  const validateDeliberations = async () => {
    if (!selectedSession || !window.confirm('Êtes-vous sûr de vouloir valider définitivement les résultats ? Cette action est irréversible.')) return;
    setIsValidating(true);
    try {
      await deliberationService.validate(selectedSession.id);
      setStudents(prev => prev.map(s => ({
        ...s,
        deliberation: { ...s.deliberation, is_validated: true }
      })));
      alert('Délibérations validées et publiées !');
    } catch (error) {
      console.error('Erreur de validation:', error);
    } finally {
      setIsValidating(false);
    }
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-gray-500 font-medium">Chargement des sessions...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-3">
            <Award className="text-blue-500" /> Gestion des Délibérations
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Saisie des notes et validation des résultats d'examen</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            onChange={(e) => setSelectedSession(sessions.find(s => s.id === parseInt(e.target.value)))}
            value={selectedSession?.id || ''}
          >
            <option value="">Choisir une session...</option>
            {sessions.map(session => (
              <option key={session.id} value={session.id}>{session.name}</option>
            ))}
          </select>

          {selectedSession && (
            <>
              <button
                onClick={calculateDeliberations}
                disabled={isCalculating || students.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                {isCalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                Calculer
              </button>
              <button
                onClick={validateDeliberations}
                disabled={isValidating || students.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-500/20 transition-all disabled:opacity-50"
              >
                {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Valider
              </button>
            </>
          )}
        </div>
      </div>

      {selectedSession ? (
        <div className="grid gap-6">
          {students.length === 0 ? (
            <div className="bg-white p-20 rounded-[32px] border border-gray-100 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <FileText size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 tracking-tight">Aucun étudiant dans cette session</h3>
              <p className="text-gray-500 max-w-md mx-auto">Veuillez d'abord affecter des étudiants à cette session dans la gestion des sessions.</p>
            </div>
          ) : (
            students.map(student => (
              <div key={student.id} className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 font-black text-xl border shadow-sm">
                      {student.first_name[0]}{student.last_name[0]}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-800 text-lg uppercase leading-tight">{student.first_name} {student.last_name}</h3>
                      <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Matricule: <span className="text-blue-500">{student.matricule}</span> • {student.school?.name}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100">
                    <div className="px-4 border-r border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Moyenne</p>
                      <p className={`text-xl font-black ${student.deliberation?.average >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                        {student.deliberation?.average !== null && student.deliberation?.average !== undefined
                          ? Number(student.deliberation.average).toFixed(2)
                          : '--.--'}
                      </p>
                    </div>
                    <div className="px-4 border-r border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Décision</p>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${student.deliberation?.decision === 'Admis' ? 'bg-green-100 text-green-700' :
                        student.deliberation?.decision === 'Ajourné' ? 'bg-blue-100 text-blue-700' :
                          student.deliberation?.decision === 'Refusé' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-400'
                        }`}>
                        {student.deliberation?.decision || 'En attente'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(`/print/convocation/${selectedSession.id}?studentId=${student.id}`, '_blank')}
                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        title="Imprimer Convocation"
                      >
                        <FileText size={20} />
                      </button>
                      <button
                        onClick={() => window.open(`/print/transcript/${selectedSession.id}?studentId=${student.id}`, '_blank')}
                        disabled={!student.deliberation?.is_validated}
                        className={`p-3 rounded-xl transition-colors ${student.deliberation?.is_validated ? 'text-green-600 hover:bg-green-50' : 'text-gray-300'}`}
                        title="Imprimer Relevé"
                      >
                        <Award size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {grades[student.id]?.map(subject => (
                      <div key={subject.id} className="space-y-2">
                        <div className="flex justify-between items-center px-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{subject.name} <span className="text-gray-300 font-medium">(Coef {subject.coef})</span></label>
                        </div>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.25"
                          value={subject.note === null ? '' : subject.note}
                          onChange={(e) => handleGradeChange(student.id, subject.id, e.target.value)}
                          disabled={student.deliberation?.is_validated}
                          title={student.deliberation?.is_validated ? "Modification impossible : la délibération est déjà validée" : ""}
                          className={`w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-gray-700 focus:ring-4 transition-all text-center text-lg ${student.deliberation?.is_validated ? 'opacity-60 cursor-not-allowed' :
                              subject.note >= 10 ? 'focus:ring-green-500/10 focus:border-green-500' : 'focus:ring-blue-500/10 focus:border-blue-500'
                            }`}
                          placeholder="-- / 20"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => saveGrades(student.id)}
                      disabled={saving === student.id || student.deliberation?.is_validated}
                      title={student.deliberation?.is_validated ? "Modification impossible : la délibération est déjà validée" : ""}
                      className="flex items-center gap-3 px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold transition-all shadow-xl shadow-gray-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving === student.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
                      Sauvegarder les notes
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[40px] border border-dashed border-gray-200 text-center space-y-6">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-500">
            <Calendar size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Prêt pour la délibération ?</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Veuillez sélectionner une session d'examen ci-dessus pour commencer la saisie des notes ou calculer les résultats.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deliberation;
