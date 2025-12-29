
import { useState, useEffect } from "react";
import {
  UserPlus,
  Image as ImageIcon,
  Save,
  GraduationCap,
} from "lucide-react";
import {
  candidateService,
  commonService,
  authService,
} from "../../services/api";
import { useNavigate } from "react-router-dom";

const InscriptionCandidats = () => {
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);
  const [formData, setFormData] = useState({

    first_name: "",
    last_name: "",
    birth_date: "",
    pob: "",
    series: "",
    gender: "M",
    class_level: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    commonService
      .getSeries()
      .then((res) => setSeries(res.data))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = authService.getCurrentUser();

    try {
      // Use FormData for file upload
      const data = new FormData();

      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append("school_user_id", user.id);
      if (photoFile) {
        data.append("photo", photoFile);
      }

      await candidateService.create(data);

      navigate("/ecole/candidats");
    } catch (err) {
      alert(
        "Erreur lors de l'inscription: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* En-tête de la carte */}
      <div className="bg-gradient-to-r from-[#1579de] to-[#2ecc71] rounded-t-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-xl border border-white/30 shadow-inner">
            <UserPlus size={32} strokeWidth={2.5} />
          </div>
          <div>

            <h1 className="text-3xl font-black uppercase tracking-wide drop-shadow-sm">
              Fiche Candidat
            </h1>
            <p className="opacity-90 font-medium text-lg mt-1 tracking-tight">
              Inscription à la session en cours
            </p>
          </div>
        </div>
      </div>

      {/* Corps du formulaire */}
      <div className="bg-white rounded-b-[40px] shadow-2xl shadow-slate-200 border-x border-b border-white p-10 md:p-14 -mt-6 pt-16 relative z-0">

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8"
        >
          {/* Section Identité Visuelle */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center mb-8">
            <div
              className="relative group cursor-pointer"
              onClick={() => document.getElementById("photo-upload").click()}
            >
              <div className="w-36 h-36 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[30px] flex flex-col items-center justify-center text-slate-400 group-hover:border-[#1579de] group-hover:text-[#1579de] transition-all duration-300 shadow-inner overflow-hidden">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <ImageIcon size={40} className="mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-center">
                      Photo <br />
                      (Facultatif)
                    </span>
                  </>
                )}
              </div>
              <div className="absolute -bottom-3 -right-3 bg-[#1579de] text-white p-2 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform">
                <UserPlus size={16} />
              </div>
              <input
                type="file"
                id="photo-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-4">
              Cliquez pour choisir une photo
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">
              Nom de Famille
            </label>
            <input
              type="text"
              name="last_name"
              required
              onChange={handleChange}
              className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-[#1579de]/10 focus:border-[#1579de] outline-none transition-all font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-300"
              placeholder="ex: ADAGBE"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">
              Prénoms
            </label>
            <input
              type="text"
              name="first_name"
              required
              onChange={handleChange}
              className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-[#1579de]/10 focus:border-[#1579de] outline-none transition-all font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-300"
              placeholder="ex: Jean-Marc"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">
              Genre
            </label>
            <div className="relative">
              <select
                name="gender"
                required
                onChange={handleChange}
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-[#1579de]/10 focus:border-[#1579de] outline-none appearance-none font-bold text-slate-700 cursor-pointer"
              >
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>

          {/* Sélecteur de Classe */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">
              Classe
            </label>
            <select
              name="class_level"
              required
              onChange={handleChange}
              className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] font-bold text-slate-700"
            >
              <option value="">Choisir la classe...</option>
              <option value="6e">6ème</option>
              <option value="5e">5ème</option>
              <option value="4e">4ème</option>
              <option value="3e">3ème</option>
              <option value="2nde">Seconde</option>
              <option value="1re">Première</option>
              <option value="Tle">Terminale</option>
            </select>
          </div>

          {/* Sélecteur de Série - Affiché conditionnellement */}
          {["2nde", "1re", "Tle"].includes(formData.class_level) && (
            <div className="space-y-3 animate-in fade-in duration-500">
              <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">
                Série
              </label>
              <select
                name="series"
                required
                onChange={handleChange}
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] font-bold text-slate-700 border-blue-100"
              >
                <option value="">Choisir la série...</option>
                <optgroup label="Enseignement Général">
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </optgroup>
                <optgroup label="Technique & G2">
                  <option value="G1">G1</option>
                  <option value="G2">G2</option>
                  <option value="G3">G3</option>
                </optgroup>
              </select>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">
              Date de naissance
            </label>
            <input
              type="date"
              name="birth_date"
              required
              onChange={handleChange}
              className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-[#1579de]/10 focus:border-[#1579de] outline-none transition-all font-bold text-slate-700"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">
              Lieu de naissance
            </label>
            <input
              type="text"
              name="pob"
              required
              onChange={handleChange}
              className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-[#1579de]/10 focus:border-[#1579de] outline-none transition-all font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-300"
              placeholder="ex: Cotonou"
            />
          </div>

          <div className="col-span-1 md:col-span-2 pt-8">
            <button
              disabled={loading}
              className="w-full py-6 bg-gradient-to-r from-[#1d6d1f] to-[#27ae60] text-white rounded-[24px] font-black text-xl uppercase tracking-widest shadow-xl shadow-green-100 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-4 group"
            >
              <div className="bg-white/20 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                <Save size={24} />
              </div>
              {loading ? "Enregistrement..." : "Valider l'inscription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default InscriptionCandidats;
