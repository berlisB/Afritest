import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Smartphone, 
    Monitor, 
    ShieldCheck, 
    Bug, 
    Star, 
    Calendar,
    User,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Download,
    MessageSquare,
    Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Show({ application, report }) {
    const { test_session, environment, features_tested, bugs, ux_feedback, created_at } = report;
    const tester = test_session.tester;

    const severityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'high':
            case 'critique': return 'text-rose-600 bg-rose-50 border-rose-100';
            case 'medium':
            case 'moyen': return 'text-amber-600 bg-amber-50 border-amber-100';
            default: return 'text-indigo-600 bg-indigo-50 border-indigo-100';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-4">
                        <Link 
                            href={route('applications.show', application.id)}
                            className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Détails du Rapport</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Par {tester.name} • {application.name}
                            </p>
                        </div>
                    </div>
                    <a 
                        href={route('test_reports.pdf', report.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
                    >
                        <Download className="w-4 h-4" />
                        Exporter PDF
                    </a>
                </div>
            }
        >
            <Head title={`Rapport de ${tester.name} - ${application.name}`} />

            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Sidebar: Tester & Stats */}
                    <div className="space-y-10">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-50 text-center"
                        >
                            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-[2rem] flex items-center justify-center font-black text-3xl mx-auto mb-6">
                                {tester.name.charAt(0)}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">{tester.name}</h3>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">{tester.country || 'Cameroun'}</p>
                            
                            <div className="flex justify-center gap-1 mb-8">
                                {[1,2,3,4,5].map(i => (
                                    <Star 
                                        key={i} 
                                        className={`w-6 h-6 ${i <= ux_feedback.rating ? 'text-yellow-400 fill-current' : 'text-slate-100'}`} 
                                    />
                                ))}
                            </div>

                            <div className="pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Bugs</p>
                                    <p className="text-xl font-black text-rose-600">{Array.isArray(bugs) ? bugs.length : 0}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Score</p>
                                    <p className="text-xl font-black text-indigo-600">{ux_feedback.rating}/5</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-100"
                        >
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                                <Monitor className="w-4 h-4 text-indigo-400" />
                                Environnement
                            </h4>
                            <div className="space-y-6">
                                {[
                                    { label: 'Modèle', val: environment.device_model || 'Inconnu' },
                                    { label: 'Système', val: environment.device_os || 'Android' },
                                    { label: 'Navigateur', val: environment.browser || 'Chrome' },
                                    { label: 'Connexion', val: environment.connectivity || '4G/Wifi' },
                                ].map((env, i) => (
                                    <div key={i} className="flex justify-between items-center pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{env.label}</span>
                                        <span className="text-xs font-bold">{env.val}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Main Content: Bugs & Feedback */}
                    <div className="lg:col-span-2 space-y-10">
                        
                        {/* Summary Section */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-50 space-y-8"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Feedback Général</h3>
                                    <p className="text-slate-400 font-bold text-sm mt-1">L'avis global du testeur sur l'expérience utilisateur.</p>
                                </div>
                            </div>
                            <div className="p-8 bg-slate-50 rounded-3xl">
                                <p className="text-slate-700 font-medium leading-relaxed italic">
                                    "{ux_feedback.notes}"
                                </p>
                            </div>
                        </motion.div>

                        {/* Features Tested */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-50 space-y-8"
                        >
                            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                Fonctionnalités validées
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {features_tested?.map((feature, i) => (
                                    <div key={i} className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-600 uppercase tracking-widest">
                                        {feature}
                                    </div>
                                )) || <p className="text-slate-400 italic text-sm font-bold">Aucune fonctionnalité spécifique listée.</p>}
                            </div>
                        </motion.div>

                        {/* Bugs List */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    <Bug className="w-6 h-6 text-rose-500" />
                                    Bugs et Anomalies signalés
                                </h3>
                                <span className="px-4 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase">
                                    {Array.isArray(bugs) ? bugs.length : 0} Signalements
                                </span>
                            </div>

                            <div className="space-y-4">
                                {bugs?.map((bug, i) => (
                                    <div key={i} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-50 group hover:border-rose-100 transition-all">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="space-y-1">
                                                <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${severityColor(bug.severity)}`}>
                                                    {bug.severity || 'Medium'}
                                                </span>
                                                <h4 className="text-lg font-black text-slate-900">{bug.title}</h4>
                                            </div>
                                            <AlertTriangle className="w-6 h-6 text-rose-400 opacity-20 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Description</p>
                                                <p className="text-sm text-slate-600 font-medium leading-relaxed">{bug.description}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Étapes pour reproduire</p>
                                                <p className="text-sm text-slate-600 font-medium leading-relaxed">{bug.steps || 'Non précisé.'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {(!bugs || bugs.length === 0) && (
                                    <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ShieldCheck className="w-8 h-8 text-emerald-500" />
                                        </div>
                                        <p className="text-slate-400 font-bold italic tracking-tight">Félicitations ! Aucun bug n'a été signalé par ce testeur.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
