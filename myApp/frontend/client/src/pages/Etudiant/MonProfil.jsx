import { UserPlus, Image as ImageIcon, Save, GraduationCap } from 'lucide-react';

const InscriptionCandidats = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="bg-[#1579de] p-8 text-white">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <UserPlus size={24} />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-wide">Fiche Candidat</h1>
          </div>
          <p className="opacity-80">Enregistrement d'un nouvel élève pour la session en cours</p>
        </div>

        <form className="p-10 grid grid-cols-2 gap-8">
          {/* Photo Upload */}
          <div className="col-span-2 flex justify-center">
            <div className="relative group">
              <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-slate-400 group-hover:border-[#1579de] group-hover:text-[#1579de] transition-all cursor-pointer">
                <ImageIcon size={32} />
                <span className="text-[10px] font-bold mt-2 uppercase">Photo d'identité</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase ml-2">Nom du candidat</label>
            <input type="text" className="w-full p-4 bg-slate-50 border-none rounded-[20px] focus:ring-2 focus:ring-[#1579de] outline-none" placeholder="Ex: DOSSO" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase ml-2">Prénoms</label>
            <input type="text" className="w-full p-4 bg-slate-50 border-none rounded-[20px] focus:ring-2 focus:ring-[#1579de] outline-none" placeholder="Ex: Koffi Marc" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase ml-2">Série / Filière</label>
            <select className="w-full p-4 bg-slate-50 border-none rounded-[20px] focus:ring-2 focus:ring-[#1579de] outline-none appearance-none">
              <option>F1 (Construction Mécanique)</option>
              <option>F2 (Électronique)</option>
              <option>F3 (Électrotechnique)</option>
              <option>F4 (Génie Civil)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase ml-2">Date de naissance</label>
            <input type="date" className="w-full p-4 bg-slate-50 border-none rounded-[20px] focus:ring-2 focus:ring-[#1579de] outline-none" />
          </div>

          <div className="col-span-2 pt-4">
            <button className="w-full py-5 bg-[#1d6d1f] text-white rounded-[24px] font-black uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-[#165217] transition-all flex items-center justify-center gap-3">
              <Save size={20} /> Valider l'inscription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InscriptionCandidats;