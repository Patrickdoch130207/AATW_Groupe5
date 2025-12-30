import { useEffect, useState } from 'react';
import { Trophy, FileText, Download, AlertTriangle, Loader2, Clock } from 'lucide-react';
import { studentService } from '../../services/api';

const Resultats = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true);
      try {
        const response = await studentService.getMyResults();
        if (response?.success && response?.data) {
          setResults(response.data);
          // Sélectionner le résultat le plus récent par défaut
          if (response.data.length > 0) {
            setSelectedResult(response.data[0]);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des résultats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <div className="bg-white rounded-[40px] p-12 text-center shadow-lg">
          <AlertTriangle className="text-slate-400 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-black text-slate-800 mb-2">Aucun résultat disponible</h2>
          <p className="text-slate-500">Vous n'avez pas encore de résultats d'examen.</p>
        </div>
      </div>
    );
  }

  const currentResult = selectedResult || results[0];
  const isAdmis = currentResult?.decision === 'Admis';
  const average = currentResult?.average || 0;

  return (
    <div className="max-w-4xl mx-auto py-10">
      {/* Sélecteur de session */}
      {results.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Sélectionner une session :
          </label>
          <select
            value={currentResult?.id}
            onChange={(e) => {
              const result = results.find(r => r.id === parseInt(e.target.value));
              setSelectedResult(result);
            }}
            className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold"
          >
            {results.map((result) => (
              <option key={result.id} value={result.id}>
                {result.session?.name || `Session ${result.id}`} - {result.session?.start_date}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Carte principale de résultat */}
      {!currentResult?.is_validated ? (
        <div className="bg-slate-800 rounded-[40px] p-12 text-center shadow-2xl mb-8 shadow-slate-200">
          <div className="w-24 h-24 bg-white/20 rounded-[32px] flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/30">
            <Clock className="text-white" size={48} />
          </div>
          <h1 className="text-4xl font-black text-white uppercase mb-2">
            Résultats en attente
          </h1>
          <p className="text-white/80 text-lg mb-8">
            La délibération pour la session {currentResult?.session?.name} est en cours de validation par l'administration.
          </p>
          <div className="bg-white/10 rounded-[24px] p-6 max-w-sm mx-auto backdrop-blur-sm border border-white/10">
            <p className="text-xs text-white/60 uppercase font-black mb-1">Statut</p>
            <p className="text-2xl font-black text-white uppercase">Publication Prochaine</p>
          </div>
        </div>
      ) : (
        <div className={`rounded-[40px] p-12 text-center shadow-2xl mb-8 ${isAdmis ? 'bg-[#1d6d1f] shadow-green-200' :
          currentResult?.decision === 'Ajourné' ? 'bg-orange-500 shadow-orange-200' :
            'bg-slate-800 shadow-slate-200'
          }`}>
          <div className="w-24 h-24 bg-white/20 rounded-[32px] flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/30">
            {isAdmis ? (
              <Trophy className="text-white" size={48} />
            ) : (
              <AlertTriangle className="text-white" size={48} />
            )}
          </div>
          <h1 className="text-4xl font-black text-white uppercase mb-2">
            {isAdmis ? "Félicitations !" : currentResult?.decision || "Résultats"}
          </h1>
          <p className="text-white/80 text-lg mb-8">
            {isAdmis
              ? `Vous êtes admis à l'examen ${currentResult?.session?.name || ''} avec une moyenne de ${average.toFixed(2)}/20.`
              : currentResult?.decision === 'Ajourné'
                ? `Vous êtes ajourné avec une moyenne de ${average.toFixed(2)}/20.`
                : `Moyenne : ${average.toFixed(2)}/20`}
          </p>

          <div className="bg-white/10 rounded-[24px] p-6 max-w-sm mx-auto backdrop-blur-sm border border-white/10">
            <p className="text-xs text-white/60 uppercase font-black mb-1">Moyenne Générale</p>
            <p className="text-3xl font-black text-white">{average.toFixed(2)} / 20</p>
            {currentResult?.session && (
              <p className="text-sm text-white/70 mt-2">{currentResult.session.name}</p>
            )}
          </div>
        </div>
      )}

      {/* Détails des notes par matière */}
      {currentResult?.is_validated && currentResult?.subjects && currentResult.subjects.length > 0 && (
        <div className="bg-white rounded-[32px] p-8 mb-8 shadow-lg">
          <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">Détail des notes</h3>
          <div className="space-y-3">
            {currentResult.subjects.map((subject) => (
              <div key={subject.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex-1">
                  <p className="font-bold text-slate-800 uppercase text-sm">{subject.name}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Coefficient: {subject.coefficient || subject.coef}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-800">
                    {subject.note !== null ? `${Number(subject.note).toFixed(2)}` : 'N/A'}
                  </p>
                  <p className="text-xs text-slate-400 font-bold">/ 20</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-wider">Relevé de Notes</h3>
            <p className="text-xs text-slate-400 font-bold leading-relaxed">
              {currentResult?.is_validated ? 'Format Officiel' : 'Disponible après validation'}
            </p>
          </div>
          <button
            onClick={() => window.open(`/print/transcript/${currentResult?.session?.id}`, '_blank')}
            disabled={!currentResult?.is_validated}
            className={`p-4 rounded-2xl transition-all shadow-lg ${currentResult?.is_validated
              ? 'bg-[#1579de] text-white hover:scale-110 shadow-blue-100'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
          >
            <Download size={20} />
          </button>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-wider">Convocation</h3>
            <p className="text-xs text-slate-400 font-bold">
              {currentResult?.session?.name || 'Session en cours'}
            </p>
          </div>
          <button
            onClick={() => window.open(`/print/convocation/${currentResult?.session?.id}`, '_blank')}
            className="p-4 bg-slate-800 text-white rounded-2xl hover:scale-110 transition-all shadow-lg shadow-slate-200"
          >
            <FileText size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resultats;
