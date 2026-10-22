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

export interface EfsGroupPayload {
  name: string;
  sequenceNo: number;
  nodeCodes: string[];
}

export interface SaveEfsGroupsPayload {
  ci: string;
  stand: string;
  groups: EfsGroupPayload[];
}

export interface EfsGroupEditorProps {
  chosenSystem?: { serviceManagerId: string } | null;
  chosenStand?: string | null;
}

export interface EditingIds {
  editingNameId: string | null;
  editingGroupId: string | null;
}
