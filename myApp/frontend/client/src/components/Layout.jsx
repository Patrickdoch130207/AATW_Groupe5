import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, CheckSquare, LogOut, User, School, GraduationCap, Users, Edit2 } from 'lucide-react';

const Layout = ({ userRole }) => {
  const navigate = useNavigate();

  const menuItems = {
    admin: [
      { label: 'Tableau de bord', path: '/admin/dashboard', icon: <LayoutDashboard /> },
      { label: 'Sessions Exams', path: '/admin/sessions', icon: <ClipboardList /> },
      { label: 'Validation Écoles', path: '/admin/validation', icon: <CheckSquare /> },
      { label: 'Saisie des Notes', path: '/admin/notes', icon: <Edit2 /> },
    ],
    school: [
      { label: 'Tableau de bord', path: '/ecole/dashboard', icon: <School /> },
      { label: 'Mes Candidats', path: '/ecole/candidats', icon: <Users /> },
      { label: 'Inscrire Candidats', path: '/ecole/inscription', icon: <User /> },
    ],
    etudiant: [
      { label: 'Mon Espace', path: '/candidat/dashboard', icon: <User /> },
    ]
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1579de] rounded-lg flex items-center justify-center shadow-md shadow-blue-200">
              <GraduationCap className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-800 uppercase">
              Exam<span className="text-[#1579de]">Flow</span>
            </span>
          </Link>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-2 ml-1">République du Bénin</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems[userRole]?.map((item) => (
            <Link key={item.path} to={item.path} className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-[#1579de] rounded-xl transition-all font-medium">
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={() => navigate('/login')} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold">
            <LogOut /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-700 capitalize">{userRole}</p>
              <p className="text-[10px] text-slate-400">Utilisateur connecté</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[#1579de]">
              <User size={20} />
            </div>
          </div>
        </header>
        <div className="p-8">
          <Outlet /> {/* C'est ici que les pages s'affichent */}
        </div>
      </main>
    </div>
  );
};

export default Layout;