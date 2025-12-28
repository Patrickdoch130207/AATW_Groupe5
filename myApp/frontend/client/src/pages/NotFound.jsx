import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle, BookOpen } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
            {/* Decorative Background Elements */}
            <div className="fixed top-20 left-20 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            <div className="fixed bottom-20 right-20 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

            <div className="bg-white p-12 rounded-[40px] shadow-2xl shadow-blue-900/5 max-w-lg w-full border border-slate-100 relative overflow-hidden">
                {/* Large 404 Text */}
                <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 transform rotate-3 shadow-lg shadow-red-100">
                            <AlertTriangle size={48} strokeWidth={2.5} />
                        </div>
                    </div>

                    <h1 className="text-8xl font-black text-slate-800 tracking-tighter mb-2">404</h1>
                    <h2 className="text-2xl font-bold text-slate-700 mb-4 uppercase tracking-wide">Page Introuvable</h2>

                    <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                        Oups ! Il semblerait que vous ayez séché les cours d'orientation. Cette page n'existe pas ou a été déplacée.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-4 bg-[#1579de] text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <Home size={20} /> Retour à l'accueil
                        </button>

                        <button
                            onClick={() => navigate(-1)}
                            className="w-full py-4 bg-white text-slate-600 border-2 border-slate-100 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                        >
                            Revenir en arrière
                        </button>
                    </div>
                </div>

                {/* Decorative Icons */}
                <BookOpen className="absolute -bottom-10 -right-10 text-slate-50 w-64 h-64 rotate-12 z-0" />
            </div>

            <p className="mt-8 text-slate-400 font-bold text-sm uppercase tracking-widest">ExamFlow • Système de Gestion</p>
        </div>
    );
};

export default NotFound;
