import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Loader2, AlertTriangle, Calendar, MapPin, User, School } from 'lucide-react';
import { studentService } from '../../services/api';

const MaConvocation = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [convocation, setConvocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConvocation = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await studentService.getMyConvocation(sessionId);
        if (response?.success && response?.data) {
          setConvocation(response.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la convocation:', error);
      } finally {
        setLoading(false);
      }
    };
    loadConvocation();
  }, [sessionId]);

  const handleDownload = () => {
    if (convocation?.student?.id) {
      window.open(`/pdf/convocation/${convocation.student.id}/download`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!convocation) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <div className="bg-white rounded-[40px] p-12 text-center shadow-lg">
          <AlertTriangle className="text-slate-400 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-black text-slate-800 mb-2">Convocation introuvable</h2>
          <p className="text-slate-500 mb-6">
            La convocation pour cette session n'est pas disponible.
          </p>
          <button
            onClick={() => navigate('/etudiant/resultats')}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors"
          >
            Retour aux résultats
          </button>
        </div>
      </div>
    );
  }

  const { student, session } = convocation;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="bg-white rounded-[40px] p-12 shadow-lg">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-800 mb-2">CONVOCATION</h1>
          <p className="text-slate-600">Session d'examen {session?.name || ''}</p>
        </div>

        {/* Informations de l'étudiant */}
        <div className="bg-slate-50 rounded-[24px] p-6 mb-6">
          <h2 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
            <User size={24} />
            Informations du candidat
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Nom complet</p>
              <p className="font-semibold text-slate-800">
                {student?.first_name} {student?.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Matricule</p>
              <p className="font-semibold text-slate-800">{student?.matricule}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Date de naissance</p>
              <p className="font-semibold text-slate-800">
                {student?.birth_date ? new Date(student.birth_date).toLocaleDateString('fr-FR') : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Niveau</p>
              <p className="font-semibold text-slate-800">{student?.class_level}</p>
            </div>
          </div>
        </div>

        {/* Informations de l'école */}
        {student?.school && (
          <div className="bg-slate-50 rounded-[24px] p-6 mb-6">
            <h2 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <School size={24} />
              Établissement
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Nom de l'établissement</p>
                <p className="font-semibold text-slate-800">{student.school.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Code établissement</p>
                <p className="font-semibold text-slate-800">{student.school.establishment_code}</p>
              </div>
            </div>
          </div>
        )}

        {/* Informations de la session */}
        {session && (
          <div className="bg-blue-50 rounded-[24px] p-6 mb-6">
            <h2 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <Calendar size={24} />
              Détails de la session
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Nom de la session</p>
                <p className="font-semibold text-slate-800">{session.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Statut</p>
                <p className="font-semibold text-slate-800 capitalize">{session.status}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Date de début</p>
                <p className="font-semibold text-slate-800">
                  {session.start_date ? new Date(session.start_date).toLocaleDateString('fr-FR') : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Date de fin</p>
                <p className="font-semibold text-slate-800">
                  {session.end_date ? new Date(session.end_date).toLocaleDateString('fr-FR') : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-[24px] p-6 mb-6">
          <h3 className="font-black text-slate-800 mb-3">Instructions importantes</h3>
          <ul className="space-y-2 text-slate-700">
            <li>• Présentez-vous avec cette convocation et une pièce d'identité</li>
            <li>• Arrivez au moins 30 minutes avant le début de l'examen</li>
            <li>• Apportez le matériel autorisé (stylo, calculatrice si autorisée, etc.)</li>
            <li>• Le téléphone portable est strictement interdit dans la salle d'examen</li>
          </ul>
        </div>

        {/* Bouton de téléchargement */}
        <div className="flex justify-center">
          <button
            onClick={handleDownload}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors flex items-center gap-3 shadow-lg"
          >
            <Download size={20} />
            Télécharger la convocation (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaConvocation;



