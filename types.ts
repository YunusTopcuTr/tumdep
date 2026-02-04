
export enum VoteStatus {
  CERTAIN = 'CERTAIN',
  UNDECIDED = 'UNDECIDED',
  RISKY = 'RISKY',
  NEGATIVE = 'NEGATIVE'
}

export enum UserRole {
  ADMIN = 'ADMIN',           // Tam sistem yönetimi
  STRATEGY = 'STRATEGY',     // Üst düzey raporlama ve AI analizi
  MANAGER = 'MANAGER',      // Saha operasyonları ve veri girişi
  AUDITOR = 'AUDITOR'        // Sadece görüntüleme ve denetim
}

export enum AuthScopeType {
  GLOBAL = 'GLOBAL',         // Tüm Türkiye / Genel Merkez erişimi
  REGION = 'REGION',         // Bölge bazlı kısıtlama
  CHAMBER = 'CHAMBER'        // Tekil Oda bazlı kısıtlama
}

export interface Region {
  id: string;
  name: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  scopeType: AuthScopeType;
  scopeId?: string; // Region ID veya Chamber ID
  isActive: boolean;
}

export interface ElectionPeriod {
  id: string;
  year: number;
  label: string;
  isActive: boolean;
  totalDelegates: number;
}

export interface Chamber {
  id: string;
  name: string;
  city: string;
  regionId?: string; // Bölge ilişkisi
  totalMembers: number;
  totalDelegates: number;
  votedDelegatesCount?: number;
}

export interface Faction {
  id: string;
  name: string;
  description: string;
  color: string;
  isMainCompetitor?: boolean;
}

export interface ElectionResult {
  id: string;
  periodId: string;
  year: number;
  chamberId: string;
  factionId: string;
  votes: number;
}

export interface Delegate {
  id: string;
  name: string;
  chamberId: string;
  status: VoteStatus;
  lastContactDate: string;
  assignedManager: string;
  notes: string;
  riskScore: number;
  previousGroup?: string;
  currentGroup: string; // Faction ID
  tendency: string; // Mevcut eğilim (Örn: "TÜMDEP Yakın", "Kararsız - Rakibe Kayabilir")
  electionYear: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  details: string;
}

export interface AIAnalysisResult {
  executiveSummary: string;
  prediction: string;
  riskSummary: string[];
  strategicSuggestions: string[];
  estimatedVotes2028: number;
  weightedTotalVotes: number;
  microGrowthTargets: { chamber: string; potentialGain: number; reason: string }[];
  scenarios: { name: string; predictedVotes: number; description: string }[];
  algorithmAuditLog: string;
  factionTransitionAnalysis: string;
}
