
export type ProgressBarProps = {
  operationId: string;
  overallStatus: 'COMPLETED' | 'PARTIALLY_COMPLETED' | 'FAILED' | 'PROCESSING' | 'DEFAULT' | 'CANCELLED';
  completedTargets: number;
  totalTargets: number;
  progress?: number;
}
