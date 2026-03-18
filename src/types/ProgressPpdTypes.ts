
export type ProgressBarProps = {
  operationId: string;
  overallStatus: 'COMPLETED' | 'PARTIALLY_COMPLETED' | 'FAILED' | 'PENDING' | 'DEFAULT' | 'CANCELLED';
  completedTargets: number;
  totalTargets: number;
  progress?: number;
}
