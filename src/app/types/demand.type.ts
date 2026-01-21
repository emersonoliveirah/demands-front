export enum DemandType {
  OPERATIONAL = 'OPERACIONAL',
  STRATEGIC = 'ESTRATÉGICO',
  PROJECT = 'PROJETO',
  INCIDENT = 'INCIDENTE',
  SIMPLE = 'SIMPLES',
  COMPLEX = 'COMPLEXO',
  HIGH_PRIORITY = 'ALTA PRIORIDADE',
  MEDIUM_PRIORITY = 'MÉDIA PRIORIDADE',
  LOW_PRIORITY = 'BAIXA PRIORIDADE',
  TO_DO = 'A FAZER',
  IN_PROGRESS = 'EM ANDAMENTO',
  COMPLETED = 'CONCLUÍDO',
  CANCELED = 'CANCELADO',
  PENDING = 'PENDENTE',
  DEVELOPMENT = 'DESENVOLVIMENTO',
  MARKETING = 'MARKETING',
  SUPPORT = 'SUPORTE',
  ADMINISTRATIVE = 'ADMINISTRATIVO',
  SALES = 'VENDAS',
  PRODUCTION = 'PRODUÇÃO',
  HUMAN_RESOURCE = 'RECURSOS HUMANOS',
  EMAIL = 'Email',
  RESEARCH = 'Pesquisa',
  PARTNERSHIPS = 'Parcerias',
  CODING = 'Programação',
  DOCUMENTATION = 'Documentação',
  INVESTIGATION = 'Investigação',
  MEETING = 'Reunião'
}

export enum DemandStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  CLOSED = 'CLOSED'
}

export interface Demand {
  demandId?: string;
  userId: string;
  userIds: string[];
  title: string;
  description: string;
  status?: DemandStatus;
  startDate: string;
  endDate: string;
  type: DemandType;
  startTime?: string;
  pauseTime?: string;
  totalDuration?: number;
  autoStart: boolean;
  statusDate?: string;
  // outros campos conforme necessário
}
