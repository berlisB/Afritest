import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
    Smartphone, 
    Globe, 
    ChevronLeft, 
    CheckCircle2, 
    Users, 
    Calendar, 
    ShieldCheck, 
    ExternalLink, 
    Download,
    Lock,
    Search,
    UserPlus,
    X,
    FileText,
    ArrowRight,
    AlertTriangle,
    Layers,
    Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Show({ auth, application, isOwner, isEnrolled, session }) {
    const [activeTab, setActiveTab] = useState('details');
    const [userSearch, setUserSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const { post, delete: destroy, processing } = useForm({
        tester_ids: []
    });

    const handleEnroll = () => {
        post(route('test_sessions.store', application.id));
    };

    const handleSearch = async (val) => {
        setUserSearch(val);
        if (val.length < 2) {
            setSearchResults([]);
            return;
        }
        
        setIsSearching(true);
        try {
            const response = await fetch(route('users.search', { query: val }));
            const data = await response.json();
            setSearchResults(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSearching(false);
        }
    };

    const assignTester = (testerId) => {
        post(route('applications.assign', application.id), {
            data: { tester_ids: [testerId] },
            onSuccess: () => {
                setUserSearch('');
                setSearchResults([]);
            }
        });
    };

    const removeTester = (testerId) => {
        if (confirm('Voulez-vous vraiment retirer ce testeur de la session ?')) {
            destroy(route('applications.remove-tester', [application.id, testerId]));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href={route('applications.index')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                            <ChevronLeft className="w-6 h-6 text-slate-400" />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{application.name}</h2>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                                {application.type === 'mobile_app' ? 'Mobile' : 'Web'} • {application.platform}
                            </p>
                        </div>
                    </div>
                            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
                                <button 
                                    onClick={() => setActiveTab('details')}
                                    className={`px-4 py-2 text-xs font-black rounded-lg transition-all whitespace-nowrap ${activeTab === 'details' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Détails
                                </button>
                                <button 
                                    onClick={() => setActiveTab('management')}
                                    className={`px-4 py-2 text-xs font-black rounded-lg transition-all whitespace-nowrap ${activeTab === 'management' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Gestion Testeurs
                                </button>
                                <button 
                                    onClick={() => setActiveTab('reports')}
                                    className={`px-4 py-2 text-xs font-black rounded-lg transition-all whitespace-nowrap ${activeTab === 'reports' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Rapports ({application.test_sessions?.filter(s => s.test_report).length || 0})
                                </button>
                            </div>
                </div>
            }
        >
            <Head title={application.name} />

            <div className="py-10 bg-[#F8FAFC] min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <AnimatePresence mode="wait">
                        {activeTab === 'details' ? (
                            <motion.div 
                                key="details"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 lg:grid-cols-3 gap-10"
                            >
                                {/* Left Column: Info */}
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-50">
                                        <div className="flex flex-col md:flex-row gap-8 mb-10">
                                            {application.logo_url ? (
                                                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-100 flex-shrink-0">
                                                    <img src={application.logo_url} className="w-full h-full object-cover" alt={application.name} />
                                                </div>
                                            ) : (
                                                <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                    <Smartphone className="w-12 h-12 text-slate-300" />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 mb-2">À propos du projet</h3>
                                                <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap max-w-2xl">
                                                    {application.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Objectifs du test</h4>
                                                <ul className="space-y-3">
                                                    {application.test_scope?.features?.map((f, i) => (
                                                        <li key={i} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                            {f}
                                                        </li>
                                                    )) || <li className="text-slate-400 italic text-sm">Non spécifié</li>}
                                                </ul>
                                            </div>
                                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Accès Rapide</h4>
                                                <div className="space-y-3">
                                                    {application.url && (
                                                        <a href={application.url} target="_blank" className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-600 group transition-all">
                                                            <span className="text-xs font-bold text-slate-600">Lancer l'App Web</span>
                                                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                                                        </a>
                                                    )}
                                                    {application.apk_url && (
                                                        <a href={application.apk_url} target="_blank" className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-600 group transition-all">
                                                            <span className="text-xs font-bold text-slate-600">Télécharger (APK/IPA)</span>
                                                            <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                                                        </a>
                                                    )}
                                                    {application.requirements_file && (
                                                        <a href={application.requirements_file} target="_blank" className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-600 group transition-all">
                                                            <span className="text-xs font-bold text-slate-600">Exigences (PDF/DOCX)</span>
                                                            <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vibe Code Warning */}
                                    {application.is_vibe_coded && (
                                        <div className="bg-rose-50 border-2 border-rose-100 rounded-[2.5rem] p-10 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 opacity-5 text-rose-600">
                                                <AlertTriangle className="w-32 h-32" />
                                            </div>
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-3 text-rose-600 mb-4">
                                                    <AlertTriangle className="w-6 h-6" />
                                                    <h3 className="text-xl font-black uppercase tracking-tight">Vibe Code Alert</h3>
                                                </div>
                                                <p className="text-rose-900/70 font-bold text-sm leading-relaxed mb-6">
                                                    Cette application a été signalée comme étant générée par IA (Vibe Coding) sans audit de sécurité approfondi. 
                                                    Testers, soyez vigilants quant à la manipulation de vos données personnelles et aux permissions demandées.
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-lg text-[10px] font-black uppercase tracking-widest">Sécurité non vérifiée</span>
                                                    <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-lg text-[10px] font-black uppercase tracking-widest">IA Generated</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Credentials Section if Enrolled */}
                                    {(isEnrolled || isOwner) && application.test_credentials && (
                                        <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                                <ShieldCheck className="w-32 h-32" />
                                            </div>
                                            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                                                <ShieldCheck className="w-6 h-6" />
                                                Identifiants de Test
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Email / Username</p>
                                                    <p className="font-mono font-bold">{application.test_credentials.email || 'N/A'}</p>
                                                </div>
                                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Mot de passe</p>
                                                    <p className="font-mono font-bold">{application.test_credentials.password || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Sidebar */}
                                <div className="space-y-8">
                                    {/* Action Card */}
                                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-50 text-center">
                                        {!isOwner ? (
                                            isEnrolled ? (
                                                <div className="space-y-6">
                                                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                                        <CheckCircle2 className="w-10 h-10" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-black text-slate-900">Session Active</h4>
                                                        <p className="text-slate-400 font-bold text-sm mt-1">Vous testez ce produit.</p>
                                                    </div>
                                                    <Link
                                                        href={route('test_reports.create', application.id)}
                                                        className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all"
                                                    >
                                                        <FileText className="w-5 h-5" />
                                                        Rédiger le rapport
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="space-y-6">
                                                    <div className={`w-20 h-20 ${application.is_open ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'} rounded-full flex items-center justify-center mx-auto`}>
                                                        {application.is_open ? <Users className="w-10 h-10" /> : <Lock className="w-10 h-10" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-black text-slate-900">
                                                            {application.is_open ? 'Rejoindre le Test' : 'Test Fermé'}
                                                        </h4>
                                                        <p className="text-slate-400 font-bold text-sm mt-1">
                                                            {application.is_open ? 'Participez et gagnez +50 XP' : "Sur invitation seulement"}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={handleEnroll}
                                                        disabled={processing || !application.is_open}
                                                        className={`w-full py-4 font-black rounded-2xl transition-all shadow-xl ${
                                                            application.is_open 
                                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100' 
                                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                                        }`}
                                                    >
                                                        {processing ? 'Chargement...' : application.is_open ? "M'inscrire maintenant" : "Accès restreint"}
                                                    </button>
                                                </div>
                                            )
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                                                    <Layers className="w-10 h-10" />
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-black text-slate-900">Gestion Développeur</h4>
                                                    <p className="text-slate-400 font-bold text-sm mt-1">Gérez vos testeurs et exports.</p>
                                                </div>
                                                <button 
                                                    onClick={() => setActiveTab('management')}
                                                    className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                                                >
                                                    Gérer les testeurs
                                                </button>
                                                <a 
                                                    href={route('applications.export', application.id)}
                                                    className="flex items-center justify-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:text-indigo-800 transition-colors"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Exporter en CSV
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {/* App Metadata */}
                                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-50 divide-y divide-slate-50">
                                        <div className="py-4 first:pt-0">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Propriétaire</p>
                                            <p className="text-sm font-black text-slate-800">{application.owner.name}</p>
                                            <p className="text-xs font-bold text-slate-500">{application.owner.country || 'Pionnier AfriTest'}</p>
                                        </div>
                                        <div className="py-4">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Date Limite</p>
                                            <p className="text-sm font-black text-slate-800 flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-300" />
                                                {application.deadline ? new Date(application.deadline).toLocaleDateString() : 'Non définie'}
                                            </p>
                                        </div>
                                        <div className="py-4 last:pb-0">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Participation</p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-black text-slate-800">{application.test_sessions_count || 0} Testeurs</p>
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${application.is_open ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                    {application.is_open ? 'Ouvert' : 'Fermé'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : activeTab === 'management' ? (
                            <motion.div 
                                key="management"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-10"
                            >
                                {/* Tester Assignment Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-50 space-y-8 h-fit">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Assigner des Testeurs</h3>
                                            <p className="text-slate-400 font-bold text-sm mt-1">Recherchez des membres pour les inviter à tester votre application.</p>
                                        </div>

                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Search className="w-5 h-5 text-slate-300" />
                                            </div>
                                            <input 
                                                type="text"
                                                value={userSearch}
                                                onChange={(e) => handleSearch(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-0 text-sm font-bold text-slate-700 transition-all"
                                                placeholder="Rechercher par nom ou email..."
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            {isSearching && <p className="text-xs font-bold text-slate-400 animate-pulse">Recherche en cours...</p>}
                                            {searchResults.map((u) => (
                                                <div key={u.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black text-sm uppercase">
                                                            {u.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-800">{u.name}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{u.email} • {u.country || 'QA'}</p>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => assignTester(u.id)}
                                                        disabled={processing}
                                                        className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
                                                    >
                                                        <UserPlus className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                            {userSearch.length >= 2 && searchResults.length === 0 && !isSearching && (
                                                <p className="text-center py-4 text-xs font-bold text-slate-400 uppercase tracking-widest italic">Aucun utilisateur trouvé</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-50 space-y-8">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Testeurs Assignés</h3>
                                                    <p className="text-slate-400 font-bold text-sm mt-1">{application.test_sessions?.length || 0} membres actifs</p>
                                                </div>
                                                <a 
                                                    href={route('applications.export', application.id)}
                                                    className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100"
                                                    title="Exporter CSV"
                                                >
                                                    <Download className="w-5 h-5" />
                                                </a>
                                            </div>

                                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                {application.test_sessions?.map((ts) => (
                                                    <div key={ts.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400">
                                                                {ts.tester.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-slate-900">{ts.tester.name}</p>
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`w-2 h-2 rounded-full ${ts.status === 'done' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                                        {ts.status === 'done' ? 'Rapport terminé' : 'En attente'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => removeTester(ts.tester_id)}
                                                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                )) || (
                                                    <p className="text-center py-10 text-slate-400 font-bold italic">Aucun testeur assigné pour le moment.</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Google Play Management Section */}
                                        {application.google_tester_emails && (
                                            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                                    <Smartphone className="w-32 h-32" />
                                                </div>
                                                <div className="relative z-10 space-y-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center">
                                                            <Mail className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-black uppercase tracking-tight">Google Play Console</h3>
                                                            <p className="text-slate-400 font-bold text-xs">Emails requis pour vos tests fermés</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                                                        <p className="text-xs font-medium text-slate-400 leading-relaxed mb-4 italic">
                                                            Copiez cette liste et collez-la dans votre Google Play Console (Configuration du test &gt; Listes de testeurs).
                                                        </p>
                                                        <div className="p-4 bg-black/40 rounded-2xl font-mono text-sm text-indigo-300 break-all border border-white/5">
                                                            {application.google_tester_emails}
                                                        </div>
                                                        <div className="flex gap-6">
                                                            <button 
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(application.google_tester_emails);
                                                                    alert('Liste copiée dans le presse-papier !');
                                                                }}
                                                                className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:text-indigo-400 transition-colors"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                                Copier la liste
                                                            </button>

                                                            <button 
                                                                onClick={() => {
                                                                    if (confirm('Voulez-vous générer une nouvelle liste ? Cela inclura les nouveaux inscrits.')) {
                                                                        router.post(route('applications.regenerate-tester-emails', application.id));
                                                                    }
                                                                }}
                                                                className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors"
                                                            >
                                                                <Zap className="w-4 h-4" />
                                                                Régénérer
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="reports"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {application.test_sessions?.filter(s => s.test_report).map((session) => (
                                        <div key={session.id} className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-50 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                                                        {session.tester.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-900">{session.tester.name}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {new Date(session.test_report.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                                    <span className="text-[10px] font-black text-yellow-700">{session.test_report.rating}/5</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4 flex-grow">
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="px-2 py-1 bg-slate-100 rounded-lg text-[8px] font-black uppercase text-slate-500 tracking-widest">
                                                        {session.test_report.device_model}
                                                    </span>
                                                    <span className="px-2 py-1 bg-slate-100 rounded-lg text-[8px] font-black uppercase text-slate-500 tracking-widest">
                                                        {session.test_report.device_os}
                                                    </span>
                                                </div>

                                                <p className="text-xs text-slate-600 font-medium line-clamp-3">
                                                    {session.test_report.notes}
                                                </p>

                                                <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                                                    <div className="flex items-center gap-1 text-rose-600">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        <span className="text-[10px] font-black uppercase">{Array.isArray(session.test_report.bugs) ? session.test_report.bugs.length : 0} Bugs</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Link 
                                                href={route('test_reports.show', [application.id, session.test_report.id])}
                                                className="mt-8 w-full py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all text-center"
                                            >
                                                Voir le rapport complet
                                            </Link>
                                        </div>
                                    ))}

                                    {application.test_sessions?.filter(s => s.test_report).length === 0 && (
                                        <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                                <FileText className="w-10 h-10" />
                                            </div>
                                            <p className="text-slate-400 font-bold italic">Aucun rapport n'a encore été soumis par les testeurs.</p>
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
