
export type ProgressBarProps = {
  operationId: string;
  overallStatus: string;
  completedTargets: number;
  totalTargets: number;
  progress?: number;
}