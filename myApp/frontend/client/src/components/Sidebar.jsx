import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  ClipboardList, 
  UserPlus, 
  Users, 
  User, 
  LogOut, 
  School,
  GraduationCap
} from 'lucide-react';

const Sidebar = ({ userRole }) => {
  const location = useLocation();

  // Configuration des menus selon le rôle (Admin, Ecole, Etudiant)
  const menuConfig = {
    admin: [
      { label: 'Tableau de Bord', path: '/admin/dashboard', icon: <LayoutDashboard size={22} /> },
      { label: 'Validation Écoles', path: '/admin/validation', icon: <CheckSquare size={22} /> },
      { label: 'Sessions Exams', path: '/admin/sessions', icon: <ClipboardList size={22} /> },
      { label: 'Délibérations', path: '/admin/deliberations', icon: <GraduationCap size={22} /> },
    ],
    ecole: [
      { label: 'Ma Structure', path: '/ecole/dashboard', icon: <School size={22} /> },
      { label: 'Inscrire Candidats', path: '/ecole/inscription', icon: <UserPlus size={22} /> },
      { label: 'Mes Candidats', path: '/ecole/candidats', icon: <Users size={22} /> },
    ],
    etudiant: [
      { label: 'Mon Profil', path: '/etudiant/profil', icon: <User size={22} /> },
      { label: 'Mes Résultats', path: '/etudiant/resultats', icon: <GraduationCap size={22} /> },
    ]
  };

  const currentMenu = menuConfig[userRole] || [];

  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 shadow-sm">
      
      {/* SECTION LOGO - Esthétique Premium */}
      <div className="p-8 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1579de] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 rotate-3 group-hover:rotate-0 transition-transform">
            <span className="text-white font-black text-xl italic">E</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter italic">
              EXAM<span className="text-[#ec8626]">HUB</span>
            </h1>
            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400 leading-tight">
              Portail Officiel
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION - Liens avec arrondis prononcés */}
      <nav className="flex-1 px-4 space-y-2">
        {currentMenu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-[22px] transition-all duration-300 font-bold group ${
                isActive 
                  ? 'bg-[#1579de] text-white shadow-xl shadow-blue-100 scale-[1.02]' 
                  : 'text-slate-500 hover:bg-blue-50 hover:text-[#1579de]'
              }`}
            >
              <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#1579de]'}`}>
                {item.icon}
              </span>
              <span className="text-sm tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER SIDEBAR - Déconnexion */}
      <div className="p-6 mt-auto border-t border-slate-50">
        <Link 
          to="/login"
          className="flex items-center gap-4 w-full px-5 py-4 rounded-[22px] text-red-500 hover:bg-red-50 transition-all font-black uppercase text-[11px] tracking-widest shadow-sm hover:shadow-md"
        >
          <LogOut size={18} /> 
          <span>Déconnexion</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;