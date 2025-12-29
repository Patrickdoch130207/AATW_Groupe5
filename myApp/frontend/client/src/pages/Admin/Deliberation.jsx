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

  // Charger les sessions et vérifier l'état de la délibération
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [sessionsData] = await Promise.all([
          adminService.getSessions(),
        ]);
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

  // Charger les étudiants et leurs notes quand une session est sélectionnée
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
          gradesObj[student.id] = student.subjects?.map(subject => ({
            ...subject,
            note: subject.note || '',
            coef: subject.coef || 1
          })) || [];
        });

        // 3. Mettre à jour tous les états d'un coup
        setGrades(gradesObj);
        setStudents(studentsData.map(s => ({
          ...s,
          savedAverage: deliberationsMap[s.id]?.average,
          savedDecision: deliberationsMap[s.id]?.decision,
          is_validated: deliberationsMap[s.id]?.is_validated,
          hasUnsavedChanges: false
        })));

        // 4. Vérifier l'état global de la délibération
        if (selectedSession.status === 'closed') {
          // Si au moins un est validé, on considère comme validé ou calculé
          const hasValidated = Object.values(deliberationsMap).some(d => d.is_validated);
          const hasCalculated = Object.values(deliberationsMap).some(d => d.average !== null);

          if (hasValidated) setDeliberationStatus('validated');
          else if (hasCalculated) setDeliberationStatus('calculated');
          else setDeliberationStatus('');
        }

      } catch (error) {
        console.error('Erreur lors du chargement des données de session:', error);
        setStudents([]);
        setGrades({});
      } finally {
        setLoading(false);
      }
    };

    loadSessionData();
  }, [selectedSession?.id]); // Ne dépendre que de l'ID pour éviter les triggers inutiles

  const handleGradeChange = (studentId, subjectId, value) => {
    setGrades(g => ({
      ...g,
      [studentId]: g[studentId].map(s =>
        s.id === subjectId ? { ...s, note: value } : s
      )
    }));
  };

  const handleSave = async (studentId) => {
    if (!selectedSession) return;

    // Vérifier si la délibération est validée
    const student = students.find(s => s.id === studentId);
    if (student?.is_validated) {
      alert('Cette délibération est déjà validée. Modification impossible.');
      return;
    }

    setSaving(true);
    try {
      const response = await adminService.saveStudentGrades({
        student_id: studentId,
        session_id: selectedSession.id,
        grades: grades[studentId].map(g => ({
          subject_id: g.id,
          note: g.note,
          coef: g.coef
        }))
      });

      // Mettre à jour uniquement les notes, PAS la moyenne
      if (response?.data?.student) {
        setStudents(prevStudents =>
          prevStudents.map(s =>
            s.id === studentId
              ? {
                ...s,
                hasUnsavedChanges: false,
                // Ne pas mettre à jour savedAverage et savedDecision
              }
              : s
          )
        );

        // Mettre à jour les notes dans l'état grades
        const updatedGrades = response.data.student.subjects || [];
        setGrades(prev => ({
          ...prev,
          [studentId]: updatedGrades.map(subject => ({
            ...subject,
            note: subject.note || '',
            coef: subject.coef || 1
          }))
        }));

        alert(response.message || 'Notes enregistrées avec succès. Cliquez sur "Calculer" pour obtenir la moyenne.');
      } else {
        setStudents(prevStudents =>
          prevStudents.map(s =>
            s.id === studentId
              ? { ...s, hasUnsavedChanges: false }
              : s
          )
        );
        alert('Notes enregistrées avec succès. Cliquez sur "Calculer" pour obtenir la moyenne.');
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des notes:", error);
      if (error.response?.status === 403) {
        alert(error.response?.data?.message || 'Cette délibération est déjà validée. Modification impossible.');
      } else {
        alert(error.response?.data?.message || "Erreur lors de l'enregistrement des notes");
      }
      return false;
    } finally {
      setSaving(false);
    }
  };

  const calculateDeliberations = async () => {
    if (!selectedSession) return;

    // Vérifier si des délibérations sont déjà validées
    const hasValidated = students.some(s => s.is_validated);
    if (hasValidated && !window.confirm('Attention : certaines délibérations sont déjà validées et ne seront pas recalculées. Voulez-vous continuer ?')) {
      return;
    }

    setIsCalculating(true);
    try {
      const response = await deliberationService.calculate(selectedSession.id);

      // Recharger les délibérations pour avoir les moyennes mises à jour
      const deliberationResponse = await deliberationService.getDeliberations(selectedSession.id);
      if (deliberationResponse?.data) {
        const deliberationsMap = {};
        deliberationResponse.data.forEach(del => {
          deliberationsMap[del.student_id] = {
            average: del.average,
            decision: del.decision,
            is_validated: del.is_validated
          };
        });

        // Mettre à jour les étudiants avec les moyennes calculées
        setStudents(prev => prev.map(s => ({
          ...s,
          savedAverage: deliberationsMap[s.id]?.average,
          savedDecision: deliberationsMap[s.id]?.decision,
          is_validated: deliberationsMap[s.id]?.is_validated,
          average: deliberationsMap[s.id]?.average,
          decision: deliberationsMap[s.id]?.decision
        })));
      }

      // Mettre à jour le statut pour activer le bouton "Valider"
      setDeliberationStatus('calculated');

      const message = response?.message || 'Délibérations calculées avec succès !';
      const details = response?.data ?
        `\n${response.data.created || 0} créée(s), ${response.data.updated || 0} mise(s) à jour, ${response.data.skipped || 0} ignorée(s)` : '';
      alert(message + details);
    } catch (error) {
      console.error('Erreur lors du calcul des délibérations:', error);
      alert(error.response?.data?.message || 'Erreur lors du calcul des délibérations');
    } finally {
      setIsCalculating(false);
    }
  };

  const validateDeliberations = async () => {
    if (!selectedSession) return;

    // Vérifier si toutes les délibérations ont une moyenne
    const hasUnCalculated = students.some(s => !s.savedAverage && !s.average);
    if (hasUnCalculated) {
      alert('Certaines délibérations n\'ont pas de moyenne calculée. Veuillez d\'abord calculer toutes les délibérations.');
      return;
    }

    if (!window.confirm('Voulez-vous vraiment valider définitivement les délibérations ? Cette action est irréversible et empêchera toute modification ultérieure.')) {
      return;
    }

    setIsValidating(true);
    try {
      const response = await deliberationService.validate(selectedSession.id);

      // Recharger les délibérations pour mettre à jour le statut de validation
      const deliberationResponse = await deliberationService.getDeliberations(selectedSession.id);
      if (deliberationResponse?.data) {
        const deliberationsMap = {};
        deliberationResponse.data.forEach(del => {
          deliberationsMap[del.student_id] = {
            average: del.average,
            decision: del.decision,
            is_validated: del.is_validated
          };
        });

        // Mettre à jour tous les étudiants comme validés
        setStudents(prev => prev.map(s => ({
          ...s,
          is_validated: deliberationsMap[s.id]?.is_validated || true,
          savedAverage: deliberationsMap[s.id]?.average || s.savedAverage,
          savedDecision: deliberationsMap[s.id]?.decision || s.savedDecision
        })));
      }

      setDeliberationStatus('validated');
      const message = response?.message || 'Délibérations validées avec succès !';
      const details = response?.data ?
        `\n${response.data.validated || 0} délibération(s) validée(s) sur ${response.data.total || 0}` : '';
      alert(message + details);
    } catch (error) {
      console.error('Erreur lors de la validation des délibérations:', error);
      alert(error.response?.data?.message || 'Erreur lors de la validation des délibérations');
    } finally {
      setIsValidating(false);
    }
  };

  const downloadConvocation = async (studentId, sessionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:8000/api/admin/student/${studentId}/convocation/${sessionId}/pdf`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur de téléchargement');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `convocation_${studentId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.message || 'Erreur lors du téléchargement de la convocation');
    }
  };

  const downloadTranscript = async (studentId, sessionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:8000/api/admin/student/${studentId}/transcript/${sessionId}/pdf`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur de téléchargement');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `releve_notes_${studentId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.message || 'Erreur lors du téléchargement du relevé de notes');
    }
  };

  const getDecisionColor = (decision) => {
    switch (decision) {
      case 'Admis': return 'text-green-600 bg-green-100';
      case 'Ajourné': return 'text-yellow-600 bg-yellow-100';
      case 'Exclus': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusBadge = () => {
    switch (deliberationStatus) {
      case 'calculated':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="mr-1 h-4 w-4" /> Calculée
          </span>
        );
      case 'validated':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-4 w-4" /> Validée
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <XCircle className="mr-1 h-4 w-4" /> Non calculée
          </span>
        );
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Délibérations</h1>
            <p className="mt-2 text-sm text-gray-600">
              Sélectionnez une session, saisissez les notes et procédez à la délibération
            </p>
          </div>
          {selectedSession && (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Statut :</span> {getStatusBadge()}
              </div>
              <button
                onClick={calculateDeliberations}
                disabled={isCalculating || deliberationStatus === 'validated'}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isCalculating || deliberationStatus === 'validated' ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Calcul en cours...
                  </>
                ) : (
                  'Calculer les délibérations'
                )}
              </button>
              <button
                onClick={validateDeliberations}
                disabled={isValidating || deliberationStatus !== 'calculated'}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isValidating ? 'bg-blue-400' : deliberationStatus !== 'calculated' ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {isValidating ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Validation...
                  </>
                ) : (
                  'Valider les délibérations'
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sélection de la session */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Sélection de la session</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="max-w-xl">
            <label htmlFor="session-select" className="block text-sm font-medium text-gray-700">
              Choisir une session d'examen
            </label>
            <select
              id="session-select"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedSession?.id || ''}
              onChange={e => {
                const session = sessions.find(s => s.id === Number(e.target.value));
                setSelectedSession(session || null);
              }}
            >
              <option value="">Sélectionnez une session...</option>
              {sessions.map(session => (
                <option key={session.id} value={session.id}>
                  {session.name} ({new Date(session.start_date).toLocaleDateString()} - {new Date(session.end_date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des candidats avec saisie des notes */}
      {selectedSession && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Liste des candidats
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {students.length} candidat{students.length !== 1 ? 's' : ''}
              </span>
            </h3>
          </div>

          {students.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun candidat</h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucun candidat n'est inscrit à cette session pour le moment.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom & Prénoms
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matricule
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Classe
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Moyenne
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Décision
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => {
                    const studentGrades = grades[student.id] || [];

                    // Utiliser la moyenne sauvegardée si disponible, sinon calculer côté client
                    const savedAverage = student.savedAverage ?? student.average;
                    const savedDecision = student.savedDecision ?? student.decision;

                    // Calcul côté client pour affichage en temps réel (avant sauvegarde)
                    const total = studentGrades.reduce((sum, grade) => {
                      return sum + (parseFloat(grade.note || 0) * parseFloat(grade.coef || 1));
                    }, 0);

                    const totalCoef = studentGrades.reduce((sum, grade) => {
                      return sum + parseFloat(grade.coef || 1);
                    }, 0);

                    const calculatedAverage = totalCoef > 0 ? (total / totalCoef).toFixed(2) : 0;

                    // Utiliser la moyenne sauvegardée si disponible, sinon la calculée
                    const average = savedAverage ? parseFloat(savedAverage).toFixed(2) : calculatedAverage;
                    const decision = savedDecision || (calculatedAverage > 0 ? (calculatedAverage >= 10 ? 'Admis' : calculatedAverage >= 8 ? 'Ajourné' : 'Exclu') : '');

                    return (
                      <tr key={student.id} className={student.is_validated ? 'bg-green-50' : student.hasUnsavedChanges ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium">
                              {student.first_name ? student.first_name[0] + student.last_name[0] : '?'}
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center space-x-2">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.last_name} {student.first_name}
                                </div>
                                {student.is_validated && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Validée
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.school?.name || 'École non spécifiée'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.matricule || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {student.class_level || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {studentGrades.map((subject) => (
                              <div key={subject.id} className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-700 w-32 truncate">{subject.name}</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="20"
                                  step="0.25"
                                  className="w-20 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  value={subject.note || ''}
                                  onChange={(e) => {
                                    const newValue = e.target.value === '' ? '' : Math.min(20, Math.max(0, parseFloat(e.target.value) || 0));
                                    handleGradeChange(student.id, subject.id, newValue);
                                    // Marquer comme non sauvegardé
                                    setStudents(prev =>
                                      prev.map(s =>
                                        s.id === student.id
                                          ? { ...s, hasUnsavedChanges: true }
                                          : s
                                      )
                                    );
                                  }}
                                  disabled={deliberationStatus === 'validated'}
                                />
                                <span className="text-xs text-gray-500">/20</span>
                                <span className="text-xs text-gray-400">(coef. {subject.coef || 1})</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {savedAverage ? (
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${average >= 10 ? 'bg-green-100 text-green-800' :
                              average >= 8 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                              {average}
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">
                              Non calculée
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {savedDecision ? (
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDecisionColor(savedDecision)}`}>
                              {savedDecision}
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">
                              Non calculée
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleSave(student.id)}
                              disabled={saving || !student.hasUnsavedChanges || deliberationStatus === 'validated'}
                              className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white ${saving || !student.hasUnsavedChanges || deliberationStatus === 'validated'
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                }`}
                            >
                              {saving ? 'Enregistrement...' : 'Enregistrer'}
                            </button>

                            <button
                              onClick={() => downloadConvocation(student.id, selectedSession.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              title="Télécharger la convocation"
                            >
                              <FileText className="w-3 h-3 mr-1" />
                              Convocation
                            </button>

                            {student.is_validated && (
                              <button
                                onClick={() => downloadTranscript(student.id, selectedSession.id)}
                                className="inline-flex items-center px-3 py-1.5 border border-green-300 text-xs font-medium rounded shadow-sm text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                title="Télécharger le relevé de notes"
                              >
                                <Award className="w-3 h-3 mr-1" />
                                Relevé
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Deliberation;

