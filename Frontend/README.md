# SGF Frontend v5.1

Vue 3 + Vite admin that matches your Spring endpoints.

## Requirements
- Node 18 or 20

## Run
```
npm install
npm run dev
```

## Build & deploy to Spring
```
npm run build
cp -r dist/* ../<spring-project>/src/main/resources/static/
```

## Config
Create `.env` and set:
```
VITE_API_BASE=http://localhost:8080
```

Key endpoints this UI calls:
- POST `/module/add/{sessionId}` with body `{ nom, duree, formateur: { id } }`
- POST `/seance/add/{moduleId}`
- POST `/tranche/add/{paiementId}`
- POST `/paiement/add?participantId=..&sessionId=..&montant=..`
- Sessions uses `intitule` as the "Nom" field.
- Présences update via `PUT /presence/update` with `{ id, present }`.
