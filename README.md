# TrocTroc

Plateforme de petites annonces entre particuliers, pour l'achat, la vente et l'échange d'articles en local (rayon de 50 km).

## Conception

Cahier des charges, user stories, wireframes, MCD/MLD et dictionnaire des données : [docs/conception/troctroc-cahier-des-charges.md](docs/conception/troctroc-cahier-des-charges.md).

## Stack

- React — frontend
- Node.js / Express — backend
- PostgreSQL / Sequelize — base de données
- JWT — authentification
- Docker

## Structure du projet

```text
apo-dwwm-troctroc/
├── frontend/          # Application React
├── backend/           # API Express (en cours de mise en place)
└── docs/conception/   # Cahier des charges, user stories, wireframes, MCD/MLD
```

## Prérequis

- Node.js (>= 18)
- npm
- PostgreSQL

## Installation

```bash
git clone git@github.com:narimenOUHIDA/Troc-Troc.git
cd apo-dwwm-troctroc
npm install
```

Le projet est un monorepo npm workspaces (`frontend`, `backend`).

## Lancer le projet

Frontend (React) :

```bash
npm run dev --workspace=frontend
```

Backend (Express) : à venir, le serveur n'est pas encore initialisé.

## Équipe

Projet réalisé dans le cadre de la formation DWWM (O'clock).
