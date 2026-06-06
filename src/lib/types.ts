export type AdminRole = 'super_admin' | 'admin' | 'superviseur' | 'support'
export type AdminStatus = 'actif' | 'suspendu'
export type AgentStatus = 'actif' | 'suspendu' | 'en_attente'
export type AccountStatus = 'en_attente' | 'actif' | 'desactive'
export type AccountType = 'normale' | 'pro'

export interface Admin {
  id: string
  nom: string
  prenom: string
  email: string
  role: AdminRole
  statut: AdminStatus
  dateCreation: string
  derniereConnexion: string | null
  avatar: string | null
}

export interface Agent {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  zone: string
  ville: string
  statut: AgentStatus
  dateRecrutement: string
  identifiantApp: string
  passwordApp: string
  nbComptesCreesTotal: number
  nbComptesActifsTotal: number
  limiteComptesJour: number
  createdBy: string
}

export interface ClientAccount {
  id: string
  nomComplet: string
  dateNaissance: string
  lieuNaissance: string
  telephone: string
  email: string | null
  residence: string
  typeCompte: AccountType
  statut: AccountStatus
  dateCreation: string
  agentId: string
  carteRecto: string | null
  carteVerso: string | null
  motifDesactivation: string | null
  dateDesactivation: string | null
  professionnel: {
    fonction: string
    employeur: string
    zone: string
    dateExpiration: string
  } | null
}

export interface AuditLog {
  id: string
  adminId: string
  adminNom: string
  action: string
  cible: string
  detail: string
  ip: string
  date: string
}

export interface AppSettings {
  nomPlateforme: string
  motifsRefus: string[]
  motifsDesactivation: string[]
  limiteComptesJourDefaut: number
  delaiAlertAttente: number
  seuilAlertRefus: number
}

export interface CurrentUser extends Admin {
  password: string
}
