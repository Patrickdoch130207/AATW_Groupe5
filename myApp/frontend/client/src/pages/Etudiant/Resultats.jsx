import { Trophy, FileText, Download, AlertTriangle } from 'lucide-react';

const Resultats = () => {
  const isAdmis = true; // Simuler le résultat

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className={`rounded-[40px] p-12 text-center shadow-2xl ${isAdmis ? 'bg-[#1d6d1f] shadow-green-200' : 'bg-slate-800 shadow-slate-200'}`}>
        <div className="w-24 h-24 bg-white/20 rounded-[32px] flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/30">
          {isAdmis ? <Trophy className="text-white" size={48} /> : <AlertTriangle className="text-white" size={48} />}
        </div>
        <h1 className="text-4xl font-black text-white uppercase mb-2">
          {isAdmis ? "Félicitations !" : "Résultats Session 2025"}
        </h1>
        <p className="text-white/80 text-lg mb-8">
          {isAdmis ? "Vous êtes admis à l'examen du BAC Technique avec mention." : "Malheureusement, vous n'êtes pas admis."}
        </p>
        
        <div className="bg-white/10 rounded-[24px] p-6 max-w-sm mx-auto backdrop-blur-sm border border-white/10">
          <p className="text-xs text-white/60 uppercase font-black mb-1">Moyenne Générale</p>
          <p className="text-3xl font-black text-white">14.85 / 20</p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-800">Relevé de Notes</h3>
            <p className="text-sm text-slate-400">Format PDF officiel</p>
          </div>
          <button className="p-4 bg-[#1579de] text-white rounded-2xl hover:scale-110 transition-transform shadow-lg shadow-blue-100">
            <Download size={20} />
          </button>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-800">Convocation</h3>
            <p className="text-sm text-slate-400">Archives session 2025</p>
          </div>
          <button className="p-4 bg-slate-100 text-slate-400 rounded-2xl">
            <FileText size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resultats;