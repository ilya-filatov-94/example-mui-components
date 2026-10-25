import type { EfsGroup } from '@/entities/efs-group';
import type {
  EfsTemplateStageRaw,
  SaveTemplateStage,
  SaveTemplatePayload,
  TemplateRow,
} from './types';

export function normalizeNodeCodes(nodeCodes: string[]): string {
  return [...nodeCodes].sort().join('|');
}

export function buildTemplateRows(
  groups: EfsGroup[],
  template: EfsTemplateStageRaw[],
): TemplateRow[] {
  if (groups.length === 0) return [];

  const rows: TemplateRow[] = groups.map(group => {
    const stage = template.find(
      s =>
        normalizeNodeCodes(s.nodeCodes ?? []) ===
        normalizeNodeCodes(group.nodeCodes),
    );
    return {
      groupId: group.groupId,
      groupNm: group.groupNm,
      nodeCodes: group.nodeCodes,
      templateSeq: stage?.seq ?? group.seq,
      scheduledTime: stage?.scheduledTime ?? null,
      delayMinutes: stage?.delayMinutes ?? null,
    };
  });

  return rows.sort((a, b) => a.templateSeq - b.templateSeq);
}

/** Валидация задержки в часах: неотрицательное число, кратное 0.5. */
export function isValidDelay(value: string): boolean {
  if (value === '') return false;
  const num = Number(value);
  if (Number.isNaN(num) || num < 0) return false;
  // x * 2 должно быть целым — так избегаем ошибок floating-point
  return Number.isInteger(num * 2);
}

export function toSavePayload(
  ci: string,
  stand: string,
  rows: TemplateRow[],
  scheduledTime: string,
  delayHoursByGroupId: Record<string, number | ''>,
): SaveTemplatePayload {
  const stages: SaveTemplateStage[] = rows.map((row, index) => {
    if (index === 0) {
      return {
        groupId: row.groupId,
        sequenceNo: index + 1,
        scheduledTime,
        delayMinutes: null,
      };
    }
    const hours = delayHoursByGroupId[row.groupId];
    const numeric = hours === '' || hours === undefined ? 0 : Number(hours);
    return {
      groupId: row.groupId,
      sequenceNo: index + 1,
      scheduledTime: null,
      delayMinutes: Math.round(numeric * 60),
    };
  });

  return { ci, stand, stages };
}
