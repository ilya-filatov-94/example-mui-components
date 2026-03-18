export type ProgressToastType = {
    id: number;
    operationId: string; // uuid
    nameControlObject: string;
    nameIntPoint: string;
    ottStand: string;
    overallStatus: 'COMPLETED' | 'PARTIALLY_COMPLETED' | 'FAILED' | 'PENDING' | 'DEFAULT' | 'CANCELLED';
    completedTargets: number;
    totalTargets: number;
    progress: number;
}

export type TottStand = "IFT" | "NT" | "PSI" | "PROM";