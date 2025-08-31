export const entities = {
  formateurs: {
    title: 'Formateurs',
    titleSingular: 'Formateur',
    basePath: '/formateur',
    idKey: 'id',
    columns: ['nom', 'prenom', 'tel', 'email', 'disponibilite', 'remarques', 'specialite', 'coutParH'],
    fields: [
      { name: 'nom', type: 'string', label: 'Nom' },
      { name: 'prenom', type: 'string', label: 'Prénom' },
      { name: 'tel', type: 'string', label: 'Téléphone' },
      { name: 'email', type: 'string', label: 'Email' },
      { name: 'disponibilite', type: 'date', label: 'Disponibilité' },
      { name: 'remarques', type: 'string', label: 'Remarques' },
      { name: 'specialite', type: 'string', label: 'Spécialité' },
      { name: 'coutParH', type: 'number', label: 'Coût/heure' },
    ]
  },

  participants: {
    title: 'Participants',
    titleSingular: 'Participant',
    basePath: '/participant',
    idKey: 'id',
    columns: ['nom', 'prenom', 'tel', 'email', 'disponibilite', 'remarques', 'attestation', 'etat', 'nbrHeuresPresence'],
    fields: [
      { name: 'nom', type: 'string', label: 'Nom' },
      { name: 'prenom', type: 'string', label: 'Prénom' },
      { name: 'tel', type: 'string', label: 'Téléphone' },
      { name: 'email', type: 'string', label: 'Email' },
      { name: 'disponibilite', type: 'date', label: 'Disponibilité' },
      { name: 'remarques', type: 'string', label: 'Remarques' },
      { name: 'attestation', type: 'boolean', label: 'Attestation' },
      { name: 'etat', type: 'boolean', label: 'État' },
      { name: 'nbrHeuresPresence', type: 'number', label: 'Heures de présence' },
    ]
  },

  sessions: {
    title: 'Sessions',
    titleSingular: 'Session',
    basePath: '/session',
    idKey: 'id',
    columns: ['dateDebut', 'dateFin', { name: 'intitule', label: 'Nom' }],
    fields: [
      { name: 'intitule', type: 'string', label: 'Nom' },
      { name: 'dateDebut', type: 'date', label: 'Date début' },
      { name: 'dateFin', type: 'date', label: 'Date fin' },
    ]
  },

modules: {
  title: 'Modules',
  titleSingular: 'Module',
  basePath: '/module',
  idKey: 'id',
 columns: ['nom', 'duree', 'sessionId', 'formateur'],
columns: ['nom', 'duree', { name: 'session', label: 'Session' }, { name: 'formateur', label: 'Formateur' }],
  fields: [
    { name: 'nom', type: 'string', label: 'Nom' },
    { name: 'duree', type: 'number', label: 'Durée (h)' },

    { name: 'sessionId', type: 'number', label: 'Session (ID)' },
    { name: 'formateurId', type: 'number', label: 'Formateur (ID)' },
  ]
},



  seances: {
    title: 'Séances',
    titleSingular: 'Séance',
    basePath: '/seance',
    idKey: 'id',
    columns: ['date', 'heureDebut', 'heureFin', 'moduleId'],
    fields: [
      { name: 'date', type: 'date', label: 'Date' },
      { name: 'heureDebut', type: 'time', label: 'Heure début' },
      { name: 'heureFin', type: 'time', label: 'Heure fin' },
      { name: 'moduleId', type: 'number', label: 'Module (ID)' },
    ]
  },

  paiements: {
    title: 'Paiements',
    titleSingular: 'Paiement',
    basePath: '/paiement',
    idKey: 'id',
    columns: ['date', 'montant', 'participantId', 'sessionId'],
    fields: [
      { name: 'date', type: 'date', label: 'Date' },
      { name: 'montant', type: 'number', label: 'Montant' },
      { name: 'participantId', type: 'number', label: 'Participant (ID)' },
      { name: 'sessionId', type: 'number', label: 'Session (ID)' },
    ]
  },

  tranches: {
    title: 'Tranches',
    titleSingular: 'Tranche',
    basePath: '/tranche',
    idKey: 'id',
    columns: ['date', 'montant', 'paiementId'],
    fields: [
      { name: 'date', type: 'date', label: 'Date' },
      { name: 'montant', type: 'number', label: 'Montant' },
      { name: 'paiementId', type: 'number', label: 'Paiement (ID)' },
    ]
  },

  presences: {
    title: 'Présences',
    titleSingular: 'Présence',
    basePath: '/presence',
    idKey: 'id',
    columns: ['participant', 'seance', 'present'],
    fields: [
      { name: 'present', type: 'boolean', label: 'Présent' },
    ],
    create: null,
    delete: false
  }
}
