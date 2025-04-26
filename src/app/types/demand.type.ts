export enum DemandType {
  OPERATIONAL = 'OPERATIONAL',
  STRATEGIC = 'STRATEGIC',
  PROJECT = 'PROJECT',
  INCIDENT = 'INCIDENT',
  SIMPLE = 'SIMPLE',
  COMPLEX = 'COMPLEX',
  HIGH_PRIORITY = 'HIGH_PRIORITY',
  MEDIUM_PRIORITY = 'MEDIUM_PRIORITY',
  LOW_PRIORITY = 'LOW_PRIORITY',
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  PENDING = 'PENDING',
  DEVELOPMENT = 'DEVELOPMENT',
  MARKETING = 'MARKETING',
  SUPPORT = 'SUPPORT',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  SALES = 'SALES',
  PRODUCTION = 'PRODUCTION',
  HUMAN_RESOURCE = 'HUMAN_RESOURCE',
  EMAIL = 'Email',
  RESEARCH = 'Research',
  PARTNERSHIPS = 'Partnerships',
  CODING = 'Coding',
  DOCUMENTATION = 'Documentation',
  INVESTIGATION = 'Investigation',
  MEETING = 'Meeting'
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