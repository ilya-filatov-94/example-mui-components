export interface EfsGroupRaw {
  groupId: string;
  groupNm: string;
  seq: number;
  nodeCode?: string;
}

export interface EfsGroup {
  groupId: string;
  groupNm: string;
  seq: number;
  nodeCodes: string[];
}

export interface EfsTemplateStageRaw {
  nodeCodes?: string[];
  seq: number;
  scheduledTime?: string | null;
  delayMinutes?: number | null;
}

export interface TemplateRow {
  groupId: string;
  groupNm: string;
  nodeCodes: string[];
  templateSeq: number;
  scheduledTime: string | null;
  delayMinutes: number | null;
}

export interface SaveTemplateStage {
  groupId: string;
  sequenceNo: number;
  scheduledTime: string | null;
  delayMinutes: number | null;
}

export interface SaveTemplatePayload {
  ci: string;
  stand: string;
  stages: SaveTemplateStage[];
}

export interface EfsRolloutTemplateEditorProps {
  chosenSystem?: { serviceManagerId: string } | null;
  chosenStand?: string | null;
}
