import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Plus, 
    Smartphone, 
    Globe, 
    Layers, 
    ChevronRight, 
    Search, 
    MapPin, 
    Users,
    Star,
    LayoutGrid
} from 'lucide-react';

export default function Index({ auth, applications }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredApps = applications.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getPlatformIcon = (platform) => {
        switch(platform) {
            case 'android':
            case 'ios':
            case 'mobile_app':
                return <Smartphone className="w-5 h-5" />;
            case 'web':
            case 'web_app':
                return <Globe className="w-5 h-5" />;
            default:
                return <Layers className="w-5 h-5" />;
        }
    };

    const getPlatformColor = (platform) => {
        switch(platform) {
            case 'android': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'ios': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'web': return 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100';
            default: return 'bg-indigo-50 text-indigo-600 border-indigo-100';
        }
    };

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
            user={auth?.user}
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-2">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                            Explorer les Applications
                        </h2>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Découvrez et testez les innovations de demain</p>
                    </div>
                    <Link
                        href={route('applications.create')}
                        className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl text-sm font-black hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Soumettre une App
                    </Link>
                </div>
            }
        >
            <Head title="Catalogue d'applications" />

            <div className="py-10 bg-[#F8FAFC] min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
                    
                    {/* Search & Filters */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-grow group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-0 text-sm font-bold text-slate-700 transition-all"
                                    placeholder="Nom, technologie ou description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 flex items-center gap-2 hover:border-indigo-600 hover:text-indigo-600 transition-all">
                                    <LayoutGrid className="w-4 h-4" />
                                    Catégories
                                </button>
                            </div>
                        </div>
                    </div>

                    {filteredApps.length === 0 ? (
                        <div className="text-center py-32 bg-white rounded-[3rem] shadow-xl shadow-slate-200/30 border border-slate-100">
                            <div className="mx-auto w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-8">
                                <Search className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Aucun résultat</h3>
                            <p className="mt-2 text-slate-500 font-bold max-w-sm mx-auto">
                                Nous n'avons trouvé aucune application correspondant à "{searchQuery}".
                            </p>
                        </div>
                    ) : (
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredApps.map((app) => (
                                <motion.div variants={itemVariants} key={app.id}>
                                    <Link 
                                        href={route('applications.show', app.id)} 
                                        className="group h-full bg-white rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(79,70,229,0.15)] border border-slate-50 hover:border-indigo-100 transition-all duration-500 flex flex-col overflow-hidden relative"
                                    >
                                        <div className="p-8 flex-grow space-y-6">
                                            <div className="flex justify-between items-start">
                                                {app.logo_url ? (
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-slate-100 group-hover:scale-110 transition-transform">
                                                        <img src={app.logo_url} className="w-full h-full object-cover" alt={app.name} />
                                                    </div>
                                                ) : (
                                                    <div className={`p-4 rounded-2xl ${getPlatformColor(app.platform)} border group-hover:scale-110 transition-transform`}>
                                                        {getPlatformIcon(app.platform)}
                                                    </div>
                                                )}
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest">
                                                        <Users className="w-3.5 h-3.5" />
                                                        {app.test_sessions_count} testeurs
                                                    </div>
                                                    {app.is_vibe_coded && (
                                                        <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded-lg font-black text-[8px] uppercase tracking-widest">
                                                            Vibe Code
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 tracking-tight">
                                                    {app.name}
                                                </h3>
                                                <p className="text-slate-400 text-sm font-bold flex items-center gap-1 uppercase tracking-tighter">
                                                    {app.platform} • <MapPin className="w-3 h-3" /> {app.owner?.country || 'Afrique'}
                                                </p>
                                            </div>
                                            
                                            <p className="text-slate-500 text-sm font-medium line-clamp-3 leading-relaxed">
                                                {app.description}
                                            </p>
                                            
                                            <div className="flex items-center gap-3 pt-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-400 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-100">
                                                    {app.owner?.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Soumis par</p>
                                                    <p className="font-black text-slate-800 text-sm">{app.owner?.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="px-8 py-6 bg-slate-50 group-hover:bg-indigo-600 transition-all flex items-center justify-between">
                                            <span className="text-xs font-black text-slate-600 uppercase tracking-[0.2em] group-hover:text-white transition-colors">Démarrer le test</span>
                                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
