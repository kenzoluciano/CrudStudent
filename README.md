# CrudStudent — API REST (Express + TypeScript + PostgreSQL)

## Installation

```bash
npm install
```

## Configuration

1. Copie `.env.example` en `.env` :
   ```bash
   copy .env.example .env
   ```
2. Modifie `.env` avec tes vraies infos PostgreSQL (mot de passe, etc.)

## Créer la base et la table

```bash
psql -U postgres
CREATE DATABASE crudstudent;
\q
psql -U postgres -d crudstudent -f schema.sql
```

## Lancer le serveur en développement

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`.

## Endpoints disponibles

| Action                        | Méthode | URL              | Code succès |
|--------------------------------|---------|------------------|-------------|
| Lister tous les étudiants      | GET     | /etudiants       | 200         |
| Lire un étudiant précis        | GET     | /etudiants/:id   | 200         |
| Créer un étudiant              | POST    | /etudiants       | 201         |
| Modifier complètement          | PUT     | /etudiants/:id   | 200         |
| Modifier partiellement         | PATCH   | /etudiants/:id   | 200         |
| Supprimer un étudiant          | DELETE  | /etudiants/:id   | 204         |

## Exemple de body pour POST / PUT

```json
{
  "nom": "Rakoto",
  "prenom": "Jean",
  "email": "jean.rakoto@mail.com",
  "date_naissance": "2000-01-15"
}
```
