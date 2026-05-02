# 🌍 AfriTest

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Laravel](https://img.shields.io/badge/Laravel-11.x-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org)

**AfriTest** est la première plateforme communautaire de QA (Quality Assurance) dédiée aux applications mobiles et web en Afrique. Elle connecte les développeurs à un pool de testeurs locaux pour garantir la qualité logicielle dans les conditions réelles du marché africain.

---

## ✨ Fonctionnalités Clés

- 🚀 **Soumission d'Apps** : Les développeurs peuvent soumettre leurs APK/IPA ou liens Web pour test.
- 👥 **Gestion des Testeurs** : Système d'assignation intelligente et pool de testeurs actifs.
- 📊 **Rapports de Test Détaillés** : Suivi des bugs, feedback UX et spécifications d'environnement (OS, Appareil, Réseau).
- 🤖 **Google Play closed tracks** : Automatisation du processus de validation des 14 jours (20 testeurs) requis par Google Play.
- 📱 **Branding Premium** : Une interface moderne pensée pour l'engagement.
- 💬 **Communauté Intégrée** : Liens directs vers les groupes WhatsApp et Discord pour une collaboration en temps réel.

---

## 🛠 Stack Technique

- **Backend** : Laravel 11.x
- **Frontend** : React.js (via Inertia.js)
- **Styling** : Tailwind CSS & Framer Motion
- **Database** : PostgreSQL (Neon recommandé)
- **PDF Generation** : DomPDF

---

## 🚀 Installation Locale

### Prérequis
- PHP 8.2+
- Composer
- Node.js & NPM
- PostgreSQL

### Étapes

1. **Cloner le projet**
   ```bash
   git clone https://github.com/berlisB/Afritest.git
   cd Afritest
   ```

2. **Installer les dépendances**
   ```bash
   composer install
   npm install
   ```

3. **Configuration de l'environnement**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *N'oubliez pas de configurer vos accès DB dans le fichier `.env`.*

4. **Migrations et Seeders**
   ```bash
   php artisan migrate --seed
   ```

5. **Lancer le projet**
   ```bash
   # Terminal 1 (Laravel server)
   php artisan serve
   
   # Terminal 2 (Vite for React)
   npm run dev
   ```

---

## 🤝 Contribution

Les contributions sont ce qui rend la communauté open source incroyable ! 
1. **Fork** le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une **Pull Request**

---

## 💬 Communauté

Rejoignez-nous pour discuter du projet et de la QA en Afrique :
- [WhatsApp Community](https://chat.whatsapp.com/FHBlsIHdNc66GuPxv2QwCx)
- [Discord Server](#) (Bientôt)

---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
