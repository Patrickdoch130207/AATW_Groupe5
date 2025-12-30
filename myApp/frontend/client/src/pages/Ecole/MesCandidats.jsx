import { useState, useEffect } from "react";
import { Search, FileText, Download, Copy, Mail, Key } from "lucide-react";
import { candidateService, authService } from "../../services/api";

const MesCandidats = () => {
  const [candidats, setCandidats] = useState([]);
  const [search, setSearch] = useState("");
  const [user] = useState(authService.getCurrentUser());

  useEffect(() => {
    if (user && user?.id) {
      candidateService
        .getBySchool(user.id)
        .then((res) => {
          const data = res.data?.students || res.data;
          setCandidats(Array.isArray(data) ? data : []);
        })
        .catch((err) =>
          console.error("Erreur lors de la récupération des élèves:", err)
        );
    }
  }, [user]);

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
    alert('Copié !');
  };

  const filteredCandidats = candidats.filter((c) =>
    [
      c?.last_name?.toLowerCase(),
      c?.first_name?.toLowerCase(),
      c?.matricule ? String(c.matricule).toLowerCase() : '',
    ].some((v) => v?.includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
            Liste des Candidats
          </h1>
          <p className="text-slate-500 font-medium">
            Gestion des accès et inscriptions
          </p>
        </div>
        <div className="relative w-72">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Rechercher un élève..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-[#1579de] outline-none transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="p-6 text-xs font-black uppercase text-slate-400">
                Candidat
              </th>
              <th className="p-6 text-xs font-black uppercase text-slate-400">
                Niveau & Série
              </th>
              <th className="p-6 text-xs font-black uppercase text-slate-400">
                Accès Plateforme
              </th>
              <th className="p-6 text-xs font-black uppercase text-slate-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredCandidats.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-100">
                      {c?.first_name?.[0] || 'C'}
                      {c?.last_name?.[0] || 'D'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 uppercase">
                        {c.last_name} {c.first_name}
                      </p>
                      <p className="text-xs text-slate-400 font-medium italic">
                        Matricule: {c.matricule || '—'}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-6">
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-black text-slate-600 mr-2">
                    {c.class_level || 'N/A'}
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {c.series || c.series_name || (c.class_level === "3e" ? "Brevet" : "Sans Série")}
                  </span>
                </td>

                <td className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-blue-50/50 px-3 py-1.5 rounded-lg border border-blue-100 w-full justify-between">
                        <div className="flex items-center gap-2 truncate">
                          <Mail size={14} className="text-blue-500" />
                          <span className="font-mono text-xs font-bold text-blue-700 truncate">
                            {c.user?.email || '—'}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(c.user?.email)}
                          className="text-blue-400 hover:text-blue-600"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-orange-50/50 px-3 py-1.5 rounded-lg border border-orange-100 w-full justify-between">
                        <div className="flex items-center gap-2">
                          <Key size={14} className="text-orange-500" />
                          <span className="font-mono text-xs font-bold text-orange-700">
                            {c.temp_password || '******'}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(c.temp_password)}
                          className="text-orange-400 hover:text-orange-600"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => window.open(`/print/transcript/${c.id}`, '_blank')}
                      className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      title="Télécharger Relevé de Notes"
                    >
                      <FileText size={18} />
                    </button>
                    <button
                      onClick={() => window.open(`/print/convocation/${c.id}`, '_blank')}
                      className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                      title="Télécharger Convocation"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredCandidats.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-slate-500">
                  Aucun candidat trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MesCandidats;
