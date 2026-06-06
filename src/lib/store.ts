import {
  Admin,
  Agent,
  ClientAccount,
  AuditLog,
  AppSettings,
  CurrentUser,
} from './types'

// ===================== KEYS =====================
const KEYS = {
  admins: '@mynita_admins',
  agents: '@mynita_agents',
  comptes: '@mynita_comptes',
  audit: '@mynita_audit',
  settings: '@mynita_settings',
  currentUser: '@mynita_currentUser',
}

// ===================== HELPERS =====================
function get<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function set<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

function genId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
}

// ===================== SEED DATA =====================
const seedAdmins: (Admin & { password: string })[] = [
  {
    id: 'adm1',
    nom: 'IBRAHIM',
    prenom: 'Moussa',
    email: 'superadmin@mynita.ne',
    password: 'Admin@2024',
    role: 'super_admin',
    statut: 'actif',
    dateCreation: '2024-01-15T08:00:00.000Z',
    derniereConnexion: '2025-05-24T14:30:00.000Z',
    avatar: null,
  },
  {
    id: 'adm2',
    nom: 'ALPHA',
    prenom: 'Fatima',
    email: 'admin@mynita.ne',
    password: 'Admin@2024',
    role: 'admin',
    statut: 'actif',
    dateCreation: '2024-03-10T09:00:00.000Z',
    derniereConnexion: '2025-05-23T11:00:00.000Z',
    avatar: null,
  },
]

export const seedAgents: Agent[] = [
  {
    id: 'agt1',
    nom: 'SOULEY',
    prenom: 'Ibrahim',
    email: 'ibrahim.souley@mynita.ne',
    telephone: '+227 90 12 34 56',
    zone: 'Niamey',
    ville: 'Niamey',
    statut: 'actif',
    dateRecrutement: '2024-02-01T00:00:00.000Z',
    identifiantApp: 'AGT-NIA-001',
    passwordApp: 'Nita@Agent01',
    nbComptesCreesTotal: 45,
    nbComptesActifsTotal: 38,
    limiteComptesJour: 10,
    createdBy: 'adm1',
  },
  {
    id: 'agt2',
    nom: 'AMADOU',
    prenom: 'Balkissa',
    email: 'balkissa.amadou@mynita.ne',
    telephone: '+227 91 23 45 67',
    zone: 'Zinder',
    ville: 'Zinder',
    statut: 'actif',
    dateRecrutement: '2024-03-15T00:00:00.000Z',
    identifiantApp: 'AGT-ZIN-002',
    passwordApp: 'Nita@Agent02',
    nbComptesCreesTotal: 32,
    nbComptesActifsTotal: 28,
    limiteComptesJour: 10,
    createdBy: 'adm1',
  },
  {
    id: 'agt3',
    nom: 'MAHAMANE',
    prenom: 'Abdou',
    email: 'abdou.mahamane@mynita.ne',
    telephone: '+227 92 34 56 78',
    zone: 'Maradi',
    ville: 'Maradi',
    statut: 'actif',
    dateRecrutement: '2024-04-20T00:00:00.000Z',
    identifiantApp: 'AGT-MAR-003',
    passwordApp: 'Nita@Agent03',
    nbComptesCreesTotal: 28,
    nbComptesActifsTotal: 22,
    limiteComptesJour: 10,
    createdBy: 'adm2',
  },
  {
    id: 'agt4',
    nom: 'ISSOUFOU',
    prenom: 'Mariama',
    email: 'mariama.issoufou@mynita.ne',
    telephone: '+227 93 45 67 89',
    zone: 'Agadez',
    ville: 'Agadez',
    statut: 'suspendu',
    dateRecrutement: '2024-05-10T00:00:00.000Z',
    identifiantApp: 'AGT-AGZ-004',
    passwordApp: 'Nita@Agent04',
    nbComptesCreesTotal: 15,
    nbComptesActifsTotal: 10,
    limiteComptesJour: 10,
    createdBy: 'adm1',
  },
  {
    id: 'agt5',
    nom: 'OUMAROU',
    prenom: 'Hassane',
    email: 'hassane.oumarou@mynita.ne',
    telephone: '+227 94 56 78 90',
    zone: 'Tahoua',
    ville: 'Tahoua',
    statut: 'en_attente',
    dateRecrutement: '2025-05-01T00:00:00.000Z',
    identifiantApp: 'AGT-TAH-005',
    passwordApp: 'Nita@Agent05',
    nbComptesCreesTotal: 0,
    nbComptesActifsTotal: 0,
    limiteComptesJour: 10,
    createdBy: 'adm2',
  },
]

export const seedComptes: ClientAccount[] = [
  {
    id: 'cpt1',
    nomComplet: 'Adamou GARBA',
    dateNaissance: '1990-05-12',
    lieuNaissance: 'Niamey',
    telephone: '+227 96 11 22 33',
    email: 'adamou.garba@gmail.com',
    residence: 'Quartier Plateau, Niamey',
    typeCompte: 'normale',
    statut: 'actif',
    dateCreation: '2024-06-15T10:00:00.000Z',
    agentId: 'agt1',
    carteRecto: null,
    carteVerso: null,
    motifDesactivation: null,
    dateDesactivation: null,
    professionnel: null,
  },
  {
    id: 'cpt2',
    nomComplet: 'Aissatou MAIGA',
    dateNaissance: '1985-11-03',
    lieuNaissance: 'Zinder',
    telephone: '+227 97 22 33 44',
    email: null,
    residence: 'Quartier Birni, Zinder',
    typeCompte: 'pro',
    statut: 'actif',
    dateCreation: '2024-07-20T09:00:00.000Z',
    agentId: 'agt2',
    carteRecto: null,
    carteVerso: null,
    motifDesactivation: null,
    dateDesactivation: null,
    professionnel: {
      fonction: 'Commercante',
      employeur: 'Entreprise MAIGA & Fils',
      zone: 'Grand Marche Zinder',
      dateExpiration: '2026-07-20',
    },
  },
  {
    id: 'cpt3',
    nomComplet: 'Moussa ABDOU',
    dateNaissance: '1992-08-25',
    lieuNaissance: 'Maradi',
    telephone: '+227 96 33 44 55',
    email: 'moussa.abdou@yahoo.fr',
    residence: 'Quartier Dan Goulbi, Maradi',
    typeCompte: 'normale',
    statut: 'actif',
    dateCreation: '2024-08-10T14:00:00.000Z',
    agentId: 'agt3',
    carteRecto: null,
    carteVerso: null,
    motifDesactivation: null,
    dateDesactivation: null,
    professionnel: null,
  },
  {
    id: 'cpt4',
    nomComplet: 'Salamatou ISSA',
    dateNaissance: '1988-01-17',
    lieuNaissance: 'Niamey',
    telephone: '+227 90 44 55 66',
    email: null,
    residence: 'Quartier Gamkale, Niamey',
    typeCompte: 'normale',
    statut: 'actif',
    dateCreation: '2024-09-05T11:00:00.000Z',
    agentId: 'agt1',
    carteRecto: null,
    carteVerso: null,
    motifDesactivation: null,
    dateDesactivation: null,
    professionnel: null,
  },
  {
    id: 'cpt5',
    nomComplet: 'Harouna DJIBO',
    dateNaissance: '1995-03-30',
    lieuNaissance: 'Agadez',
    telephone: '+227 93 55 66 77',
    email: 'harouna.djibo@gmail.com',
    residence: 'Quartier Sabon Gari, Agadez',
    typeCompte: 'pro',
    statut: 'actif',
    dateCreation: '2024-09-20T08:00:00.000Z',
    agentId: 'agt4',
    carteRecto: null,
    carteVerso: null,
    motifDesactivation: null,
    dateDesactivation: null,
    professionnel: {
      fonction: 'Transporteur',
      employeur: 'Transport Sahel Express',
      zone: 'Gare routiere Agadez',
      dateExpiration: '2026-09-20',
    },
  },
  {
    id: 'cpt6',
    nomComplet: 'Zeinabou HAMIDOU',
    dateNaissance: '1993-07-14',
    lieuNaissance: 'Tahoua',
    telephone: '+227 94 66 77 88',
    email: null,
    residence: 'Quartier Toudou, Tahoua',
    typeCompte: 'normale',
    statut: 'actif',
    dateCreation: '2024-10-12T15:00:00.000Z',
    agentId: 'agt2',
    carteRecto: null,
    carteVerso: null,
    motifDesactivation: null,
    dateDesactivation: null,
    professionnel: null,
  },
  {
    id: 'cpt7',
    nomComplet: 'Boubacar SEYDOU',
    dateNaissance: '1987-12-08',
    lieuNaissance: 'Niamey',
    telephone: '+227 96 77 88 99',
    email: 'boubacar.seydou@hotmail.com',
    residence: 'Quartier Koira Kano, Niamey',
    typeCompte: 'normale',
    statut: 'en_attente',
    dateCreation: '2025-05-10T09:00:00.000Z',
    agentId: 'agt1',
    carteRecto: null,
    carteVerso: null,
    motifDesactivation: null,
    dateDesactivation: null,
    professionnel: null,
  },
  {
    id: 'cpt8',
    nomComplet: 'Rahina MOUNKAILA',
    dateNaissance: '1991-04-22',
    lieuNaissance: 'Dosso',
    telephone: '+227 97 88 99 00',
    email: null,
    residence: 'Quartier Dosso Ville',
    typeCompte: 'pro',
    statut: 'en_attente',
    dateCreation: '2025-05-15T10:00:00.000Z',
    agentId: 'agt3',
    carteRecto: null,
    carteVerso: null,
    motifDesactivation: null,
    dateDesactivation: null,
    professionnel: {
      fonction: 'Restauratrice',
      employeur: 'Restaurant Chez Rahina',
      zone: 'Marche Central Dosso',
      dateExpiration: '2027-05-15',
    },
  },
  {
    id: 'cpt9',
    nomComplet: 'Abdoulaye SANI',
    dateNaissance: '1989-09-05',
    lieuNaissance: 'Zinder',
    telephone: '+227 91 99 00 11',
    email: 'abdoulaye.sani@gmail.com',
    residence: 'Quartier Kara-Kara, Zinder',
    typeCompte: 'normale',
    statut: 'en_attente',
    dateCreation: '2025-05-18T14:00:00.000Z',
    agentId: 'agt2',
    carteRecto: null,
    carteVerso: null,
    motifDesactivation: null,
    dateDesactivation: null,
    professionnel: null,
  },
  {
    id: 'cpt10',
    nomComplet: 'Fati OUSMANE',
    dateNaissance: '1994-02-28',
    lieuNaissance: 'Maradi',
    telephone: '+227 92 00 11 22',
    email: null,
    residence: 'Quartier Maradaoua, Maradi',
    typeCompte: 'normale',
    statut: 'en_attente',
    dateCreation: '2025-05-20T16:00:00.000Z',
    agentId: 'agt3',
    carteRecto: null,
    carteVerso: null,
    motifDesactivation: null,
    dateDesactivation: null,
    professionnel: null,
  },
  {
    id: 'cpt11',
    nomComplet: 'Idi MAHAMADOU',
    dateNaissance: '1986-06-19',
    lieuNaissance: 'Niamey',
    telephone: '+227 90 11 22 33',
    email: null,
    residence: 'Quartier Lazaret, Niamey',
    typeCompte: 'normale',
    statut: 'en_attente',
    dateCreation: '2025-05-22T08:00:00.000Z',
    agentId: 'agt1',
    carteRecto: null,
    carteVerso: null,
    motifDesactivation: null,
    dateDesactivation: null,
    professionnel: null,
  },
  {
    id: 'cpt12',
    nomComplet: 'Hawa SOUMANA',
    dateNaissance: '1996-10-11',
    lieuNaissance: 'Niamey',
    telephone: '+227 96 22 33 44',
    email: 'hawa.soumana@gmail.com',
    residence: 'Quartier Wadata, Niamey',
    typeCompte: 'normale',
    statut: 'desactive',
    dateCreation: '2024-04-10T09:00:00.000Z',
    agentId: 'agt1',
    carteRecto: null,
    carteVerso: null,
    motifDesactivation: 'Fraude suspectee',
    dateDesactivation: '2025-01-15T10:00:00.000Z',
    professionnel: null,
  },
  {
    id: 'cpt13',
    nomComplet: 'Yacouba TAHIROU',
    dateNaissance: '1983-08-07',
    lieuNaissance: 'Maradi',
    telephone: '+227 92 33 44 55',
    email: null,
    residence: 'Quartier Ali Dan Sofo, Maradi',
    typeCompte: 'pro',
    statut: 'desactive',
    dateCreation: '2024-05-22T11:00:00.000Z',
    agentId: 'agt3',
    carteRecto: null,
    carteVerso: null,
    motifDesactivation: 'Documents expires',
    dateDesactivation: '2025-02-10T14:00:00.000Z',
    professionnel: {
      fonction: 'Grossiste',
      employeur: 'Ets Yacouba Commerce',
      zone: 'Zone Industrielle Maradi',
      dateExpiration: '2025-01-01',
    },
  },
  {
    id: 'cpt14',
    nomComplet: 'Amina GARBA',
    dateNaissance: '1997-12-25',
    lieuNaissance: 'Zinder',
    telephone: '+227 91 44 55 66',
    email: null,
    residence: 'Quartier Garin Malam, Zinder',
    typeCompte: 'normale',
    statut: 'desactive',
    dateCreation: '2024-06-30T13:00:00.000Z',
    agentId: 'agt2',
    carteRecto: null,
    carteVerso: null,
    motifDesactivation: 'Demande du client',
    dateDesactivation: '2025-03-20T09:00:00.000Z',
    professionnel: null,
  },
  {
    id: 'cpt15',
    nomComplet: 'Oumarou SIDIBE',
    dateNaissance: '1990-04-03',
    lieuNaissance: 'Agadez',
    telephone: '+227 93 55 66 77',
    email: 'oumarou.sidibe@yahoo.fr',
    residence: 'Quartier Nassarawa, Agadez',
    typeCompte: 'normale',
    statut: 'desactive',
    dateCreation: '2024-07-15T10:00:00.000Z',
    agentId: 'agt4',
    carteRecto: null,
    carteVerso: null,
    motifDesactivation: 'Inactivite prolongee',
    dateDesactivation: '2025-04-01T08:00:00.000Z',
    professionnel: null,
  },
]

const seedAudit: AuditLog[] = [
  {
    id: 'log1',
    adminId: 'adm1',
    adminNom: 'Moussa IBRAHIM',
    action: 'Création agent',
    cible: 'Agent Ibrahim SOULEY',
    detail: 'Nouvel agent créé pour la zone de Niamey',
    ip: '192.168.1.10',
    date: '2024-02-01T08:30:00.000Z',
  },
  {
    id: 'log2',
    adminId: 'adm1',
    adminNom: 'Moussa IBRAHIM',
    action: 'Création agent',
    cible: 'Agent Balkissa AMADOU',
    detail: 'Nouvel agent créé pour la zone de Zinder',
    ip: '192.168.1.10',
    date: '2024-03-15T09:15:00.000Z',
  },
  {
    id: 'log3',
    adminId: 'adm2',
    adminNom: 'Fatima ALPHA',
    action: 'Activation compte',
    cible: 'Compte Adamou GARBA',
    detail: 'Compte client activé après vérification documents',
    ip: '192.168.1.12',
    date: '2024-06-16T10:00:00.000Z',
  },
  {
    id: 'log4',
    adminId: 'adm1',
    adminNom: 'Moussa IBRAHIM',
    action: 'Suspension agent',
    cible: 'Agent Mariama ISSOUFOU',
    detail: 'Agent suspendu pour non-conformité des procédures',
    ip: '192.168.1.10',
    date: '2025-01-10T11:00:00.000Z',
  },
  {
    id: 'log5',
    adminId: 'adm2',
    adminNom: 'Fatima ALPHA',
    action: 'Désactivation compte',
    cible: 'Compte Hawa SOUMANA',
    detail: 'Compte désactivé - Fraude suspectée',
    ip: '192.168.1.12',
    date: '2025-01-15T10:30:00.000Z',
  },
  {
    id: 'log6',
    adminId: 'adm1',
    adminNom: 'Moussa IBRAHIM',
    action: 'Modification paramètres',
    cible: 'Paramètres plateforme',
    detail: 'Mise à jour de la limite de comptes par jour (8 → 10)',
    ip: '192.168.1.10',
    date: '2025-02-05T14:00:00.000Z',
  },
  {
    id: 'log7',
    adminId: 'adm2',
    adminNom: 'Fatima ALPHA',
    action: 'Désactivation compte',
    cible: 'Compte Yacouba TAHIROU',
    detail: 'Compte désactivé - Documents expirés',
    ip: '192.168.1.12',
    date: '2025-02-10T14:30:00.000Z',
  },
  {
    id: 'log8',
    adminId: 'adm1',
    adminNom: 'Moussa IBRAHIM',
    action: 'Création admin',
    cible: 'Admin Fatima ALPHA',
    detail: 'Nouvel administrateur créé avec rôle admin',
    ip: '192.168.1.10',
    date: '2024-03-10T09:00:00.000Z',
  },
  {
    id: 'log9',
    adminId: 'adm2',
    adminNom: 'Fatima ALPHA',
    action: 'Activation compte',
    cible: 'Compte Aissatou MAIGA',
    detail: 'Compte pro activé après vérification',
    ip: '192.168.1.12',
    date: '2024-07-21T09:30:00.000Z',
  },
  {
    id: 'log10',
    adminId: 'adm1',
    adminNom: 'Moussa IBRAHIM',
    action: 'Connexion',
    cible: 'Système',
    detail: 'Connexion réussie au backoffice',
    ip: '192.168.1.10',
    date: '2025-05-24T14:30:00.000Z',
  },
]

const seedSettings: AppSettings = {
  nomPlateforme: 'myNITA Backoffice',
  motifsRefus: [
    'Documents illisibles',
    'Informations incohérentes',
    'Pièce d\'identité expirée',
    'Photo non conforme',
    'Adresse non vérifiable',
  ],
  motifsDesactivation: [
    'Fraude suspectée',
    'Documents expirés',
    'Demande du client',
    'Inactivité prolongée',
    'Non-conformité réglementaire',
  ],
  limiteComptesJourDefaut: 10,
  delaiAlertAttente: 48,
  seuilAlertRefus: 20,
}

// ===================== INIT / SEED =====================
export function initStore(): void {
  if (typeof window === 'undefined') return
  if (!localStorage.getItem(KEYS.admins)) {
    set(KEYS.admins, seedAdmins)
  }
  if (!localStorage.getItem(KEYS.agents)) {
    set(KEYS.agents, seedAgents)
  }
  if (!localStorage.getItem(KEYS.comptes)) {
    set(KEYS.comptes, seedComptes)
  }
  if (!localStorage.getItem(KEYS.audit)) {
    set(KEYS.audit, seedAudit)
  }
  if (!localStorage.getItem(KEYS.settings)) {
    set(KEYS.settings, seedSettings)
  }
}

// ===================== AUTH =====================
export function login(email: string, password: string): CurrentUser | null {
  initStore()
  const admins = get<(Admin & { password: string })[]>(KEYS.admins) || []
  const found = admins.find(a => a.email === email && a.password === password)
  if (!found) return null
  const user: CurrentUser = { ...found }
  // Update derniere connexion
  const updated = admins.map(a =>
    a.id === found.id ? { ...a, derniereConnexion: new Date().toISOString() } : a
  )
  set(KEYS.admins, updated)
  set(KEYS.currentUser, user)
  return user
}

export function logout(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEYS.currentUser)
}

export function getCurrentUser(): CurrentUser | null {
  return get<CurrentUser>(KEYS.currentUser)
}

// ===================== ADMINS =====================
export function getAdmins(): Admin[] {
  initStore()
  const admins = get<(Admin & { password: string })[]>(KEYS.admins) || []
  return admins.map(({ password: _p, ...rest }) => rest)
}

export function createAdmin(data: Omit<Admin, 'id' | 'dateCreation' | 'derniereConnexion'> & { password: string }): Admin {
  const admins = get<(Admin & { password: string })[]>(KEYS.admins) || []
  const newAdmin = {
    ...data,
    id: genId(),
    dateCreation: new Date().toISOString(),
    derniereConnexion: null,
  }
  admins.push(newAdmin)
  set(KEYS.admins, admins)
  const { password: _p, ...rest } = newAdmin
  return rest
}

export function updateAdmin(id: string, patch: Partial<Admin>): Admin {
  const admins = get<(Admin & { password: string })[]>(KEYS.admins) || []
  const idx = admins.findIndex(a => a.id === id)
  if (idx === -1) throw new Error('Admin not found')
  admins[idx] = { ...admins[idx], ...patch }
  set(KEYS.admins, admins)
  const { password: _p, ...rest } = admins[idx]
  return rest
}

export function deleteAdmin(id: string): void {
  const admins = get<(Admin & { password: string })[]>(KEYS.admins) || []
  set(KEYS.admins, admins.filter(a => a.id !== id))
}

// ===================== AGENTS =====================
export function getAgents(): Agent[] {
  initStore()
  return get<Agent[]>(KEYS.agents) || []
}

export function getAgent(id: string): Agent | null {
  const agents = getAgents()
  return agents.find(a => a.id === id) || null
}

export function createAgent(data: Omit<Agent, 'id' | 'dateRecrutement' | 'nbComptesCreesTotal' | 'nbComptesActifsTotal'>): Agent {
  const agents = get<Agent[]>(KEYS.agents) || []
  const newAgent: Agent = {
    ...data,
    id: genId(),
    dateRecrutement: new Date().toISOString(),
    nbComptesCreesTotal: 0,
    nbComptesActifsTotal: 0,
  }
  agents.push(newAgent)
  set(KEYS.agents, agents)
  return newAgent
}

export function updateAgent(id: string, patch: Partial<Agent>): Agent {
  const agents = get<Agent[]>(KEYS.agents) || []
  const idx = agents.findIndex(a => a.id === id)
  if (idx === -1) throw new Error('Agent not found')
  agents[idx] = { ...agents[idx], ...patch }
  set(KEYS.agents, agents)
  return agents[idx]
}

export function deleteAgent(id: string): void {
  const agents = get<Agent[]>(KEYS.agents) || []
  set(KEYS.agents, agents.filter(a => a.id !== id))
}

// ===================== COMPTES =====================
export function getComptes(): ClientAccount[] {
  initStore()
  return get<ClientAccount[]>(KEYS.comptes) || []
}

export function getCompte(id: string): ClientAccount | null {
  const comptes = getComptes()
  return comptes.find(c => c.id === id) || null
}

export function updateCompte(id: string, patch: Partial<ClientAccount>): ClientAccount {
  const comptes = get<ClientAccount[]>(KEYS.comptes) || []
  const idx = comptes.findIndex(c => c.id === id)
  if (idx === -1) throw new Error('Compte not found')
  comptes[idx] = { ...comptes[idx], ...patch }
  set(KEYS.comptes, comptes)
  return comptes[idx]
}

export function deleteCompte(id: string): void {
  const comptes = get<ClientAccount[]>(KEYS.comptes) || []
  set(KEYS.comptes, comptes.filter(c => c.id !== id))
}

export function getComptesByAgent(agentId: string): ClientAccount[] {
  const comptes = getComptes()
  return comptes.filter(c => c.agentId === agentId)
}

// ===================== STATS =====================
export function getStats() {
  const comptes = getComptes()
  const agents = getAgents()
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const totalComptes = comptes.length
  const enAttente = comptes.filter(c => c.statut === 'en_attente').length
  const actifs = comptes.filter(c => c.statut === 'actif').length
  const desactives = comptes.filter(c => c.statut === 'desactive').length
  const totalAgents = agents.length
  const agentsActifs = agents.filter(a => a.statut === 'actif').length
  const agentsSuspendus = agents.filter(a => a.statut === 'suspendu').length
  const comptesCeMois = comptes.filter(c => new Date(c.dateCreation) >= startOfMonth).length
  const tauxActivation = totalComptes > 0 ? Math.round((actifs / totalComptes) * 100) : 0

  return {
    totalComptes,
    enAttente,
    actifs,
    desactives,
    totalAgents,
    agentsActifs,
    agentsSuspendus,
    comptesCeMois,
    tauxActivation,
  }
}

// ===================== AUDIT =====================
export function getAuditLogs(): AuditLog[] {
  initStore()
  return get<AuditLog[]>(KEYS.audit) || []
}

export function addAuditLog(data: Omit<AuditLog, 'id' | 'date'>): void {
  const logs = get<AuditLog[]>(KEYS.audit) || []
  const newLog: AuditLog = {
    ...data,
    id: genId(),
    date: new Date().toISOString(),
  }
  logs.unshift(newLog)
  set(KEYS.audit, logs)
}

// ===================== SETTINGS =====================
export function getSettings(): AppSettings {
  initStore()
  return get<AppSettings>(KEYS.settings) || seedSettings
}

export function updateSettings(patch: Partial<AppSettings>): AppSettings {
  const settings = getSettings()
  const updated = { ...settings, ...patch }
  set(KEYS.settings, updated)
  return updated
}
