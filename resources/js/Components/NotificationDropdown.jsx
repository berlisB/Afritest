import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@inertiajs/react';

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(route('notifications.index'));
            const data = await response.json();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Optionnel : Polling toutes les 60 secondes
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            await fetch(route('notifications.read', id), { method: 'POST', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content } });
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (e) {
            console.error(e);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch(route('notifications.read-all'), { method: 'POST', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content } });
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-3 w-80 z-50 bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden"
                        >
                            <div className="p-5 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={markAllAsRead}
                                        className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-tighter"
                                    >
                                        Tout marquer comme lu
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="p-10 text-center">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-200">
                                            <Bell className="w-6 h-6" />
                                        </div>
                                        <p className="text-xs font-bold text-slate-400">Aucune notification</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-50">
                                        {notifications.map((n) => (
                                            <div 
                                                key={n.id} 
                                                className={`p-4 hover:bg-slate-50 transition-all relative group ${!n.is_read ? 'bg-indigo-50/30' : ''}`}
                                            >
                                                {!n.is_read && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>
                                                )}
                                                <div className="flex gap-3">
                                                    <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                                                        n.type === 'test_assigned' ? 'bg-emerald-50 text-emerald-600' :
                                                        n.type === 'report_submitted' ? 'bg-indigo-50 text-indigo-600' :
                                                        'bg-amber-50 text-amber-600'
                                                    }`}>
                                                        {n.type === 'test_assigned' ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="text-xs font-black text-slate-900 leading-tight">{n.title}</p>
                                                        <p className="text-[11px] text-slate-500 font-medium mt-1 line-clamp-2">{n.message}</p>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase">
                                                                {new Date(n.created_at).toLocaleDateString()}
                                                            </span>
                                                            {!n.is_read && (
                                                                <button 
                                                                    onClick={() => markAsRead(n.id)}
                                                                    className="text-[9px] font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    Lu
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-slate-50 text-center">
                                <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                                    Voir tout l'historique
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
