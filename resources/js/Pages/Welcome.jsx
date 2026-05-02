import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    ChevronRight, 
    Smartphone, 
    ShieldCheck, 
    Zap, 
    Users, 
    MessageSquare, 
    ArrowRight,
    Star,
    Globe,
    CheckCircle2,
    Layout,
    Layers,
    ExternalLink,
    Play,
    Target,
    Trophy,
    TrendingUp,
    Monitor
} from 'lucide-react';
import { motion } from 'framer-motion';

const Welcome = ({ auth, topApps = [], topTesters = [] }) => {
    return (
        <div className="min-h-screen bg-[#FDFDFF] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans overflow-x-hidden">
            <Head title="AfriTest - QA & Testing d'Applications en Afrique" />

            {/* Premium Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100/50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
                            <span className="text-white font-black text-xl italic">A</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-900">AFRITEST</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#solution" className="text-[10px] font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]">Solution</a>
                        <a href="#testeurs" className="text-[10px] font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]">Testeurs</a>
                        <a href="#communaute" className="text-[10px] font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]">Communauté</a>
                    </div>

                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link 
                                href={route('dashboard')}
                                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all"
                            >
                                Mon Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Connexion</Link>
                                <Link 
                                    href={route('register')}
                                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all"
                                >
                                    S'inscrire
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[120px] opacity-60 pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-[100px] opacity-60 pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="flex-1 space-y-10 text-center lg:text-left">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full"
                            >
                                <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">La référence QA en Afrique</span>
                            </motion.div>

                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight"
                            >
                                Déployez avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400 italic">Confiance.</span>
                            </motion.h1>

                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0"
                            >
                                Connectez vos applications à une communauté de <span className="text-slate-900 font-bold underline decoration-indigo-200 underline-offset-4">+1000 testeurs actifs</span> en Afrique. Identifiez les bugs avant vos utilisateurs.
                            </motion.p>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row items-center gap-6 pt-4 justify-center lg:justify-start"
                            >
                                <Link 
                                    href={route('register')}
                                    className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 group"
                                >
                                    Lancer un test
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link 
                                    href={route('applications.index')}
                                    className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-slate-900 transition-all flex items-center justify-center gap-3"
                                >
                                    Explorer le feed
                                </Link>
                            </motion.div>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="flex-1 relative hidden lg:block"
                        >
                            <div className="relative z-10 bg-white rounded-[3rem] p-4 shadow-2xl shadow-indigo-100 border border-slate-100">
                                <div className="bg-slate-50 rounded-[2.5rem] p-8 overflow-hidden relative">
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600">
                                                <Smartphone className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 text-sm">Dashboard QA</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live monitoring</p>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                            En cours
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Bugs identifiés', val: '24', color: 'text-rose-600' },
                                            { label: 'Rapports soumis', val: '142', color: 'text-indigo-600' },
                                            { label: 'Score UX', val: '9.2', color: 'text-emerald-600' }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center border border-slate-50">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</span>
                                                <span className={`text-sm font-black ${stat.color}`}>{stat.val}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-slate-200/50">
                                        <div className="flex gap-2">
                                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div className="w-3/4 h-full bg-indigo-600 rounded-full" />
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase mt-4 tracking-widest">Progression des tests fermés</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-slate-900 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-10"
                    >
                        {[
                            { label: 'Applications testées', val: '250+' },
                            { label: 'Testeurs certifiés', val: '1,200+' },
                            { label: 'Bugs critiques fixés', val: '4,500+' },
                            { label: 'Pays couverts', val: '15+' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center space-y-2">
                                <h3 className="text-4xl font-black text-white">{stat.val}</h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Solution Section */}
            <section id="solution" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-20 space-y-6"
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
                            Pourquoi choisir <span className="italic">AfriTest</span> ?
                        </h2>
                        <p className="text-lg text-slate-500 font-medium">
                            Nous avons construit le pont entre les développeurs ambitieux et la réalité du marché mobile africain.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { 
                                icon: Globe, 
                                title: "Réalité Locale", 
                                desc: "Vos applications sont testées sur des réseaux et des appareils réels utilisés par vos futurs clients en Afrique.",
                                color: "bg-indigo-50 text-indigo-600"
                            },
                            { 
                                icon: ShieldCheck, 
                                title: "QA Certifiée", 
                                desc: "Nos testeurs suivent des protocoles rigoureux pour vous fournir des rapports exploitables immédiatement.",
                                color: "bg-emerald-50 text-emerald-600"
                            },
                            { 
                                icon: Zap, 
                                title: "Rapidité Fatale", 
                                desc: "Lancez votre campagne de test en 5 minutes et recevez les premiers retours en moins de 24 heures.",
                                color: "bg-amber-50 text-amber-600"
                            }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-10 bg-white rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all"
                            >
                                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Google Play Section */}
            <section className="py-20 px-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-7xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-24 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <Smartphone className="w-[500px] h-[500px]" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-20">
                        <div className="flex-1 space-y-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-indigo-400">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exclusivité Google Play</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                                Validez vos <span className="text-indigo-400 italic">14 jours</span> de test fermé.
                            </h2>
                            <p className="text-xl text-slate-400 font-medium leading-relaxed">
                                Google Play exige désormais 20 testeurs actifs pendant 14 jours consécutifs. AfriTest automatise ce processus pour vous en fournissant les testeurs et la preuve d'activité.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Génération automatique de la liste d'emails",
                                    "Suivi d'activité quotidien garanti",
                                    "Rapports de bugs complets pour la console Google"
                                ].map((check, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + (i * 0.1) }}
                                        className="flex items-center gap-4 text-white font-bold text-sm"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                                        {check}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="w-full lg:w-1/3"
                        >
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 space-y-8 text-center">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pack Validation Play</h4>
                                <div>
                                    <span className="text-5xl font-black text-white">Gratuit</span>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase mt-2">Pendant la bêta</p>
                                </div>
                                <Link 
                                    href={route('register')}
                                    className="block w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-400 transition-all"
                                >
                                    Démarrer maintenant
                                </Link>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Aucune carte requise</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Testeurs Hall of Fame */}
            <section id="testeurs" className="py-32 px-6">
                <div className="max-w-7xl mx-auto text-center space-y-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
                            Nos Experts <span className="italic">Elite.</span>
                        </h2>
                        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                            Découvrez les testeurs les plus actifs de la communauté AfriTest.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                        {topTesters.map((tester, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:-translate-y-2 transition-all"
                            >
                                <div className="w-20 h-20 rounded-2xl bg-slate-50 mx-auto mb-4 overflow-hidden border-2 border-indigo-50 flex items-center justify-center font-black text-slate-300">
                                    {tester.name.charAt(0)}
                                </div>
                                <h4 className="text-sm font-black text-slate-900 truncate">{tester.name}</h4>
                                <div className="flex items-center justify-center gap-1 mt-2">
                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Elite QA</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section id="communaute" className="py-32 px-6 bg-indigo-50/30">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1 space-y-8"
                        >
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
                                Rejoignez le <span className="italic">Mouvement.</span>
                            </h2>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed">
                                Plus qu'une plateforme, nous sommes une communauté d'experts QA et de développeurs.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a 
                                    href="https://chat.whatsapp.com/FHBlsIHdNc66GuPxv2QwCx" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 bg-[#25D366] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3 shadow-xl shadow-green-200"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    Communauté WhatsApp
                                </a>
                                <a 
                                    href="#" 
                                    className="px-8 py-4 bg-[#5865F2] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3 shadow-xl shadow-indigo-200"
                                >
                                    <Globe className="w-5 h-5" />
                                    Serveur Discord
                                </a>
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1 grid grid-cols-2 gap-6"
                        >
                            <div className="space-y-6 pt-12">
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black">
                                        +50
                                    </div>
                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-relaxed">Nouveaux testeurs / semaine</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-sm space-y-4 text-white">
                                    <Users className="w-8 h-8 text-indigo-400" />
                                    <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Support communautaire 24/7</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
                    <div className="space-y-8">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                                <span className="text-white font-black text-xl italic">A</span>
                            </div>
                            <span className="text-xl font-black tracking-tighter text-slate-900">AFRITEST</span>
                        </div>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed">
                            Accélérer la qualité logicielle en Afrique par la force de la communauté.
                        </p>
                    </div>
                    
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Plateforme</h4>
                        <div className="flex flex-col gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <Link href={route('applications.index')} className="hover:text-slate-900 transition-colors">Explorer</Link>
                            <Link href={route('register')} className="hover:text-slate-900 transition-colors">S'inscrire</Link>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Contact</h4>
                        <div className="flex flex-col gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <p>contact@afritest.com</p>
                            <p>Lomé • Abidjan</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Légal</h4>
                        <div className="flex flex-col gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <a href="#" className="hover:text-slate-900 transition-colors">Confidentialité</a>
                            <a href="#" className="hover:text-slate-900 transition-colors">CGU</a>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-slate-50 flex justify-between items-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">© 2024 AfriTest.</p>
                    <div className="flex gap-4">
                        <a href="https://chat.whatsapp.com/FHBlsIHdNc66GuPxv2QwCx" className="text-slate-300 hover:text-[#25D366] transition-colors">
                            <MessageSquare className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Welcome;
