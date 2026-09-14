export type IsoDateArray = [
  number,
  number,
  number,
  number,
  number,
  ...number[],
];
export type DateLike = number | IsoDateArray | null;

export type RolloutStatus =
  'CREATED' | 'RUNNING' | 'PAUSED' | 'FINISHED' | 'FAILED';
export type StageStatus = 'PENDING' | 'PROCESSING' | 'FINISHED' | 'FAILED';

export interface Stage {
  stageId: number;
  sequenceNo: number;
  blockCodes: string[];
  sheduledTs: DateLike;
  status: StageStatus;
  finishedTs: DateLike;
  errorReason: string | null;
}

export interface Rollout {
  rolloutId: number;
  status: RolloutStatus;
  startTs: DateLike;
  endedTs: DateLike;
  stages: Stage[];
}

export interface RolloutPage {
  content: Rollout[];
  totalPages: number;
  totalElements: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
