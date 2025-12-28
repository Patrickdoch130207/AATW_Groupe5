<<<<<<< HEAD:myApp/frontend/client/src/pages/Ecole/MesCandidats.jsx
import { useState, useEffect } from 'react';
import { Search, MoreVertical, FileText, Download } from 'lucide-react';
import { candidateService, authService } from '../../services/api';
=======
import { useState, useEffect } from "react";
import { Search, FileText, Download, Copy, Mail, Key } from "lucide-react";
import { candidateService, authService } from "../../services/api";
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Ecole/MesCandidats.jsx

const MesCandidats = () => {
  const [candidats, setCandidats] = useState([]);
  const [search, setSearch] = useState("");
<<<<<<< HEAD:myApp/frontend/client/src/pages/Ecole/MesCandidats.jsx
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
=======
  const [user] = useState(authService.getCurrentUser());

  useEffect(() => {
    if (user && user?.id) {
      candidateService.getBySchool(user.id).then((res) => {
          const data = res.data.students || res.data;
          setCandidats(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error("Erreur lors de la récupération des élèves:", err));
    }
  }, [user]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copié !");
  };

  const filteredCandidats = candidats.filter(
    (c) =>
      c.last_name.toLowerCase().includes(search.toLowerCase()) ||
      c.first_name.toLowerCase().includes(search.toLowerCase()) ||
      c.matricule.toString().includes(search)
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
                      {c.first_name[0]}
                      {c.last_name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 uppercase">
                        {c.last_name} {c.first_name}
                      </p>
                      <p className="text-xs text-slate-400 font-medium italic">
                        Matricule: {c.matricule}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-black text-slate-600 mr-2">
                    {c.class_level}
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {c.series || "Sans Série"}
                  </span>
                </td>
                <td className="p-6">
                  <div className="space-y-2">
                    {/* Email / Login */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-blue-50/50 px-3 py-1.5 rounded-lg border border-blue-100 w-full justify-between">
                        <div className="flex items-center gap-2 truncate">
                          <Mail size={14} className="text-blue-500" />
                          <span className="font-mono text-xs font-bold text-blue-700 truncate">
                            {c.user?.email}
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
                    {/* Password */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-orange-50/50 px-3 py-1.5 rounded-lg border border-orange-100 w-full justify-between">
                        <div className="flex items-center gap-2">
                          <Key size={14} className="text-orange-500" />
                          <span className="font-mono text-xs font-bold text-orange-700">
                            {c.temp_password || "******"}
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
                    <button className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      <FileText size={18} />
                    </button>
                    <button className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm">
                      <Download size={18} />
                    </button>
                  </div>
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Ecole/MesCandidats.jsx
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

<<<<<<< HEAD:myApp/frontend/client/src/pages/Ecole/MesCandidats.jsx
export default MesCandidats;
=======
export default MesCandidats;
>>>>>>> b52ae4f9 (Liaison des pages de connexion et gestion des roles utilisateurs):myApp/frontend/src/pages/Ecole/MesCandidats.jsx
