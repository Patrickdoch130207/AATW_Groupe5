import { useState, useEffect } from 'react';
import { Search, MoreVertical, FileText, Download } from 'lucide-react';
import { candidateService, authService } from '../../services/api';

const MesCandidats = () => {
  const [candidats, setCandidats] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    if (user && user.id) {
      candidateService.getBySchool(user.id).then(res => {
        setCandidats(res.data);
      }).catch(err => console.error(err));
    }
  }, [user]);

  const filteredCandidats = candidats.filter(c =>
    c.last_name.toLowerCase().includes(search.toLowerCase()) ||
    c.first_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.matricule && c.matricule.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Nos Candidats</h1>
          <p className="text-slate-500">Total : {filteredCandidats.length} élèves</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#1579de] outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50"><Download size={20} /></button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-6 text-xs font-black uppercase text-slate-400">Candidat</th>
              <th className="p-6 text-xs font-black uppercase text-slate-400">Série</th>
              <th className="p-6 text-xs font-black uppercase text-slate-400">Identifiants</th>
              <th className="p-6 text-xs font-black uppercase text-slate-400">Accès</th>
              <th className="p-6 text-xs font-black uppercase text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredCandidats.length === 0 ? (
              <tr><td colSpan="4" className="p-6 text-center text-slate-500">Aucun candidat trouvé.</td></tr>
            ) : filteredCandidats.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[18px] bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                      {c.first_name[0]}{c.last_name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{c.last_name} {c.first_name}</p>
                      <p className="text-xs text-slate-400">Né le {new Date(c.dob).toLocaleDateString()}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 font-bold text-slate-600">{c.series_name}</td>
                <td className="p-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Matricule</span>
                    <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded text-slate-700">{c.matricule || 'N/A'}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase mt-1">Num. Table</span>
                    <span className="font-mono text-sm font-black text-[#1579de]">{c.table_number || '---'}</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Mot de Passe</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm bg-orange-50 text-[#ec8626] px-2 py-1 rounded border border-orange-100">{c.password || '******'}</span>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-right flex justify-end gap-2">
                  <button
                    onClick={() => window.open(`/print/transcript/${c.id}`, '_blank')}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    title="Télécharger Relevé de Notes"
                  >
                    <FileText size={18} />
                  </button>
                  <button
                    onClick={() => window.open(`/print/convocation/${c.id}`, '_blank')}
                    className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Télécharger Convocation"
                  >
                    <Download size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MesCandidats;