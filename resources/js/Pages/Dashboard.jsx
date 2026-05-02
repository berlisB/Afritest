import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Smartphone, 
    ClipboardCheck, 
    Star, 
    Trophy, 
    Plus, 
    ArrowRight, 
    Activity, 
    Layers, 
    Zap,
    CheckCircle2,
    LayoutDashboard,
    Search,
    ChevronRight,
    Users
} from 'lucide-react';

export default function Dashboard({ auth, stats = { tester: {}, dev: {} } }) {
    const [activeTab, setActiveTab] = useState('tester');
    const { post } = useForm();

    const handleAccept = (sessionId) => {
        post(route('test_sessions.accept', sessionId));
    };

    const handleDecline = (sessionId) => {
        if (confirm('Voulez-vous vraiment refuser cette invitation ?')) {
            post(route('test_sessions.decline', sessionId));
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                    <div>
                        <h2 className="font-black text-3xl text-slate-900 tracking-tight">Bonjour, {auth.user.name.split(' ')[0]} 👋</h2>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Heureux de vous revoir sur AfriTest</p>
                    </div>
                    {activeTab === 'developer' && (
                        <Link
                            href={route('applications.create')}
                            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            Nouvelle App
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Tableau de Bord" />

            <div className="py-10 bg-[#F8FAFC] min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    
                    {/* Navigation Onglets Moderne */}
                    <div className="flex justify-center">
                        <div className="bg-white p-1.5 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 inline-flex relative overflow-hidden">
                            <button
                                onClick={() => setActiveTab('tester')}
                                className={`relative z-10 px-10 py-3 text-sm font-black rounded-xl transition-all duration-500 flex items-center gap-2 ${
                                    activeTab === 'tester' ? 'text-white' : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                <Search className="w-4 h-4" />
                                Espace Testeur
                            </button>
                            <button
                                onClick={() => setActiveTab('developer')}
                                className={`relative z-10 px-10 py-3 text-sm font-black rounded-xl transition-all duration-500 flex items-center gap-2 ${
                                    activeTab === 'developer' ? 'text-white' : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Espace Développeur
                            </button>
                            <motion.div 
                                layoutId="activeTab"
                                className="absolute inset-y-1.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200"
                                style={{ 
                                    left: activeTab === 'tester' ? '6px' : 'calc(50% + 1px)',
                                    right: activeTab === 'tester' ? 'calc(50% + 1px)' : '6px',
                                    width: 'calc(50% - 7px)'
                                }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'tester' ? (
                            <motion.div 
                                key="tester"
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={containerVariants}
                                className="space-y-10"
                            >
                                {/* Stat Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-50 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform">
                                            <Activity className="w-24 h-24 text-indigo-600" />
                                        </div>
                                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                                            <Zap className="w-6 h-6 fill-current" />
                                        </div>
                                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Tests participés</p>
                                        <p className="mt-2 text-5xl font-black text-slate-900 tracking-tighter">{stats.tester.total_tests}</p>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-50 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform">
                                            <ClipboardCheck className="w-24 h-24 text-emerald-600" />
                                        </div>
                                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Rapports validés</p>
                                        <p className="mt-2 text-5xl font-black text-slate-900 tracking-tighter">{stats.tester.completed_tests}</p>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="bg-slate-900 rounded-[2rem] p-8 shadow-2xl shadow-slate-300 border border-slate-800 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                            <Trophy className="w-24 h-24 text-yellow-500" />
                                        </div>
                                        <div className="w-12 h-12 bg-yellow-500/10 text-yellow-500 rounded-2xl flex items-center justify-center mb-6">
                                            <Star className="w-6 h-6 fill-current" />
                                        </div>
                                        <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Score Réputation</p>
                                        <p className="mt-2 text-5xl font-black text-white tracking-tighter">
                                            {stats.tester.completed_tests * 50} <span className="text-lg text-slate-500">XP</span>
                                        </p>
                                    </motion.div>
                                </div>

                                 {/* Invitations Section */}
                                 {stats.tester.invitations.length > 0 && (
                                     <div className="space-y-6">
                                         <div className="flex items-center gap-3 px-2">
                                             <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                                 <Zap className="w-4 h-4 fill-current" />
                                             </div>
                                             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Invitations reçues</h3>
                                         </div>
                                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                             {stats.tester.invitations.map((invitation) => (
                                                 <motion.div 
                                                     key={invitation.id}
                                                     variants={itemVariants}
                                                     className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group"
                                                 >
                                                     <div className="absolute -right-4 -top-4 p-8 opacity-10 transform group-hover:scale-125 transition-transform">
                                                         <Smartphone className="w-20 h-20" />
                                                     </div>
                                                     <div className="relative z-10">
                                                         <span className="text-[8px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded-lg mb-4 inline-block">Invitation Exclusive</span>
                                                         <h4 className="font-black text-xl mb-1">{invitation.application.name}</h4>
                                                         <p className="text-indigo-100 text-xs font-bold mb-6 line-clamp-1">{invitation.application.description}</p>
                                                         
                                                         <div className="flex gap-2">
                                                             <button 
                                                                 onClick={() => handleAccept(invitation.id)}
                                                                 className="flex-grow py-3 bg-white text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all"
                                                             >
                                                                 Accepter
                                                             </button>
                                                             <button 
                                                                 onClick={() => handleDecline(invitation.id)}
                                                                 className="px-4 py-3 bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
                                                             >
                                                                 Refuser
                                                             </button>
                                                         </div>
                                                     </div>
                                                 </motion.div>
                                             ))}
                                         </div>
                                     </div>
                                 )}

                                {/* Main Content Area */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="flex items-center justify-between px-2">
                                            <h3 className="text-xl font-black text-slate-900">Mes Tests en cours</h3>
                                            <Link href={route('applications.index')} className="text-sm font-black text-indigo-600 hover:underline">Voir tout</Link>
                                        </div>
                                        
                                        {stats.tester.recent_tests.length === 0 ? (
                                            <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-slate-200">
                                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <Smartphone className="w-10 h-10 text-slate-300" />
                                                </div>
                                                <h3 className="text-lg font-black text-slate-800">Prêt pour votre premier test ?</h3>
                                                <p className="text-slate-500 font-bold text-sm mt-2 mb-8">Des dizaines d'applications attendent votre expertise.</p>
                                                <Link href={route('applications.index')} className="px-8 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                                                    Explorer les applications
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {stats.tester.recent_tests.map((session) => (
                                                    <motion.div 
                                                        variants={itemVariants}
                                                        key={session.id} 
                                                        className="group bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-2xl hover:border-indigo-200 transition-all duration-500"
                                                    >
                                                        <div className="flex justify-between items-start mb-6">
                                                            {session.application.logo_url ? (
                                                                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                                                    <img src={session.application.logo_url} className="w-full h-full object-cover" alt={session.application.name} />
                                                                </div>
                                                            ) : (
                                                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                                    <Smartphone className="w-8 h-8" />
                                                                </div>
                                                            )}
                                                            <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${
                                                                session.status === 'in_progress' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                            }`}>
                                                                {session.status === 'in_progress' ? 'Action requise' : 'Terminé'}
                                                            </span>
                                                        </div>
                                                        <h4 className="font-black text-slate-900 text-xl mb-2">{session.application.name}</h4>
                                                        <p className="text-slate-400 text-sm font-bold mb-6 line-clamp-1">{session.application.short_description || 'Aucune description'}</p>
                                                        
                                                        {session.status === 'in_progress' && (
                                                            <Link
                                                                href={route('test_reports.create', session.application.id)}
                                                                className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white text-sm font-black rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 group/btn"
                                                            >
                                                                Rédiger le rapport
                                                                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                            </Link>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Sidebar Activities */}
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-black text-slate-900 px-2">Activités Récentes</h3>
                                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/30 divide-y divide-slate-50">
                                            {[1, 2, 3].map((_, i) => (
                                                <div key={i} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex-shrink-0 flex items-center justify-center text-indigo-600">
                                                        <Activity className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-800">Rapport validé</p>
                                                        <p className="text-xs font-bold text-slate-400">Il y a 2 heures • App Name</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group cursor-pointer">
                                            <div className="absolute top-0 right-0 p-4 opacity-20 transform group-hover:scale-125 transition-transform">
                                                <Trophy className="w-20 h-20" />
                                            </div>
                                            <h4 className="font-black text-xl mb-2">Passez au niveau Pro</h4>
                                            <p className="text-indigo-100 text-sm font-bold mb-6">Validez 5 tests supplémentaires pour débloquer des missions exclusives.</p>
                                            <div className="w-full bg-indigo-500/50 h-2 rounded-full overflow-hidden">
                                                <div className="bg-white h-full w-[65%]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="developer"
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={containerVariants}
                                className="space-y-10"
                            >
                                {/* Developer KPI Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-50 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                                            <Layers className="w-32 h-32 text-indigo-600" />
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-inner">
                                                <Layers className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Mes Applications</p>
                                                <p className="text-5xl font-black text-slate-900 tracking-tighter">{stats.developer.total_apps}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-50 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                                            <Users className="w-32 h-32 text-emerald-600" />
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-inner">
                                                <Users className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Retours Totaux</p>
                                                <p className="text-5xl font-black text-slate-900 tracking-tighter">
                                                    {stats.developer.recent_apps.reduce((acc, app) => acc + app.test_sessions_count, 0)}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Apps List Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-2xl font-black text-slate-900">Mes Projets</h3>
                                        <Link href={route('applications.create')} className="text-sm font-black text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">
                                            Nouveau projet <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    {stats.developer.recent_apps.length === 0 ? (
                                        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200 shadow-xl shadow-slate-100">
                                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                                <Plus className="w-12 h-12 text-slate-300" />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-800">Aucun projet actif</h3>
                                            <p className="text-slate-500 font-bold text-lg mt-3 mb-10 max-w-md mx-auto">Commencez à collecter des feedbacks réels en soumettant votre application dès aujourd'hui.</p>
                                            <Link
                                                href={route('applications.create')}
                                                className="inline-flex items-center rounded-2xl bg-slate-900 px-10 py-5 text-lg font-black text-white shadow-2xl shadow-slate-300 hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95"
                                            >
                                                Soumettre maintenant
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                            {stats.developer.recent_apps.map((app) => (
                                                <motion.div 
                                                    variants={itemVariants}
                                                    key={app.id} 
                                                    className="group bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-2xl hover:border-indigo-200 transition-all duration-500 relative overflow-hidden"
                                                >
                                                    <div className="flex justify-between items-start mb-8 relative z-10">
                                                        <div className="flex items-center gap-4">
                                                            {app.logo_url ? (
                                                                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                                                    <img src={app.logo_url} className="w-full h-full object-cover" alt={app.name} />
                                                                </div>
                                                            ) : (
                                                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                                                    <Smartphone className="w-8 h-8" />
                                                                </div>
                                                            )}
                                                            <div className="space-y-1">
                                                                <h4 className="font-black text-slate-900 text-2xl group-hover:text-indigo-600 transition-colors">{app.name}</h4>
                                                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Soumis le {new Date(app.created_at).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        <span className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border ${
                                                            app.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                                                        }`}>
                                                            {app.status}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-8 mb-8 relative z-10">
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-black text-slate-900">{app.test_sessions_count}</p>
                                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Testeurs</p>
                                                        </div>
                                                        <div className="w-px h-8 bg-slate-100"></div>
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-black text-slate-900">0</p>
                                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Bugs</p>
                                                        </div>
                                                        <div className="w-px h-8 bg-slate-100"></div>
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-black text-slate-900">QA</p>
                                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Focus</p>
                                                        </div>
                                                    </div>

                                                    <Link 
                                                        href={route('applications.show', app.id)} 
                                                        className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-50 text-indigo-600 text-sm font-black rounded-2xl hover:bg-indigo-600 hover:text-white transition-all group/btn"
                                                    >
                                                        Gérer le projet
                                                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
