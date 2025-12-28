import { useState, useEffect } from 'react';
import { Users, School, Calendar, ArrowUpRight, Loader2 } from 'lucide-react';
import { adminService } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Écoles Agréées", value: stats?.schools_count || "0", color: "bg-blue-500", icon: <School className="text-white" /> },
    { label: "Candidats Inscrits", value: stats?.candidates_count?.toLocaleString() || "0", color: "bg-green-500", icon: <Users className="text-white" /> },
    { label: "Sessions Actives", value: stats?.active_session_count || "0", color: "bg-orange-500", icon: <Calendar className="text-white" /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-[#1579de] animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-800 uppercase mb-8">Statistiques Générales</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-5">
            <div className={`${stat.color} p-4 rounded-2xl shadow-lg`}>{stat.icon}</div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Aperçu de la Session</h2>
        <div className="space-y-4 text-sm text-slate-600">
          {stats?.active_session_name ? (
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Session active : <span className="font-bold text-slate-800">{stats.active_session_name}</span>
            </p>
          ) : (
            <p className="text-slate-400 italic">Aucune session active pour le moment.</p>
          )}
          <p>• Les statistiques sont mises à jour en temps réel à partir de la base de données.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;