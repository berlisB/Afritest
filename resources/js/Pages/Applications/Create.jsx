import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { 
    Layout, 
    Link as LinkIcon, 
    ClipboardList, 
    Rocket, 
    X, 
    Plus,
    Smartphone,
    Globe,
    CheckCircle2,
    Calendar,
    Users as UsersIcon,
    AlertCircle,
    Image as ImageIcon,
    Upload,
    Mail,
    Lock,
    Zap,
    ChevronRight,
    ArrowLeft,
    Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Create() {
    const [step, setStep] = useState(1);
    const fileInputRef = useRef(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        type: 'mobile_app',
        platform: 'android',
        is_vibe_coded: 'no',
        url: '',
        store_link: '',
        apk_url: '',
        test_credentials: { email: '', password: '' },
        // Les emails Google Play sont maintenant générés automatiquement par le backend
        expected_testers: 14,
        deadline: '',
        is_open: true,
        status: 'draft',
        test_scope: {
            features: [], 
            scenarios: '',
            known_issues: ''
        },
        logo_file: null
    });

    const [newFeature, setNewFeature] = useState('');

    const addFeature = () => {
        if (!newFeature.trim()) return;
        setData('test_scope', {
            ...data.test_scope,
            features: [...data.test_scope.features, newFeature.trim()]
        });
        setNewFeature('');
    };

    const removeFeature = (index) => {
        const features = [...data.test_scope.features];
        features.splice(index, 1);
        setData('test_scope', {
            ...data.test_scope,
            features: features
        });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('logo_file', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (finalStatus) => {
        post(route('applications.store'), {
            onBefore: () => {
                data.status = finalStatus;
            }
        });
    };

    const validateStep = () => {
        if (step === 1) {
            return data.name.trim() !== '' && 
                   data.description.trim() !== '' && 
                   data.type !== '' && 
                   data.platform !== '';
        }
        if (step === 2) {
            if (data.type === 'web_app' || data.platform === 'web') {
                return data.url && data.url.trim() !== '';
            }
            return (data.apk_url && data.apk_url.trim() !== '') || 
                   (data.store_link && data.store_link.trim() !== '');
        }
        if (step === 3) {
            return data.expected_testers > 0 && data.deadline !== '';
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep(step + 1);
        } else {
            // On pourrait utiliser un toast ici, mais pour l'instant alert est efficace
            alert('Veuillez remplir les champs obligatoires pour continuer.');
        }
    };

    const steps = [
        { id: 1, title: 'Identité', icon: Layout },
        { id: 2, title: 'Accès', icon: LinkIcon },
        { id: 3, title: 'Exigences', icon: ClipboardList },
        { id: 4, title: 'Lancement', icon: Rocket }
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4 py-2">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <Rocket className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Soumettre une Application</h2>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-0.5">Propulsez votre projet vers la perfection</p>
                    </div>
                </div>
            }
        >
            <Head title="Soumettre une App" />

            <div className="py-12 bg-[#F8FAFC] min-h-screen">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Stepper Premium */}
                    <div className="mb-12 relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
                        <div className="flex justify-between relative z-10">
                            {steps.map((s) => (
                                <div key={s.id} className="flex flex-col items-center">
                                    <motion.div 
                                        initial={false}
                                        animate={{ 
                                            backgroundColor: step >= s.id ? '#4F46E5' : '#FFFFFF',
                                            scale: step === s.id ? 1.2 : 1,
                                            borderColor: step >= s.id ? '#4F46E5' : '#E2E8F0'
                                        }}
                                        className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-colors duration-300 shadow-xl ${step >= s.id ? 'text-white' : 'text-slate-400'}`}
                                    >
                                        <s.icon className="w-5 h-5" />
                                    </motion.div>
                                    <span className={`mt-3 text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                                        {s.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden">
                        <div className="p-8 md:p-12">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <AnimatePresence mode="wait">
                                    
                                    {/* ÉTAPE 1 : Identité & Logo */}
                                    {step === 1 && (
                                        <motion.div 
                                            key="step1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-8"
                                        >
                                            <div className="flex flex-col md:flex-row gap-10">
                                                {/* Upload Logo */}
                                                <div className="flex flex-col items-center">
                                                    <InputLabel value="Logo de l'app" className="mb-4 text-slate-400 uppercase text-[10px] font-black tracking-widest text-center" />
                                                    <div 
                                                        onClick={() => fileInputRef.current.click()}
                                                        className="w-40 h-40 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all group relative overflow-hidden"
                                                    >
                                                        {logoPreview ? (
                                                            <img src={logoPreview} className="w-full h-full object-cover" alt="Logo preview" />
                                                        ) : (
                                                            <>
                                                                <Upload className="w-8 h-8 text-slate-300 group-hover:text-indigo-500 mb-2 transition-colors" />
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Choisir image</span>
                                                            </>
                                                        )}
                                                        <input 
                                                            type="file" 
                                                            ref={fileInputRef} 
                                                            onChange={handleLogoChange} 
                                                            className="hidden" 
                                                            accept="image/*"
                                                        />
                                                    </div>
                                                    <InputError message={errors.logo_file} className="mt-2" />
                                                </div>

                                                <div className="flex-grow space-y-6">
                                                    <div>
                                                        <InputLabel htmlFor="name" value="Nom de l'application *" className="text-slate-600 uppercase text-[10px] font-black tracking-widest mb-1" />
                                                        <TextInput 
                                                            id="name" 
                                                            className="block w-full rounded-2xl" 
                                                            value={data.name} 
                                                            placeholder="Ex: AfriPay Messenger"
                                                            onChange={(e) => setData('name', e.target.value)} 
                                                            required 
                                                        />
                                                        <InputError message={errors.name} className="mt-2" />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <InputLabel htmlFor="type" value="Type" className="text-slate-600 uppercase text-[10px] font-black tracking-widest mb-1" />
                                                            <div className="relative">
                                                                <select id="type" className="mt-1 block w-full border-slate-200 focus:border-indigo-500 rounded-2xl shadow-sm text-sm font-bold p-3 pr-10 appearance-none bg-white" value={data.type} onChange={(e) => setData('type', e.target.value)}>
                                                                    <option value="mobile_app">Mobile App</option>
                                                                    <option value="web_app">Web App</option>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div>
                                                            <InputLabel value="Type d'application *" className="text-slate-600 uppercase text-[10px] font-black tracking-widest mb-1" />
                                                            <div className="flex gap-4">
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => setData('type', 'mobile_app')}
                                                                    className={`flex-grow p-4 rounded-2xl border-2 transition-all font-bold text-xs ${data.type === 'mobile_app' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 bg-white text-slate-400'}`}
                                                                >
                                                                    Mobile App
                                                                </button>
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => setData('type', 'web_app')}
                                                                    className={`flex-grow p-4 rounded-2xl border-2 transition-all font-bold text-xs ${data.type === 'web_app' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 bg-white text-slate-400'}`}
                                                                >
                                                                    Web App
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <InputLabel value="Plateforme *" className="text-slate-600 uppercase text-[10px] font-black tracking-widest mb-1" />
                                                            <select 
                                                                className="block w-full rounded-2xl border-slate-200 bg-white p-4 text-xs font-bold shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                                value={data.platform}
                                                                onChange={(e) => setData('platform', e.target.value)}
                                                            >
                                                                <option value="">Sélectionner...</option>
                                                                <option value="android">Android</option>
                                                                <option value="ios">iOS</option>
                                                                <option value="both">Android & iOS</option>
                                                                <option value="web">Web</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="description" value="Description & Vision *" className="text-slate-600 uppercase text-[10px] font-black tracking-widest mb-1" />
                                                <textarea 
                                                    id="description" 
                                                    className="mt-1 block w-full border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-3xl shadow-sm min-h-[120px] p-6 text-sm font-bold text-slate-700" 
                                                    value={data.description} 
                                                    placeholder="Décrivez brièvement votre application et ses objectifs..."
                                                    onChange={(e) => setData('description', e.target.value)} 
                                                    required 
                                                />
                                                <InputError message={errors.description} className="mt-2" />
                                            </div>

                                            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
                                                <div className="p-3 bg-white rounded-2xl h-fit shadow-sm">
                                                    <Zap className="w-5 h-5 text-amber-500" />
                                                </div>
                                                <div>
                                                    <InputLabel value="L'application a-t-elle été développée avec Vibe Coding ? *" className="text-slate-600 uppercase text-[10px] font-black tracking-widest mb-1" />
                                                    <div className="flex gap-4">
                                                        {['yes', 'no', 'partially'].map((v) => (
                                                            <button 
                                                                key={v}
                                                                type="button"
                                                                onClick={() => setData('is_vibe_coded', v)}
                                                                className={`flex-grow p-4 rounded-2xl border-2 transition-all font-bold text-xs uppercase ${data.is_vibe_coded === v ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 bg-white text-slate-400'}`}
                                                            >
                                                                {v === 'yes' ? 'Oui' : v === 'no' ? 'Non' : 'En partie'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* ÉTAPE 2 : Liens & Accès */}
                                    {step === 2 && (
                                        <motion.div 
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-8"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                            <LinkIcon className="w-4 h-4" />
                                                        </div>
                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Liens de diffusion</h4>
                                                    </div>

                                                    {data.type === 'web_app' || data.platform === 'web' ? (
                                                        <div>
                                                            <InputLabel htmlFor="url" value="URL du site *" className="text-slate-600 uppercase text-[10px] font-black tracking-widest mb-1" />
                                                            <TextInput id="url" type="url" className="block w-full rounded-2xl" value={data.url} placeholder="https://votre-app.com" onChange={(e) => setData('url', e.target.value)} />
                                                            <InputError message={errors.url} className="mt-2" />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div>
                                                                <InputLabel htmlFor="apk_url" value="Lien APK / TestFlight *" className="text-slate-600 uppercase text-[10px] font-black tracking-widest mb-1" />
                                                                <TextInput id="apk_url" type="url" className="block w-full rounded-2xl" value={data.apk_url} placeholder="https://drive.google.com/..." onChange={(e) => setData('apk_url', e.target.value)} />
                                                                <InputError message={errors.apk_url} className="mt-2" />
                                                            </div>
                                                            <div>
                                                                <InputLabel htmlFor="store_link" value="Lien Play Store / App Store" className="text-slate-600 uppercase text-[10px] font-black tracking-widest mb-1" />
                                                                <TextInput id="store_link" type="url" className="block w-full rounded-2xl" value={data.store_link} placeholder="Optionnel" onChange={(e) => setData('store_link', e.target.value)} />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                                                            <Lock className="w-4 h-4" />
                                                        </div>
                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Comptes de test</h4>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4">
                                                        <div className="relative">
                                                            <InputLabel htmlFor="test_email" value="Email de test (Optionnel)" className="text-slate-600 uppercase text-[10px] font-black tracking-widest mb-1" />
                                                            <div className="relative">
                                                                <TextInput id="test_email" type="text" className="block w-full rounded-2xl pl-10" value={data.test_credentials.email} placeholder="test@example.com" onChange={(e) => setData('test_credentials', { ...data.test_credentials, email: e.target.value })} />
                                                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                            </div>
                                                        </div>
                                                        <div className="relative">
                                                            <InputLabel htmlFor="test_password" value="Mot de passe (Optionnel)" className="text-slate-600 uppercase text-[10px] font-black tracking-widest mb-1" />
                                                            <div className="relative">
                                                                <TextInput id="test_password" type="text" className="block w-full rounded-2xl pl-10" value={data.test_credentials.password} placeholder="password123" onChange={(e) => setData('test_credentials', { ...data.test_credentials, password: e.target.value })} />
                                                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Google Play Tester Generation Info */}
                                            {(data.platform === 'android' || data.platform === 'both') && (
                                                <div className="p-8 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                                        <Monitor className="w-20 h-20" />
                                                    </div>
                                                    <div className="relative z-10 space-y-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                                            </div>
                                                            <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400">Configuration Test Google Play (Auto)</h4>
                                                        </div>
                                                        <p className="text-xs font-medium text-slate-400 max-w-xl leading-relaxed">
                                                            AfriTest générera automatiquement pour vous une liste de testeurs qualifiés. 
                                                            Vous pourrez récupérer leurs emails dans votre dashboard après la publication pour les ajouter à votre Google Play Console.
                                                        </p>
                                                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                                            <UsersIcon className="w-5 h-5 text-indigo-400" />
                                                            <span className="text-xs font-black uppercase tracking-tighter">Nombre par défaut : 14 testeurs (Requis par Google)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* ÉTAPE 3 : Exigences & Checklist */}
                                    {step === 3 && (
                                        <motion.div 
                                            key="step3"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-8"
                                        >
                                            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Checklist des fonctionnalités</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Spécifiez ce que les testeurs DOIVENT vérifier</p>
                                                    </div>
                                                    <div className="px-3 py-1 bg-white rounded-full border border-slate-200 text-[10px] font-black text-indigo-600">
                                                        {data.test_scope.features.length} points
                                                    </div>
                                                </div>

                                                <div className="flex gap-3 mb-6">
                                                    <input 
                                                        type="text"
                                                        placeholder="Ex: Le bouton de paiement doit ouvrir la fenêtre Orange Money"
                                                        className="flex-grow bg-white border-slate-200 rounded-2xl p-3 text-sm font-bold shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                        value={newFeature}
                                                        onChange={(e) => setNewFeature(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                                    />
                                                    <button 
                                                        type="button"
                                                        onClick={addFeature}
                                                        className="px-6 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                                    >
                                                        Ajouter
                                                    </button>
                                                </div>

                                                <div className="pt-6 border-t border-slate-200">
                                                    <InputLabel value="Ou téléchargez un fichier d'exigences (PDF, DOCX)" className="text-slate-600 uppercase text-[10px] font-black tracking-widest mb-4" />
                                                    <div className="flex items-center gap-4">
                                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-3xl cursor-pointer bg-white hover:bg-slate-50 transition-all group">
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <Upload className="w-8 h-8 mb-3 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                                                <p className="mb-2 text-xs text-slate-500"><span className="font-black uppercase tracking-widest">Cliquez pour uploader</span></p>
                                                                <p className="text-[10px] text-slate-400">PDF, DOCX ou TXT (MAX. 5MB)</p>
                                                            </div>
                                                            <input 
                                                                type="file" 
                                                                className="hidden" 
                                                                accept=".pdf,.doc,.docx,.txt"
                                                                onChange={(e) => setData('requirements_file', e.target.files[0])}
                                                            />
                                                        </label>
                                                    </div>
                                                    {data.requirements_file && (
                                                        <div className="mt-4 flex items-center gap-2 text-indigo-600">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            <span className="text-xs font-bold">{data.requirements_file.name}</span>
                                                        </div>
                                                    )}
                                                    <InputError message={errors.requirements_file} className="mt-2" />
                                                </div>

                                                <div className="space-y-3">
                                                    {data.test_scope.features.map((feature, idx) => (
                                                        <motion.div 
                                                            layout
                                                            key={idx} 
                                                            className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 group shadow-sm"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center font-black text-[10px] text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                                    {idx + 1}
                                                                </div>
                                                                <span className="text-sm font-bold text-slate-700">{feature}</span>
                                                            </div>
                                                            <button 
                                                                type="button"
                                                                onClick={() => removeFeature(idx)}
                                                                className="p-2 text-slate-200 hover:text-rose-500 transition-colors"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </motion.div>
                                                    ))}
                                                    {data.test_scope.features.length === 0 && (
                                                        <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                                                            <ClipboardList className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                                            <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Votre checklist est vide</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <InputLabel value="Nombre de testeurs requis" className="text-slate-600 uppercase text-[10px] font-black tracking-widest mb-1" />
                                                    <div className="relative">
                                                        <TextInput type="number" className="w-full rounded-2xl pl-10" value={data.expected_testers} onChange={(e) => setData('expected_testers', e.target.value)} />
                                                        <UsersIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <InputLabel value="Date limite des tests *" className="text-slate-600 uppercase text-[10px] font-black tracking-widest mb-1" />
                                                    <div className="relative">
                                                        <TextInput type="date" className="w-full rounded-2xl pl-10" value={data.deadline} onChange={(e) => setData('deadline', e.target.value)} />
                                                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* ÉTAPE 4 : Lancement */}
                                    {step === 4 && (
                                        <motion.div 
                                            key="step4"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="space-y-8 text-center"
                                        >
                                            <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-200 mb-6">
                                                <Rocket className="w-10 h-10 text-white animate-bounce" />
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Prêt pour le décollage ?</h3>
                                            <p className="text-slate-500 font-bold max-w-md mx-auto">
                                                Vérifiez vos informations une dernière fois. Une fois publiée, votre application sera visible par toute la communauté AfriTest.
                                            </p>

                                            <div className="max-w-md mx-auto p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-4">
                                                <div 
                                                    onClick={() => setData('is_open', !data.is_open)}
                                                    className={`p-6 rounded-3xl border-2 transition-all cursor-pointer text-left ${
                                                        data.is_open 
                                                        ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-100' 
                                                        : 'border-slate-200 bg-slate-50 opacity-60'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Test Ouvert</h4>
                                                        {data.is_open && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                                                    </div>
                                                    <p className="text-xs font-medium text-slate-400 leading-relaxed">
                                                        Tout le monde peut voir et rejoindre votre test. Idéal pour un feedback massif.
                                                    </p>
                                                </div>

                                                <div 
                                                    onClick={() => setData('is_open', !data.is_open)}
                                                    className={`p-6 rounded-3xl border-2 transition-all cursor-pointer text-left ${
                                                        !data.is_open 
                                                        ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-100' 
                                                        : 'border-slate-200 bg-slate-50 opacity-60'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Test Fermé</h4>
                                                        {!data.is_open && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                                                    </div>
                                                    <p className="text-xs font-medium text-slate-400 leading-relaxed">
                                                        Seules les personnes que vous invitez peuvent accéder au test. Idéal pour la confidentialité.
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                </AnimatePresence>

                                {/* Navigation Footer */}
                                <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between">
                                    {step > 1 ? (
                                        <button
                                            type="button"
                                            onClick={() => setStep(step - 1)}
                                            className="flex items-center gap-2 px-6 py-3 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Précédent
                                        </button>
                                    ) : <div />}

                                    <div className="flex gap-4">
                                        {step < 4 ? (
                                            <button
                                                type="button"
                                                onClick={handleNext}
                                                className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
                                            >
                                                Suivant
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => submit('draft')}
                                                    disabled={processing}
                                                    className="px-8 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                                                >
                                                    Brouillon
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => submit('published')}
                                                    disabled={processing}
                                                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200"
                                                >
                                                    Publier l'App
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
