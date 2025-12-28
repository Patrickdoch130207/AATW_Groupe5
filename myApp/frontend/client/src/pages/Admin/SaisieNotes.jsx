import { useState, useEffect } from 'react';
import { Search, Edit2, Save, X, User, BookOpen } from 'lucide-react';
import { candidateService, gradeService } from '../../services/api';

const SaisieNotes = () => {
    const [candidates, setCandidates] = useState([]);
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCandidates();
    }, []);

    useEffect(() => {
        setFilteredCandidates(
            candidates.filter(c =>
                c.last_name.toLowerCase().includes(search.toLowerCase()) ||
                c.first_name.toLowerCase().includes(search.toLowerCase()) ||
                (c.matricule && c.matricule.toLowerCase().includes(search.toLowerCase()))
            )
        );
    }, [search, candidates]);

    const fetchCandidates = async () => {
        try {
            const res = await candidateService.getAll();
            setCandidates(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectCandidate = async (candidate) => {
        setSelectedCandidate(candidate);
        setLoading(true);
        try {
            const res = await gradeService.getByCandidate(candidate.id);
            setGrades(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGradeChange = (subjectId, value) => {
        // Basic validation 0-20
        if (value > 20) value = 20;
        if (value < 0) value = 0;

        setGrades(grades.map(g =>
            g.subject_id === subjectId ? { ...g, score: value } : g
        ));
    };

    const handleSaveGrades = async () => {
        setSaving(true);
        try {
            await gradeService.save({
                candidate_id: selectedCandidate.id,
                grades: grades.map(g => ({ subject_id: g.subject_id, score: g.score }))
            });
            alert("Notes enregistrées avec succès !");
            setSelectedCandidate(null);
        } catch (err) {
            alert("Erreur lors de l'enregistrement");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Saisie des Notes</h1>
                    <p className="text-slate-500">Gestion des résultats d'examen</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Chercher un candidat..."
                        className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#1579de] outline-none w-80 shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* List of Candidates */}
                <div className="w-1/3 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-700">
                        Liste des Candidats ({filteredCandidates.length})
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {filteredCandidates.map(c => (
                            <button
                                key={c.id}
                                onClick={() => handleSelectCandidate(c)}
                                className={`w-full p-4 rounded-2xl text-left transition-all flex items-center justify-between group ${selectedCandidate?.id === c.id ? 'bg-[#1579de] text-white shadow-lg shadow-blue-200' : 'hover:bg-slate-50 text-slate-600'}`}
                            >
                                <div>
                                    <p className="font-bold text-sm">{c.last_name} {c.first_name}</p>
                                    <p className={`text-xs ${selectedCandidate?.id === c.id ? 'text-blue-100' : 'text-slate-400'}`}>{c.matricule || 'Sans Matricule'}</p>
                                </div>
                                <Edit2 size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity ${selectedCandidate?.id === c.id ? 'text-white' : 'text-slate-400'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grade Entry Form */}
                <div className="flex-1 bg-white rounded-[32px] border border-slate-100 shadow-sm flex flex-col relative overflow-hidden">
                    {!selectedCandidate ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                            <BookOpen size={64} className="mb-4 text-slate-200" />
                            <p className="font-bold">Sélectionnez un candidat pour saisir ses notes</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 text-[#1579de] rounded-2xl flex items-center justify-center font-bold text-xl">
                                        {selectedCandidate.first_name[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-800">{selectedCandidate.last_name} {selectedCandidate.first_name}</h2>
                                        <p className="text-sm font-bold text-slate-400">Série {selectedCandidate.series_name} • Matricule {selectedCandidate.matricule}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedCandidate(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8">
                                {loading ? (
                                    <div className="text-center py-10">Chargement des matières...</div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-6">
                                        {grades.map(grade => (
                                            <div key={grade.subject_id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="font-bold text-slate-700">{grade.name}</label>
                                                    <span className="text-xs font-black bg-white px-2 py-1 rounded border border-slate-200 text-slate-400">Coef. {grade.coefficient}</span>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        min="0" max="20" step="0.25"
                                                        className="w-full text-3xl font-black text-center bg-white border-2 border-transparent focus:border-[#1579de] hover:border-slate-200 rounded-xl py-3 outline-none transition-all placeholder-slate-200 text-slate-800"
                                                        placeholder="Note"
                                                        value={grade.score || ''}
                                                        onChange={(e) => handleGradeChange(grade.subject_id, e.target.value)}
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-300 text-sm">/20</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-slate-100 bg-white/80 backdrop-blur-md absolute bottom-0 w-full">
                                <button
                                    onClick={handleSaveGrades}
                                    disabled={saving}
                                    className="w-full py-4 bg-[#1d6d1f] hover:bg-green-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? 'Enregistrement...' : <><Save /> Enregistrer les Notes</>}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SaisieNotes;
