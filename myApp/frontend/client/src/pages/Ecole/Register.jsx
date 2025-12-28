import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, User, MapPin, FileCheck, Landmark, ArrowRight, Loader2, Info } from 'lucide-react';
import { authService } from '../../services/api';

const RegisterEcole = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 1. Initialisation avec département vide pour forcer le choix
  const [formData, setFormData] = useState({
    nom_etablissement: '',
    nom_directeur: '',
    arrete_ministeriel: '',
    departement: '',
    ville: '',
    adresse_precise: '',
    email: '',
    password: ''
  });

  const departementsBenin = [
    "Alibori", "Atacora", "Atlantique", "Borgou",
    "Collines", "Couffo", "Donga", "Littoral",
    "Mono", "Ouémé", "Plateau", "Zou"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si on change de département, on réinitialise la ville pour la cohérence
    if (name === "departement") {
      setFormData({ ...formData, [name]: value, ville: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.departement) {
      alert("Veuillez sélectionner un département.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: formData.email, // Use email as username for now
        email: formData.email,
        password: formData.password,
        school_name: formData.nom_etablissement,
        director_name: formData.nom_directeur,
        decree_number: formData.arrete_ministeriel,
        department: formData.departement,
        city: formData.ville,
        address: formData.adresse_precise
      };

      const response = await authService.registerSchool(payload);
      if (response.data.success) {
        alert("Demande d'agrément envoyée avec succès !");
        navigate('/login');
      }
    } catch (error) {
      console.error("Erreur Backend:", error);
      alert(error.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-[40px] shadow-2xl p-12 border border-gray-100">

        {/* Header */}
        <div className="flex items-center gap-6 mb-12 border-b border-gray-50 pb-8">
          <div className="w-16 h-16 bg-[#1d6d1f] rounded-2xl flex items-center justify-center shadow-xl shadow-green-100 rotate-3">
            <Landmark className="text-white w-9 h-9" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase">
              Exam<span className="text-[#1579de]">Flow</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Inscription d'un nouvel établissement</p>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              <Info className="w-4 h-4 text-[#1579de]" />
              Enregistrement officiel de l'établissement sur ExamFlow
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">

          {/* --- SECTION 1 : IDENTITÉ --- */}
          <div className="md:col-span-2 flex items-center gap-3 text-[#1579de] font-bold text-sm uppercase tracking-[0.2em] mb-2">
            <div className="h-[2px] w-8 bg-[#1579de]"></div>
            Informations Générales
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Nom de l'Établissement</label>
            <div className="relative group">
              <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1579de] transition-colors" />
              <input
                type="text" name="nom_etablissement" required
                value={formData.nom_etablissement} onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#1579de] transition-all border border-transparent focus:bg-white"
                placeholder="ex: Lycée d'Excellence"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Directeur / Promoteur</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1579de] transition-colors" />
              <input
                type="text" name="nom_directeur" required
                value={formData.nom_directeur} onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#1579de] transition-all border border-transparent focus:bg-white"
                placeholder="M. Jean Dupont"
              />
            </div>
          </div>

          {/* --- SECTION 2 : AUTORISATION --- */}
          <div className="md:col-span-2 flex items-center gap-3 text-[#ec8626] font-bold text-sm uppercase tracking-[0.2em] mt-6 mb-2">
            <div className="h-[2px] w-8 bg-[#ec8626]"></div>
            Cadre Légal
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Numéro de l'Arrêté Ministériel d'Ouverture</label>
            <div className="relative group">
              <FileCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#ec8626] transition-colors" />
              <input
                type="text" name="arrete_ministeriel" required
                value={formData.arrete_ministeriel} onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#ec8626] transition-all border border-transparent focus:bg-white font-mono"
                placeholder="N° 045/MESTFP/DC/SGM/SA..."
              />
            </div>
          </div>

          {/* --- SECTION 3 : LOCALISATION --- */}
          <div className="md:col-span-2 flex items-center gap-3 text-[#1d6d1f] font-bold text-sm uppercase tracking-[0.2em] mt-6 mb-2">
            <div className="h-[2px] w-8 bg-[#1d6d1f]"></div>
            Localisation Géographique
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Département</label>
            <select
              name="departement"
              required
              value={formData.departement}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#1d6d1f] transition-all border border-transparent focus:bg-white appearance-none cursor-pointer font-medium text-slate-600"
            >
              <option value="" disabled>Choisir un département</option>
              {departementsBenin.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Ville / Commune</label>
            <input
              type="text" name="ville" required
              value={formData.ville} onChange={handleChange}
              className="w-full px-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#1d6d1f] transition-all border border-transparent focus:bg-white"
              placeholder={formData.departement ? `Ville de l'${formData.departement}` : "Saisissez la ville"}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Adresse Précise (Quartier/Rue)</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1d6d1f] transition-colors" />
              <input
                type="text" name="adresse_precise" required
                value={formData.adresse_precise} onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#1d6d1f] transition-all border border-transparent focus:bg-white"
                placeholder="ex: Quartier Zongo, Carré 125"
              />
            </div>
          </div>

          {/* --- SECTION: COMPTE --- */}
          <div className="md:col-span-2 flex items-center gap-3 text-slate-700 font-bold text-sm uppercase tracking-[0.2em] mt-6 mb-2">
            <div className="h-[2px] w-8 bg-slate-700"></div>
            Identifiants de Connexion
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Professionnel</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-slate-700 transition-colors" />
              <input
                type="email" name="email" required
                value={formData.email} onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-slate-700 transition-all border border-transparent focus:bg-white"
                placeholder="direction@lycee-excellence.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Mot de passe</label>
            <div className="relative group">
              <input
                type="password" name="password" required
                value={formData.password} onChange={handleChange}
                className="w-full pl-4 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-slate-700 transition-all border border-transparent focus:bg-white"
                placeholder="Min 8 caractères"
              />
            </div>
          </div>

          {/* --- BOUTON D'ENVOI --- */}
          <div className="md:col-span-2 mt-10">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#1579de] disabled:bg-blue-300 text-white rounded-[20px] font-black text-xl shadow-2xl shadow-blue-100 hover:bg-blue-600 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-4 uppercase tracking-tighter"
            >
              {loading ? (
                <> <Loader2 className="animate-spin w-6 h-6" /> Traitement en cours... </>
              ) : (
                <> Soumettre le dossier d'inscription <ArrowRight className="w-6 h-6" /> </>
              )}
            </button>
            <p className="text-center text-gray-400 text-[11px] mt-6 leading-relaxed">
              En cliquant sur "Soumettre", vous engagez la responsabilité juridique de l'établissement.<br />
              Toute fausse déclaration entraînera le rejet immédiat du dossier.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterEcole;