# AATW_Groupe5

# 🚀 Guide d’installation complet du projet AATW_Groupe5

Ce document décrit **toutes les étapes complètes** pour installer et exécuter le projet **AATW_Groupe5** (Backend Laravel + Frontend React).

---

## Prérequis

- Ordinateur sous Windows / Linux / macOS
- Connexion Internet
- Git installé
- Droits administrateur

---

## 1️⃣ Cloner le dépôt GitHub

```bash
git clone https://github.com/Patrickdoch130207/AATW_Groupe5.git

cd AATW_Groupe5
```

---

## 2️⃣ Installer les outils nécessaires

### Node.js et npm

Téléchargement : https://nodejs.org/

```bash
node -v
npm -v
```

### XAMPP (Apache + MySQL)

Téléchargement : https://www.apachefriends.org/fr/index.html

Démarrer Apache et MySQL depuis le panneau XAMPP.

### Composer

Téléchargement : https://getcomposer.org/download/

```bash
composer -V
```

---

## 3️⃣ Installation du backend (Laravel)

```bash

cd myApp/backend
composer install
cp .env.example .env
php artisan key:generate
```

---

## 4️⃣ Configuration de la base de données

Créer une base de données via phpMyAdmin.

Modifier le fichier `.env` :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=aatw_groupe5_db
DB_USERNAME=root
DB_PASSWORD=
```

---

## 5️⃣ Migration de la base de données

```bash
php artisan migrate:fresh
```

---

## 6️⃣ Création de l’administrateur

Modifier si besoin :
`database/seeders/AdminUserSeeder.php`

Identifiants par défaut :

- Email : admin@test.com
- Mot de passe : patrickadmin1234

Lancer le seeder :

```bash
php artisan db:seed
```

---

## 7️⃣ Lancer le serveur backend

```bash
php artisan serve
```

URL : http://127.0.0.1:8000

---

## 8️⃣ Installation du frontend

```bash
cd ../frontend/client
npm install
npm run dev
```

URL frontend (par défaut) : http://localhost:5173

---

## ✅ Installation terminée

Le projet AATW_Groupe5 est maintenant opérationnel.
