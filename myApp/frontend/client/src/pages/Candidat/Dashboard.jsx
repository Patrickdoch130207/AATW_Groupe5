import { useState, useEffect } from 'react';
import { User, FileText, Download, Calendar, MapPin, Clock } from 'lucide-react';
import { authService, studentService } from '../../services/api';

const CandidatDashboard = () => {
    const [user] = useState(authService.getCurrentUser());
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await studentService.getMyResults();
                if (res.success && res.data && res.data.length > 0) {
                    setResult(res.data[0]); // Prend le résultat le plus récent
                }
            } catch (err) {
                console.error("Failed to fetch candidate results", err);
            } finally {
                setLoading(false);
            }
        };
        if (user?.id) fetchData();
    }, [user]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-[#1579de] rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold animate-pulse">Chargement de vos résultats...</p>
        </div>
    );

    // Si pas de résultats, afficher un message d'accueil simple
    if (!result) return (
        <div className="max-w-6xl mx-auto p-6 md:p-10">
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 text-center">
                <h1 className="text-3xl font-black text-slate-800 mb-4">Bienvenue, {user.first_name} !</h1>
                <p className="text-slate-500 mb-8">Vos résultats d'examen ne sont pas encore disponibles.</p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-full font-bold text-sm">
                    <Clock size={18} />
                    En attente de délibération
                </div>
            </div>
        </div>
    );

    // Adaptation des données pour l'affichage
    const candidate = user; // Utilise les infos de l'utilisateur connecté
    const status = result.decision;
    const average = result.average;
    const mention = average >= 16 ? 'TRÈS BIEN' : average >= 14 ? 'BIEN' : average >= 12 ? 'ASSEZ BIEN' : average >= 10 ? 'PASSABLE' : '---';
    const sessionName = result.session?.name || '---';

    const getStatusStyle = (s) => {
        const decision = s?.toUpperCase();
        if (decision === 'ADMIS') return 'bg-green-100 text-green-700 border-green-200';
        if (decision === 'REFUSÉ') return 'bg-red-100 text-red-700 border-red-200';
        if (decision === 'AJOURNÉ') return 'bg-slate-100 text-slate-500 border-slate-200';
        return 'bg-slate-50 text-slate-400';
    };

    const getStatusLabel = (s) => {
        return s?.toUpperCase() || 'EN ATTENTE';
    };

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-10">
            {/* Header Profile */}
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-10 mb-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>

                <div className="w-40 h-40 bg-slate-50 rounded-[40px] flex items-center justify-center shadow-inner overflow-hidden border-4 border-white shadow-slate-200/50">
                    <span className="text-5xl font-black text-slate-300 uppercase letter-spacing-widest">
                        {candidate.first_name?.[0]}{candidate.last_name?.[0]}
                    </span>
                </div>


                <div className="text-center md:text-left flex-1 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                        <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">
                            {candidate.first_name} <span className="text-[#1579de]">{candidate.last_name}</span>
                        </h1>
                        <span className={`inline-flex items-center px-6 py-2 rounded-full border-2 font-black text-xs tracking-widest uppercase ${getStatusStyle(status)}`}>
                            {getStatusLabel(status)}
                        </span>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                            Matricule: <span className="text-slate-800">{candidate.matricule || '---'}</span>
                        </span>
                        <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                            Session: <span className="text-[#1579de]">{sessionName}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Results Table Section */}
            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden mb-10">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#1579de]">
                            <FileText size={20} />
                        </div>
                        Récapitulatif de l'Examen
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                                <th className="p-6 text-left">Établissement</th>
                                <th className="p-6 text-left">Session</th>
                                <th className="p-6 text-center">Moyenne</th>
                                <th className="p-6 text-center">Mention</th>
                                <th className="p-6 text-right">Décision</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-bold text-slate-600">
                            <tr>
                                <td className="p-6 text-left max-w-xs">{candidate.school_name || user.school_name || '---'}</td>
                                <td className="p-6 text-left">{sessionName}</td>
                                <td className="p-6 text-center">
                                    <span className="text-xl font-black text-slate-800">{Number(average).toFixed(2)}</span>
                                    <span className="text-[10px] text-slate-400 ml-1">/20</span>
                                </td>
                                <td className="p-6 text-center">
                                    <span className="text-xs font-black text-[#ec8626] uppercase">{mention}</span>
                                </td>
                                <td className="p-6 text-right">
                                    <span className={`px-4 py-2 rounded-xl border font-black text-[10px] uppercase tracking-wider ${getStatusStyle(status)}`}>
                                        {getStatusLabel(status)}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Documents Card */}
                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl shadow-lg flex items-center justify-center">
                            <Download size={20} />
                        </div>
                        Mes Documents Officiels
                    </h2>

                    <div className="space-y-4">
                        {/* Convocation Button */}
                        <button
                            onClick={() => window.open(`/print/convocation/${result.session?.id}`, '_blank')}
                            className="w-full p-6 flex items-center justify-between bg-slate-50 hover:bg-slate-100 rounded-[24px] group transition-all border border-transparent hover:border-blue-100"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm group-hover:text-[#1579de] transition-all group-hover:scale-110">
                                    <FileText size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-slate-800 uppercase text-xs tracking-wider">Convocation</p>
                                    <p className="text-xs text-slate-400 font-bold">Session {sessionName}</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* Relevé Button */}
                        <button
                            disabled={!result.is_validated}
                            onClick={() => window.open(`/print/transcript/${result.session?.id}`, '_blank')}
                            className={`w-full p-6 flex items-center justify-between rounded-[24px] group transition-all border ${!result.is_validated ? 'bg-slate-50/50 opacity-50 cursor-not-allowed' : 'bg-slate-50 hover:bg-slate-100 border-transparent hover:border-green-100'}`}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm transition-all group-hover:scale-110 ${!result.is_validated ? 'text-slate-200' : 'text-slate-300 group-hover:text-[#2ecc71]'}`}>
                                    <FileText size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-slate-800 uppercase text-xs tracking-wider">Relevé de Notes</p>
                                    <p className="text-xs text-slate-400 font-bold">{!result.is_validated ? 'Pas encore disponible' : 'Disponible'}</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-gradient-to-br from-[#1579de] to-[#0d47a1] rounded-[40px] p-10 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full -mb-32 -mr-32 blur-3xl"></div>
                    <h2 className="text-xl font-black uppercase mb-8 relative z-10">À savoir</h2>
                    <ul className="space-y-6 relative z-10">
                        <li className="flex gap-4">
                            <div className="shrink-0 w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center text-xs font-bold">1</div>
                            <p className="text-sm font-medium leading-relaxed opacity-90">
                                Pour toute réclamation, veuillez contacter votre établissement d'origine : <span className="font-black underline">{candidate.school_name || user.school_name || 'Non spécifié'}</span>.
                            </p>
                        </li>
                        <li className="flex gap-4">
                            <div className="shrink-0 w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center text-xs font-bold">2</div>
                            <p className="text-sm font-medium leading-relaxed opacity-90">
                                Les résultats affichés ci-dessus sont authentifiés par l'administration.
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const ChevronRight = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m9 18 6-6-6-6" />
    </svg>
);

export default CandidatDashboard;
