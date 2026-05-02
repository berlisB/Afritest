import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { 
    ChevronRight, 
    Smartphone, 
    Globe, 
    Wifi, 
    Zap, 
    AlertCircle, 
    CheckCircle2, 
    X, 
    Plus, 
    Star, 
    MessageSquare,
    Monitor,
    Camera,
    ClipboardList,
    ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Create({ application, testSession }) {
    const { data, setData, post, processing, errors } = useForm({
        device_model: '',
        device_os: '',
        browser: '',
        screen_size: '',
        connectivity: 'wifi',
        environment: application.type === 'web_app' ? 'browser' : 'real_device',
        features_tested: application.test_scope?.features?.map(f => ({
            feature: f,
            status: 'pass',
            notes: ''
        })) || [],
        bugs: [],
        rating: 5,
        notes: '',
        screenshots: [], // URLs des captures générales
    });

    const [newBug, setNewBug] = useState({
        title: '',
        severity: 'medium',
        steps: '',
        expected: '',
        actual: '',
        screenshot: null
    });

    const addBug = () => {
        if (!newBug.title || !newBug.steps) return;
        setData('bugs', [...data.bugs, newBug]);
        setNewBug({ title: '', severity: 'medium', steps: '', expected: '', actual: '', screenshot: null });
    };

    const removeBug = (index) => {
        const newBugs = [...data.bugs];
        newBugs.splice(index, 1);
        setData('bugs', newBugs);
    };

    const updateFeature = (index, field, value) => {
        const features = [...data.features_tested];
        features[index][field] = value;
        setData('features_tested', features);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('test_reports.store', application.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Rapport QA</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{application.name}</p>
                    </div>
                </div>
            }
        >
            <Head title={`Rapport pour ${application.name}`} />

            <div className="py-12 bg-slate-50/50 min-h-screen">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-8 pb-20">
                        
                        {/* 1. ENVIRONNEMENT */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                    {application.type === 'web_app' ? <Globe className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Environnement de test</h3>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Détails techniques de votre session</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel value={application.type === 'web_app' ? "Système d'exploitation" : "Modèle de l'appareil"} className="text-[10px] font-black uppercase text-slate-500 mb-1" />
                                    <TextInput 
                                        className="w-full rounded-2xl border-slate-100 focus:ring-indigo-500"
                                        placeholder={application.type === 'web_app' ? "macOS, Windows 11..." : "iPhone 13, Samsung S22..."}
                                        value={data.device_model}
                                        onChange={(e) => setData('device_model', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <InputLabel value={application.type === 'web_app' ? "Navigateur & Version" : "Version de l'OS"} className="text-[10px] font-black uppercase text-slate-500 mb-1" />
                                    <TextInput 
                                        className="w-full rounded-2xl border-slate-100 focus:ring-indigo-500"
                                        placeholder={application.type === 'web_app' ? "Chrome 118, Safari 17..." : "iOS 17.2, Android 14..."}
                                        value={data.browser || data.device_os}
                                        onChange={(e) => application.type === 'web_app' ? setData('browser', e.target.value) : setData('device_os', e.target.value)}
                                        required
                                    />
                                </div>
                                {application.type === 'web_app' && (
                                    <div className="md:col-span-2">
                                        <InputLabel value="Résolution d'écran / Taille fenêtre" className="text-[10px] font-black uppercase text-slate-500 mb-1" />
                                        <TextInput 
                                            className="w-full rounded-2xl border-slate-100 focus:ring-indigo-500"
                                            placeholder="Ex: 1920x1080, Mobile View..."
                                            value={data.screen_size}
                                            onChange={(e) => setData('screen_size', e.target.value)}
                                        />
                                    </div>
                                )}
                                <div className="md:col-span-2">
                                    <InputLabel value="Type de connexion" className="text-[10px] font-black uppercase text-slate-500 mb-2" />
                                    <div className="flex flex-wrap gap-2">
                                        {['wifi', '4g', '3g', 'offline'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setData('connectivity', type)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    data.connectivity === type 
                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                                                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 2. CHECKLIST FEATURES */}
                        {data.features_tested.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                                        <ClipboardList className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Checklist des fonctionnalités</h3>
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Points spécifiques demandés par le dev</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {data.features_tested.map((item, idx) => (
                                        <div key={idx} className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-grow">
                                                    <p className="font-black text-slate-800 text-sm uppercase tracking-tight mb-1">{item.feature}</p>
                                                    <div className="flex gap-2">
                                                        {['pass', 'fail', 'skip'].map((status) => (
                                                            <button
                                                                key={status}
                                                                type="button"
                                                                onClick={() => updateFeature(idx, 'status', status)}
                                                                className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                                                                    item.status === status 
                                                                    ? (status === 'pass' ? 'bg-emerald-600 text-white' : status === 'fail' ? 'bg-rose-600 text-white' : 'bg-slate-400 text-white')
                                                                    : 'bg-white text-slate-300 border border-slate-100'
                                                                }`}
                                                            >
                                                                {status === 'pass' ? 'Validé' : status === 'fail' ? 'Échec' : 'Ignoré'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="w-full md:w-1/2">
                                                    <TextInput 
                                                        className="w-full text-xs rounded-xl border-slate-100"
                                                        placeholder="Notes optionnelles sur ce point..."
                                                        value={item.notes}
                                                        onChange={(e) => updateFeature(idx, 'notes', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* 3. BUGS */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                                    <ShieldAlert className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Rapport de Bugs</h3>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Signalez les problèmes rencontrés</p>
                                </div>
                            </div>

                            {/* Liste des bugs */}
                            <div className="space-y-4 mb-8">
                                <AnimatePresence>
                                    {data.bugs.map((bug, idx) => (
                                        <motion.div 
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="bg-rose-50/50 rounded-3xl p-6 border border-rose-100 relative group"
                                        >
                                            <button 
                                                type="button" 
                                                onClick={() => removeBug(idx)}
                                                className="absolute top-4 right-4 p-2 text-rose-300 hover:text-rose-600 transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                                    bug.severity === 'critical' ? 'bg-rose-600 text-white' : 
                                                    bug.severity === 'high' ? 'bg-orange-500 text-white' : 
                                                    'bg-yellow-400 text-yellow-900'
                                                }`}>
                                                    {bug.severity}
                                                </span>
                                                <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">{bug.title}</h4>
                                            </div>
                                            <p className="text-xs text-slate-500 font-bold leading-relaxed">{bug.steps}</p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Formulaire ajout bug */}
                            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Ajouter un nouveau bug</h4>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <TextInput 
                                            className="w-full rounded-2xl border-slate-100" 
                                            placeholder="Titre court du bug..."
                                            value={newBug.title}
                                            onChange={(e) => setNewBug({...newBug, title: e.target.value})}
                                        />
                                        <select 
                                            className="w-full rounded-2xl border-slate-100 text-xs font-black uppercase tracking-widest text-slate-500"
                                            value={newBug.severity}
                                            onChange={(e) => setNewBug({...newBug, severity: e.target.value})}
                                        >
                                            <option value="low">Sévérité : Basse</option>
                                            <option value="medium">Sévérité : Moyenne</option>
                                            <option value="high">Sévérité : Haute</option>
                                            <option value="critical">Sévérité : Critique</option>
                                        </select>
                                    </div>
                                    <textarea 
                                        className="w-full rounded-2xl border-slate-100 text-sm font-bold min-h-[80px]"
                                        placeholder="Étapes pour reproduire le bug..."
                                        value={newBug.steps}
                                        onChange={(e) => setNewBug({...newBug, steps: e.target.value})}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <TextInput 
                                            className="w-full rounded-2xl border-slate-100" 
                                            placeholder="Comportement attendu..."
                                            value={newBug.expected}
                                            onChange={(e) => setNewBug({...newBug, expected: e.target.value})}
                                        />
                                        <TextInput 
                                            className="w-full rounded-2xl border-slate-100" 
                                            placeholder="Comportement observé..."
                                            value={newBug.actual}
                                            onChange={(e) => setNewBug({...newBug, actual: e.target.value})}
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={addBug}
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Enregistrer ce bug
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* 4. FEEDBACK FINAL */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl">
                                    <Star className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Verdict Final</h3>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Note globale et commentaires</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <InputLabel value="Note de l'application" className="text-[10px] font-black uppercase text-slate-500 mb-4 text-center" />
                                    <div className="flex justify-center gap-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setData('rating', star)}
                                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                                                    data.rating >= star 
                                                    ? 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-100 scale-110' 
                                                    : 'bg-slate-50 text-slate-300'
                                                }`}
                                            >
                                                <Star className={`w-6 h-6 ${data.rating >= star ? 'fill-yellow-900' : ''}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <InputLabel value="Commentaires généraux / Suggestions" className="text-[10px] font-black uppercase text-slate-500 mb-2" />
                                    <textarea 
                                        className="w-full rounded-3xl border-slate-100 text-sm font-bold min-h-[120px] p-6"
                                        placeholder="Que pensez-vous de l'application dans son ensemble ?"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* SUBMIT */}
                        <div className="flex justify-end items-center gap-6">
                            <Link href={route('applications.show', application.id)} className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-colors">
                                Annuler
                            </Link>
                            <PrimaryButton 
                                disabled={processing} 
                                className="px-12 py-5 rounded-3xl text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-200"
                            >
                                Soumettre le rapport définitif
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
