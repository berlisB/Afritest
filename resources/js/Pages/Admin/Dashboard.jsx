import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Users, 
    Layers, 
    ShieldAlert, 
    Zap, 
    ChevronRight, 
    UserCheck, 
    Ban, 
    CheckCircle, 
    ArrowUpRight,
    TrendingUp,
    MoreVertical,
    Search,
    MapPin,
    Smartphone,
    Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard({ auth, stats = {}, recentApps = [], recentUsers = [] }) {
    const [selectedApp, setSelectedApp] = useState(null);
    const { post, processing } = useForm({
        status: '',
        reason: ''
    });

    const handleUpdateStatus = (appId, status, reason = '') => {
        post(route('admin.applications.update-status', appId), {
            data: { status, reason },
            onSuccess: () => setSelectedApp(null)
        });
    };

    const statCards = [
        { label: 'Utilisateurs', value: stats?.total_users || 0, color: 'bg-blue-600', icon: Users, trend: '+12%' },
        { label: 'Applications', value: stats?.total_apps || 0, color: 'bg-indigo-600', icon: Layers, trend: '+5%' },
        { label: 'Apps Suspendues', value: stats?.suspended_apps || 0, color: 'bg-rose-600', icon: ShieldAlert, trend: '-2%' },
        { label: 'Vibe Code Alerts', value: stats?.vibe_coded_apps || 0, color: 'bg-amber-500', icon: Zap, trend: 'High' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center py-2">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Console d'Administration</h2>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">Contrôle global & Modération</p>
                    </div>
                    <div className="hidden md:flex gap-4">
                        <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all">
                            Paramètres Système
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Admin Console" />

            <div className="py-10 bg-[#F8FAFC] min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    
                    {/* Stats Grid */}
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {statCards.map((stat, idx) => (
                            <motion.div key={idx} variants={itemVariants} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/40 border border-slate-50 relative overflow-hidden group">
                                <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-5 -mr-8 -mt-8 rounded-full transition-transform duration-500 group-hover:scale-150`}></div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-2xl ${stat.color} text-white shadow-lg`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-400">
                                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                                        {stat.trend}
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-4xl font-black text-slate-900 mt-1">{stat.value}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Applications Table/List */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Dernières Soumissions</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    <input type="text" className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-0 focus:border-indigo-600" placeholder="Rechercher une app..." />
                                </div>
                            </div>

                            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50 overflow-hidden">
                                <div className="divide-y divide-slate-50">
                                    {recentApps.map((app) => (
                                        <div key={app.id} className="p-6 hover:bg-slate-50 transition-all group">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400">
                                                        {app.platform === 'web' ? <Globe className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{app.name}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Par {app.owner?.name} • {app.test_sessions_count} testeurs</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                        app.status === 'published' ? 'bg-emerald-50 text-emerald-600' :
                                                        app.status === 'suspended' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'
                                                    }`}>
                                                        {app.status}
                                                    </span>
                                                    <div className="flex gap-1">
                                                        {app.status !== 'published' && (
                                                            <button 
                                                                onClick={() => handleUpdateStatus(app.id, 'published')}
                                                                className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
                                                                title="Approuver"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        {app.status !== 'suspended' && (
                                                            <button 
                                                                onClick={() => handleUpdateStatus(app.id, 'suspended', 'Violation des règles')}
                                                                className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all"
                                                                title="Suspendre"
                                                            >
                                                                <Ban className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        <Link href={route('applications.show', app.id)} className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-slate-900 hover:text-white transition-all">
                                                            <ArrowUpRight className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 bg-slate-50/50 border-t border-slate-50 text-center">
                                    <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Charger plus d'applications</button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Users Sidebar */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Nouveaux Membres</h3>
                            <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/40 border border-slate-50 space-y-6">
                                {recentUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-110 transition-transform">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-900">{user.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                                                    <MapPin className="w-2.5 h-2.5" />
                                                    {user.country || 'Inconnu'}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="p-2 text-slate-200 hover:text-indigo-600 transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button className="w-full py-4 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
                                    Voir tout l'annuaire
                                </button>
                            </div>

                            {/* System Health / Alert */}
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <Zap className="w-20 h-20" />
                                </div>
                                <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-4 text-indigo-400">Rapport de Santé</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400">Base de données</span>
                                        <span className="text-xs font-black text-emerald-400">Stable</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400">Bot WhatsApp</span>
                                        <span className="text-xs font-black text-emerald-400">Actif</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400">Alertes Vibe Code</span>
                                        <span className="text-xs font-black text-amber-400">2 critiques</span>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between group-hover:translate-x-2 transition-transform">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Logs système</span>
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
