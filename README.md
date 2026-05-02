# 🌍 AfriTest - La Plateforme de QA pour l'Afrique

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Laravel](https://img.shields.io/badge/Laravel-11.x-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org)
[![Discord](https://img.shields.io/badge/Discord-Join-7289DA.svg)](#)

> **Garantissez la qualité de vos applications sur le terrain africain.**

AfriTest connecte les développeurs à une communauté de testeurs locaux passionnés. Que vous soyez une startup cherchant à valider son MVP ou un développeur solo visant le Google Play Store, AfriTest est votre partenaire de confiance.

---

## 🚀 Pourquoi AfriTest ?

Le déploiement d'applications en Afrique présente des défis uniques : diversité des réseaux (2G/3G/4G/5G), parité des appareils, et spécificités de paiement (Orange Money, MoMo, etc.). 

**AfriTest résout cela en :**
1.  **Testant en conditions réelles** : Vos apps sont testées par de vrais utilisateurs sur des appareils réels.
2.  **Validant les fermetures Google Play** : Notre pool de testeurs vous aide à remplir l'exigence des 20 testeurs pendant 14 jours.
3.  **Fournissant des rapports actionnables** : Pas seulement des rapports de bugs, mais du feedback UX sur la "vibe" locale de votre produit.

---

## ✨ Fonctionnalités Clés

- **Dashboard Unifié** : Gérez vos soumissions et consultez vos rapports en un clin d'œil.
- **Gestion des Exigences** : Importez vos fichiers PDF/DOCX ou créez une checklist interactive.
- **IA/Vibe Coding Awareness** : Signalement transparent des apps générées par IA pour une vigilance accrue.
- **Emails de Test Google Play** : Génération automatique des listes de testeurs pour votre console.
- **Branding Premium** : Une UI moderne, rapide et responsive.

---

## 🛠 Stack Technique

- **Core** : Laravel 11 (PHP 8.2+)
- **Frontend** : Inertia.js + React 18 + Framer Motion
- **Design** : Tailwind CSS (Design System Premium)
- **Database** : PostgreSQL / Neon
- **Notifications** : WhatsApp Integration via Jobs

---

## 💻 Installation & Configuration

### 1. Cloner le projet
```bash
git clone https://github.com/berlisB/Afritest.git
cd Afritest
```

### 2. Dépendances & Clé
```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
```

### 3. Base de données
Configurez votre `.env` :
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=afritest
DB_USERNAME=votre_user
DB_PASSWORD=votre_password
```
Puis lancez les migrations :
```bash
php artisan migrate --seed
```

### 4. Lancement
```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev
```

---

## 🤝 Contribuer

Nous adorons les Pull Requests ! Veuillez consulter notre [Guide de Contribution](CONTRIBUTING.md) pour commencer. 

---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---
*Fait avec ❤️ pour l'écosystème tech africain.* 🌍🚀
