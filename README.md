#Système de Gestion de Formation 
Vue d’ensemble

Application Spring Boot pour gérer des formations : formateurs, participants, sessions, modules, séances, présences et paiements.
Back-end REST (Java 17 + Spring Boot 3) avec PostgreSQL. Front-end Vue.js (Vite).

Fonctionnalités

Rôles utilisateurs (base technique prête / RBAC à compléter selon besoin) :

Administrateur (gestion complète), Formateur, Participant.

Formateurs : création, mise à jour, suppression, consultation.

Participants : gestion complète + suivi du nombre d’heures de présence.

Sessions : planification (intitulé, dates, etc.).

Modules : rattachés à une session et à un formateur.

Séances : créneaux datés rattachés à un module.

Présences : pointage + bascule rapide présent/absent.

Paiements & Tranches : enregistrement des paiements d’un participant pour une session, avec tranches.

Architecture & technologies

Back-end : Spring Boot, Spring Web, Spring Data JPA, Validation.

Base : PostgreSQL.

Build : Maven.

Front-end : Vue 3, Vite, vue-router, axios.

API : REST/JSON.

Arborescence Java typique :

com.prestacode.systgestionformation
├─ config/               (CORS, etc.)
├─ controller/           (Contrôleurs REST)
├─ exception/            (Gestion globale des erreurs)
├─ model/                (Entités JPA)
├─ repository/           (Interfaces JPA)
└─ service/              (Logique métier)

Prérequis

Java 17

Maven 3.8+

PostgreSQL 13+ (base et utilisateur accessibles)

(Front) Node.js 18 ou 20 + npm

Configuration
1) PostgreSQL

Créez la base et un utilisateur :

CREATE DATABASE sgf;
CREATE USER sgf_user WITH ENCRYPTED PASSWORD 'sgf_pass';
GRANT ALL PRIVILEGES ON DATABASE sgf TO sgf_user;

2) application.properties (ou application.yml)
   spring.datasource.url=jdbc:postgresql://localhost:5432/sgf
   spring.datasource.username=sgf_user
   spring.datasource.password=sgf_pass
   spring.jpa.hibernate.ddl-auto=update   # (dev) create / update / validate
   spring.jpa.show-sql=true               # utile en dev
   spring.jpa.properties.hibernate.format_sql=true
   server.port=8080


Erreur « password authentication failed for user » : vérifiez l’utilisateur/mot de passe et les droits sur la base.

3) CORS (dev)

Le projet inclut une config CORS. En dev, autorisez http://localhost:5173 (Vite) si vous servez le front séparément.

▶Démarrage (Back-end)
# À la racine du projet Spring
mvn clean spring-boot:run
# ou
mvn clean package
java -jar target/*.jar


L’API est disponible sur http://localhost:8080.

Front-end (Vue)

Si vous utilisez un front « v6 » ou équivalent, il s’attend à l’API sur http://localhost:8080.

cd sgf_frontend
cp .env.example .env   # si présent
# VITE_API_BASE=http://localhost:8080

npm install
npm run dev            # http://localhost:5173

Déploiement via Spring (statique)
npm run build
# Copiez le contenu de dist/ dans le dossier static du back-end :
cp -r dist/* systeme-gestion-formation/src/main/resources/static/
# Redémarrez Spring Boot

Endpoints (aperçu)

La plupart des ressources suivent :
GET /{ressource}/all · GET /{ressource}/find/{id} · POST /{ressource}/add · PUT /{ressource}/update · DELETE /{ressource}/delete/{id}

Cas particuliers (conformes au code existant) :

Module

Créer : POST /module/add/{sessionId}
Body : { "nom": "...", "duree": 8, "formateur": { "id": 1 } }

Séance

Créer : POST /seance/add/{moduleId}
Body : { "date": "2025-09-01", "heureDebut": "09:00", "heureFin": "12:00" }

Paiement

Créer : POST /paiement/add?participantId=...&sessionId=...&montant=...&date=YYYY-MM-DD
(corps JSON vide)

Selon le contrôleur, PUT /paiement/update peut ne pas exister.

Tranche

Créer : POST /tranche/add/{paiementId}
Body : { "date": "2025-09-01", "montant": 100 }

Présence

Lister : GET /presence/all

Mettre à jour : PUT /presence/update avec { "id": ..., "present": true/false }

Adaptez votre front aux URL exactes ci-dessus pour éviter les 404/405 et les messages « Required parameter … is not present ».

Scénarios d’utilisation

Créer un formateur et un participant.

Créer une session (dates + intitulé).

Créer un module rattaché à la session + au formateur.

Créer une séance rattachée au module.

Gérer les présences sur les séances.

Créer un paiement pour un participant et une session, puis ajouter des tranches.

Astuces & Dépannage

404/405 lors de la création : souvent dû à une URL de création spécifique (voir « Cas particuliers »).

Paramètre manquant : certains endpoints attendent des query params (ex. Paiement).

Contrainte FK (clé étrangère) : ne pas saisir d’ID à la main ; utilisez des sélecteurs liés aux listes /all.

Dates : envoyez YYYY-MM-DD.

Node/Vite : utilisez Node 18+. Les erreurs Unsupported engine → mettez à jour Node.

Roadmap (suggestions)

Authentification & rôles complets (Spring Security + JWT).

Tableau de bord enrichi (stats, graphiques).

Invoices/exports PDF pour paiements.

Recherche/filtrage avancés côté API.

Tests d’intégration (Spring Boot Test) et CI.
