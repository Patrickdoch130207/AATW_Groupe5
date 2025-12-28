import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { candidateService } from "../services/api";

const PrintLayout = ({ type }) => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (type === 'transcript') {
            candidateService.getTranscript(id).then(res => setData(res.data)).finally(() => setLoading(false));
        } else {
            // Mock convocation call or real if exists. Assuming candidateService has it or similar.
            // Actually I need to add getConvocation to service or reuse transcript endpoint if it has enough info?
            // Let's assume we fetch standard candidate info + session info which is in transcript endpoint too.
            candidateService.getTranscript(id).then(res => setData(res.data)).finally(() => setLoading(false));
        }
    }, [id, type]);

    useEffect(() => {
        if (!loading && data) {
            setTimeout(() => window.print(), 500);
        }
    }, [loading, data]);

    if (loading) return <div className="p-10 text-center">Chargement du document...</div>;
    if (!data) return <div className="p-10 text-center text-red-500">Document introuvable.</div>;

    const { candidate, grades, average, status, mention } = data;

    const StatusBadge = ({ status }) => {
        let colors = "bg-slate-100 text-slate-500";
        if (status === 'ADMIS') colors = "bg-green-100 text-green-700 border-green-200";
        if (status === 'REFUSÉ') colors = "bg-red-100 text-red-700 border-red-200";
        if (status === 'AJOURNÉ') colors = "bg-blue-100 text-blue-700 border-blue-200";
        return (
            <div className={`px-6 py-2 rounded-full border font-black text-xl uppercase tracking-widest ${colors}`}>
                {status}
            </div>
        );
    };

    const Watermark = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] select-none z-0 flex flex-wrap justify-center content-center rotate-[-35deg] scale-150">
            {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="text-4xl font-black p-8 whitespace-nowrap">
                    OFFICE DU BACCALAURÉAT OFFICE DU BACCALAURÉAT
                </div>
            ))}
        </div>
    );

    if (type === 'convocation') {
        return (
            <div className="max-w-[21cm] mx-auto bg-white p-12 min-h-[29.7cm] text-slate-900 font-['Poppins'] relative overflow-hidden border-[16px] border-double border-slate-100 print:border-none">
                <Watermark />

                <div className="relative z-10">
                    {/* Header Officiel */}
                    <div className="flex justify-between items-start mb-12">
                        <div className="text-center w-64">
                            <h3 className="text-xs font-bold uppercase leading-tight">République du Bénin</h3>
                            <div className="w-12 h-[2px] bg-slate-200 mx-auto my-1"></div>
                            <p className="text-[10px] font-medium leading-tight">Ministère de l'Enseignement Supérieur et de la Recherche Scientifique</p>
                            <div className="w-8 h-[1px] bg-slate-200 mx-auto my-1"></div>
                            <p className="text-[9px] uppercase font-bold text-slate-400">Office du Baccalauréat</p>
                        </div>

                        <div className="w-24 h-24 bg-slate-50 rounded-2xl border-2 border-slate-100 flex items-center justify-center overflow-hidden shadow-inner">
                            {candidate.photo_url ? (
                                <img src={candidate.photo_url.startsWith('http') ? candidate.photo_url : `http://localhost:8000/${candidate.photo_url}`} alt="Photo" className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-black text-slate-200 text-xl italic uppercase">
                                    {candidate.first_name?.[0]}{candidate.last_name?.[0]}
                                </span>
                            )}
                        </div>

                        <div className="text-center w-64">
                            <p className="text-[10px] font-bold">OFFICE DU BACCALAURÉAT</p>
                            <p className="text-[10px]">Cotonou, le {new Date().toLocaleDateString('fr-FR')}</p>
                        </div>
                    </div>

                    <div className="text-center mb-12">
                        <div className="inline-block px-10 py-4 border-4 border-slate-900 mb-4 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
                            <h1 className="text-4xl font-black uppercase tracking-tighter">CONVOCATION</h1>
                        </div>
                        <p className="text-xl font-bold text-slate-600 uppercase tracking-widest">
                            {candidate.session_name}
                        </p>
                    </div>

                    <div className="grid grid-cols-12 gap-10 mb-12">
                        <div className="col-span-7 space-y-6">
                            <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Identité du Candidat</p>
                                <div className="space-y-3">
                                    <p className="text-2xl font-black uppercase leading-none">{candidate.last_name}</p>
                                    <p className="text-xl font-bold text-[#1579de]">{candidate.first_name}</p>
                                    <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Né(e) le</p>
                                            <p className="font-bold">{new Date(candidate.dob).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">à</p>
                                            <p className="font-bold">{candidate.pob}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-5 space-y-6">
                            <div className="p-6 bg-[#1579de] text-white rounded-3xl shadow-xl shadow-blue-200">
                                <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-4">Accès Examen</p>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold opacity-60">Matricule</p>
                                        <p className="text-2xl font-mono font-black">{candidate.matricule}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold opacity-60">N° de Table</p>
                                        <p className="text-4xl font-black tracking-tighter">{candidate.table_number || '---'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-900 p-8 rounded-[32px] mb-12 relative overflow-hidden">
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-2xl rotate-3">
                                {candidate.series_name?.[0]}
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-black text-slate-400">Lieu de Composition</p>
                                <p className="text-2xl font-black uppercase text-slate-900">{candidate.center_name || candidate.school_name || 'Centre National'}</p>
                                <p className="text-sm font-black text-[#ec8626] uppercase tracking-widest mt-1">{candidate.series_name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-end mt-20 italic">
                        <p className="text-[10px] font-medium max-w-xs text-slate-400">
                            * Présentation obligatoire d'une pièce d'identité en cours de validité.
                            Tout candidat surpris en flagrant délit de fraude sera immédiatement exclu.
                        </p>
                        <div className="text-center border-t-2 border-slate-900 pt-2 w-64">
                            <p className="text-xs font-black uppercase">Le Directeur des Examens</p>
                            <div className="h-20"></div>
                            <p className="text-[10px] font-bold">Signé électroniquement</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Transcript View (Relevé de Notes)
    return (
        <div className="max-w-[21cm] mx-auto bg-white p-12 min-h-[29.7cm] text-slate-900 font-['Poppins'] relative overflow-hidden print:p-8">
            <Watermark />

            <div className="relative z-10">
                <header className="flex justify-between items-center mb-10 border-b-4 border-slate-900 pb-8">
                    <div>
                        <h2 className="text-sm font-black uppercase text-slate-400 tracking-[0.2em] mb-1">RELEVÉ DE NOTES OFFICIEL</h2>
                        <h1 className="text-4xl font-black tracking-tighter uppercase whitespace-pre">
                            BACCALAURÉAT <span className="text-[#1579de]">{candidate.session_name.split(' ')[1] || ''}</span>
                        </h1>
                        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">{candidate.session_name}</p>
                    </div>
                    <div className="text-right flex items-center gap-6">
                        <div className="w-20 h-20 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center">
                            {candidate.photo_url ? (
                                <img src={candidate.photo_url.startsWith('http') ? candidate.photo_url : `http://localhost:8000/${candidate.photo_url}`} alt="Photo" className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-black text-slate-200 text-lg uppercase">
                                    {candidate.first_name?.[0]}{candidate.last_name?.[0]}
                                </span>
                            )}
                        </div>
                        <div>
                            <div className="text-2xl font-black bg-slate-900 text-white px-4 py-2 rounded-xl inline-block mb-2">
                                {candidate.series_name}
                            </div>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-tight">Etab: <span className="text-slate-900">{candidate.school_name}</span></p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-2 gap-12 mb-10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Identité du Candidat</p>
                        <p className="text-2xl font-black uppercase">{candidate.last_name}</p>
                        <p className="text-xl font-bold text-slate-600">{candidate.first_name}</p>
                        <p className="text-sm font-medium pt-2 italic text-slate-500">Né(e) le {new Date(candidate.dob).toLocaleDateString()} à {candidate.pob}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Matricule Officiel / Centre</p>
                        <p className="text-3xl font-mono font-black tracking-tighter">{candidate.matricule}</p>
                        <p className="text-xs font-black text-slate-400 uppercase mt-1">{candidate.center_name || 'Centre National'}</p>
                    </div>
                </div>

                <table className="w-full mb-10 border-spacing-0 border-collapse">
                    <thead>
                        <tr className="bg-slate-900 text-white">
                            <th className="text-left p-4 uppercase text-[10px] font-black tracking-widest rounded-tl-2xl">Matière</th>
                            <th className="text-center p-4 uppercase text-[10px] font-black tracking-widest">Note / 20</th>
                            <th className="text-center p-4 uppercase text-[10px] font-black tracking-widest">Coef.</th>
                            <th className="text-right p-4 uppercase text-[10px] font-black tracking-widest rounded-tr-2xl">Total Pts</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {grades.map((g, i) => (
                            <tr key={i} className="group transition-colors hover:bg-slate-50 border-b border-slate-100">
                                <td className="p-4 font-bold text-slate-700 uppercase text-sm">{g.subject_name}</td>
                                <td className="p-4 text-center font-black text-lg">{Number(g.score).toFixed(2)}</td>
                                <td className="p-4 text-center font-bold text-slate-400">×{g.coefficient}</td>
                                <td className="p-4 text-right font-black text-slate-900">{(g.score * g.coefficient).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-slate-50">
                            <td colSpan="3" className="p-6 text-right font-black uppercase text-slate-400 tracking-widest">Total des Points Obtenus</td>
                            <td className="p-6 text-right font-black text-2xl text-slate-900">
                                {grades.reduce((acc, g) => acc + (g.score * g.coefficient), 0).toFixed(2)}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                <div className="flex justify-between items-center mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Moyenne Générale:</div>
                            <div className="text-5xl font-black tracking-tighter text-slate-900">{average} <span className="text-xl text-slate-400">/ 20</span></div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Mention obtenue:</div>
                            <div className="text-2xl font-black text-[#ec8626] uppercase">{mention}</div>
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Décision Finale</p>
                        <StatusBadge status={status} />
                    </div>
                </div>

                <footer className="mt-20 border-t-2 border-slate-100 pt-8 flex justify-between">
                    <div className="max-w-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
                            Ce relevé de notes est confidentiel et unique. Il ne peut être reproduit sans autorisation de l'Office du Baccalauréat.
                            Toute rature ou surcharge l'annule de plein droit.
                        </p>
                    </div>
                    <div className="text-center w-64 border-2 border-slate-900 p-4 rounded-3xl bg-slate-50/50">
                        <p className="text-[10px] font-black uppercase underline mb-8">Visa de l'autorité</p>
                        <div className="h-12"></div>
                        <p className="text-[9px] font-bold text-slate-400">Généré par ExamFlow OS</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default PrintLayout;
