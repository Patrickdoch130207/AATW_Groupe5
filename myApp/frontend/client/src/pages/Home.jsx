import { GraduationCap, School, ShieldCheck, ArrowRight, LogIn, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation ultra-fine */}
      <nav className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-4 sm:py-6 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1579de] rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <GraduationCap className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 uppercase">
            Exam<span className="text-[#1579de]">Flow</span>
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/login"
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg border border-[#1579de] text-[#1579de] text-xs sm:text-base font-bold hover:bg-blue-50 transition-all"
          >
            <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Se connecter (Étudiant)</span>
            <span className="sm:hidden">Étudiant</span>
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg border border-[#1d6d1f] text-[#1d6d1f] text-xs sm:text-base font-bold hover:bg-green-50 transition-all"
          >
            <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Se connecter (École)</span>
            <span className="sm:hidden">École</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 pt-8 sm:pt-16 pb-8 sm:pb-12 text-center max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4 sm:mb-6 leading-tight">
          Votre plateforme de gestion simplifiée des <br className="hidden sm:block" />
          <span className="text-[#1579de]">Examens</span>
        </h1>
        {/* Choix de l'espace*/}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Carte Étudiant */}
          <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100 hover:border-[#1579de] transition-all duration-300">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
              <GraduationCap className="w-8 h-8 text-[#1579de]" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Espace Candidat</h3>
            <p className="text-gray-500 mb-8">Consultez vos convocations, vos résultats et téléchargez vos relevés de notes.</p>
            <Link to="/login" className="inline-flex items-center justify-center w-full py-4 px-6 rounded-2xl bg-[#1579de] text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
              Accéder à mon espace <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          {/* Carte École */}
          <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100 hover:border-[#1d6d1f] transition-all duration-300">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
              <School className="w-8 h-8 text-[#1d6d1f]" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Espace École</h3>
            <p className="text-gray-500 mb-8">Gérez vos candidats, suivez les délibérations et organisez vos sessions.</p>
            <Link to="/login" className="inline-flex items-center justify-center w-full py-4 px-6 rounded-2xl bg-[#1d6d1f] text-white font-bold hover:bg-green-800 transition-colors shadow-lg shadow-green-200">
              Gérer mon établissement <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section Inscription École */}
      <section className="mt-12 sm:mt-20 py-8 sm:py-12 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl sm:rounded-3xl mx-4 sm:mx-6 max-w-6xl lg:mx-auto">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-full mb-4 sm:mb-6 border border-orange-200">
            <Building className="w-4 h-4 text-[#ec8626]" />
            <span className="text-xs sm:text-sm font-bold text-[#ec8626]">Établissement scolaire ?</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">Rejoignez notre réseau d'établissements partenaires</h4>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Simplifiez la gestion de vos examens, automatisez les processus et offrez une meilleure expérience à vos étudiants.
          </p>
          <Link
            to="/register-ecole"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#ec8626] text-white rounded-2xl text-sm sm:text-base font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 hover:shadow-xl hover:-translate-y-1"
          >
            <Building className="w-4 h-4 sm:w-5 sm:h-5" />
            Inscrivez votre école
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 sm:mt-20 py-6 sm:py-8 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <p className="text-gray-500 text-xs sm:text-sm">
            © 2025 ExamFlow. Tous droits réservés.<br className="sm:hidden" />
            <Link to="/privacy" className="ml-2 text-[#1579de] hover:underline">Politique de confidentialité</Link> |
            <Link to="/terms" className="ml-2 text-[#1579de] hover:underline">Conditions d'utilisation</Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;