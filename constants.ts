
import { Delegate, VoteStatus, UserRole, AuthScopeType, User, Chamber, Faction, ElectionResult, ElectionPeriod, Region } from './types';

export const TARGET_VOTES = 450;

export const INITIAL_REGIONS: Region[] = [
  { id: 'reg-01', name: 'Marmara Bölgesi', description: 'İstanbul ve çevresi finansal merkez odağı' },
  { id: 'reg-02', name: 'İç Anadolu Bölgesi', description: 'Başkent ve çevresi idari koordinasyon' },
  { id: 'reg-03', name: 'Ege Bölgesi', description: 'Batı Anadolu ticaret ve sanayi ağı' },
  { id: 'reg-04', name: 'Akdeniz Bölgesi', description: 'Güney illeri turizm ve tarım ekonomisi' },
  { id: 'reg-05', name: 'Karadeniz Bölgesi', description: 'Kuzey illeri lojistik ve ticaret hattı' },
  { id: 'reg-06', name: 'Güneydoğu Anadolu', description: 'Gaziantep merkezli sanayi ve ticaret' },
  { id: 'reg-07', name: 'Doğu Anadolu', description: 'Doğu illeri koordinasyon merkezi' },
];

export const INITIAL_CHAMBERS: Chamber[] = [
  // Marmara
  { id: 'ch-s39', name: 'İSTANBUL SMMMO', city: 'İstanbul', regionId: 'reg-01', totalMembers: 52400, totalDelegates: 168, votedDelegatesCount: 0 },
  { id: 'ch-s19', name: 'BURSA SMMMO', city: 'Bursa', regionId: 'reg-01', totalMembers: 6450, totalDelegates: 52, votedDelegatesCount: 0 },
  { id: 'ch-s50', name: 'KOCAELİ SMMMO', city: 'Kocaeli', regionId: 'reg-01', totalMembers: 2200, totalDelegates: 18, votedDelegatesCount: 0 },
  { id: 'ch-s11', name: 'BALIKESİR SMMMO', city: 'Balıkesir', regionId: 'reg-01', totalMembers: 1450, totalDelegates: 12, votedDelegatesCount: 0 },
  { id: 'ch-s70', name: 'TEKİRDAĞ SMMMO', city: 'Tekirdağ', regionId: 'reg-01', totalMembers: 1200, totalDelegates: 10, votedDelegatesCount: 0 },
  { id: 'ch-s65', name: 'SAKARYA SMMMO', city: 'Sakarya', regionId: 'reg-01', totalMembers: 1350, totalDelegates: 11, votedDelegatesCount: 0 },
  { id: 'ch-s20', name: 'ÇANAKKALE SMMMO', city: 'Çanakkale', regionId: 'reg-01', totalMembers: 950, totalDelegates: 8, votedDelegatesCount: 0 },

  // İç Anadolu
  { id: 'ch-s7', name: 'ANKARA SMMMO', city: 'Ankara', regionId: 'reg-02', totalMembers: 17200, totalDelegates: 88, votedDelegatesCount: 0 },
  { id: 'ch-s51', name: 'KONYA SMMMO', city: 'Konya', regionId: 'reg-02', totalMembers: 3100, totalDelegates: 26, votedDelegatesCount: 0 },
  { id: 'ch-s31', name: 'ESKİŞEHİR SMMMO', city: 'Eskişehir', regionId: 'reg-02', totalMembers: 1250, totalDelegates: 10, votedDelegatesCount: 0 },
  { id: 'ch-s66', name: 'SAMSUN SMMMO', city: 'Samsun', regionId: 'reg-05', totalMembers: 1650, totalDelegates: 14, votedDelegatesCount: 0 },
  { id: 'ch-s46', name: 'KAYSERİ SMMMO', city: 'Kayseri', regionId: 'reg-02', totalMembers: 1950, totalDelegates: 16, votedDelegatesCount: 0 },
  { id: 'ch-s68', name: 'SİVAS SMMMO', city: 'Sivas', regionId: 'reg-02', totalMembers: 750, totalDelegates: 6, votedDelegatesCount: 0 },

  // Ege
  { id: 'ch-s40', name: 'İZMİR SMMMO', city: 'İzmir', regionId: 'reg-03', totalMembers: 11200, totalDelegates: 68, votedDelegatesCount: 0 },
  { id: 'ch-s24', name: 'DENİZLİ SMMMO', city: 'Denizli', regionId: 'reg-03', totalMembers: 1600, totalDelegates: 14, votedDelegatesCount: 0 },
  { id: 'ch-s10', name: 'AYDIN SMMMO', city: 'Aydın', regionId: 'reg-03', totalMembers: 1550, totalDelegates: 13, votedDelegatesCount: 0 },
  { id: 'ch-s55', name: 'MANİSA SMMMO', city: 'Manisa', regionId: 'reg-03', totalMembers: 1450, totalDelegates: 12, votedDelegatesCount: 0 },
  { id: 'ch-s58', name: 'MUĞLA SMMMO', city: 'Muğla', regionId: 'reg-03', totalMembers: 1300, totalDelegates: 11, votedDelegatesCount: 0 },

  // Akdeniz
  { id: 'ch-s8', name: 'ANTALYA SMMMO', city: 'Antalya', regionId: 'reg-04', totalMembers: 5200, totalDelegates: 42, votedDelegatesCount: 0 },
  { id: 'ch-s1', name: 'ADANA SMMMO', city: 'Adana', regionId: 'reg-04', totalMembers: 3950, totalDelegates: 32, votedDelegatesCount: 0 },
  { id: 'ch-s57', name: 'MERSİN SMMMO', city: 'Mersin', regionId: 'reg-04', totalMembers: 2150, totalDelegates: 18, votedDelegatesCount: 0 },
  { id: 'ch-s36', name: 'HATAY SMMMO', city: 'Hatay', regionId: 'reg-04', totalMembers: 1150, totalDelegates: 9, votedDelegatesCount: 0 },
  { id: 'ch-s41', name: 'KAHRAMANMARAŞ SMMMO', city: 'K.Maraş', regionId: 'reg-04', totalMembers: 980, totalDelegates: 8, votedDelegatesCount: 0 },

  // Güneydoğu
  { id: 'ch-s33', name: 'GAZİANTEP SMMMO', city: 'Gaziantep', regionId: 'reg-06', totalMembers: 2350, totalDelegates: 20, votedDelegatesCount: 0 },
  { id: 'ch-s25', name: 'DİYARBAKIR SMMMO', city: 'Diyarbakır', regionId: 'reg-06', totalMembers: 1200, totalDelegates: 10, votedDelegatesCount: 0 },
  { id: 'ch-s69', name: 'ŞANLIURFA SMMMO', city: 'Şanlıurfa', regionId: 'reg-06', totalMembers: 1050, totalDelegates: 9, votedDelegatesCount: 0 },

  // YMM ODALARI
  { id: 'ch-y7', name: 'İSTANBUL YMMO', city: 'İstanbul', regionId: 'reg-01', totalMembers: 2400, totalDelegates: 22, votedDelegatesCount: 0 },
  { id: 'ch-y2', name: 'ANKARA YMMO', city: 'Ankara', regionId: 'reg-02', totalMembers: 1200, totalDelegates: 10, votedDelegatesCount: 0 },
  { id: 'ch-y8', name: 'İZMİR YMMO', city: 'İzmir', regionId: 'reg-03', totalMembers: 850, totalDelegates: 7, votedDelegatesCount: 0 },
];

export const INITIAL_USERS: User[] = [
  { id: 'u-1', name: 'TÜMDEP Genel Merkez', email: 'admin@tumdep.org', role: UserRole.ADMIN, scopeType: AuthScopeType.GLOBAL, isActive: true },
  { id: 'u-2', name: 'Marmara Bölge Sorumlusu', email: 'marmara@tumdep.org', role: UserRole.STRATEGY, scopeType: AuthScopeType.REGION, scopeId: 'reg-01', isActive: true },
  { id: 'u-3', name: 'Ankara Saha Sorumlusu', email: 'ankara@tumdep.org', role: UserRole.MANAGER, scopeType: AuthScopeType.REGION, scopeId: 'reg-02', isActive: true },
];

export const INITIAL_ELECTION_PERIODS: ElectionPeriod[] = [
  { id: 'ep-20', year: 2020, label: '2020 Olağan Genel Kurul', isActive: false, totalDelegates: 420 },
  { id: 'ep-24', year: 2024, label: '2024 Olağan Genel Kurul', isActive: false, totalDelegates: 435 },
  { id: 'ep-28', year: 2028, label: '2028 Stratejik Hedef Seçimleri', isActive: true, totalDelegates: 450 },
];

export const INITIAL_FACTIONS: Faction[] = [
  { id: 'f-01', name: 'TÜMDEP', description: 'Mevcut stratejik odak grubu (Bizim Grubumuz)', color: '#3b82f6' },
  { id: 'f-02', name: 'Çağdaş Grubu', description: 'Geleneksel muhalif oluşum', color: '#ef4444', isMainCompetitor: true },
  { id: 'f-03', name: 'Bağımsızlar', description: 'Grup aidiyeti bulunmayan delegeler', color: '#94a3b8' },
  { id: 'f-04', name: 'Meslekte Birlik', description: 'Alternatif yükselen liste', color: '#10b981' },
];

export const INITIAL_HISTORICAL_RESULTS: ElectionResult[] = [
  { id: 'res-1', periodId: 'ep-24', year: 2024, chamberId: 'ch-s39', factionId: 'f-01', votes: 72 },
  { id: 'res-2', periodId: 'ep-24', year: 2024, chamberId: 'ch-s39', factionId: 'f-02', votes: 90 },
];

export const INITIAL_DELEGATES: Delegate[] = [
  { id: '1', name: 'Mehmet Özdemir', chamberId: 'ch-s39', status: VoteStatus.CERTAIN, lastContactDate: '2025-05-10', assignedManager: 'Ali Bey', notes: 'Süreç istikrarlı.', riskScore: 5, currentGroup: 'f-01', previousGroup: 'f-01', tendency: 'TÜMDEP Sadık', electionYear: 2028 },
  { id: '2', name: 'Ahmet Yılmaz', chamberId: 'ch-s39', status: VoteStatus.UNDECIDED, lastContactDate: '2025-05-12', assignedManager: 'Caner Bey', notes: 'Kararsız, görüşme bekliyor.', riskScore: 45, currentGroup: 'f-03', previousGroup: 'f-02', tendency: 'TÜMDEP Yakın', electionYear: 2028 },
  { id: '3', name: 'Selin Aksoy', chamberId: 'ch-s7', status: VoteStatus.RISKY, lastContactDate: '2025-04-20', assignedManager: 'Veli Bey', notes: 'Rakip grup temas kurmuş.', riskScore: 75, currentGroup: 'f-02', previousGroup: 'f-02', tendency: 'Rakibe Kayabilir', electionYear: 2028 },
];

export const STATUS_COLORS = {
  [VoteStatus.CERTAIN]: 'text-green-600 bg-green-50 border-green-200',
  [VoteStatus.UNDECIDED]: 'text-amber-600 bg-amber-50 border-amber-200',
  [VoteStatus.RISKY]: 'text-orange-600 bg-orange-50 border-orange-200',
  [VoteStatus.NEGATIVE]: 'text-red-600 bg-red-50 border-red-200',
};

export const STATUS_LABELS = {
  [VoteStatus.CERTAIN]: 'Kesin Destek',
  [VoteStatus.UNDECIDED]: 'Kararsız',
  [VoteStatus.RISKY]: 'Riskli / Kritik',
  [VoteStatus.NEGATIVE]: 'Karşı Oy',
};
