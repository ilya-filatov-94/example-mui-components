import type { EfsGroup, EfsGroupRaw } from './types';

export function groupRawToGroups(raw: EfsGroupRaw[]): EfsGroup[] {
  const map = new Map<string, EfsGroup>();
  for (const item of raw) {
    let group = map.get(item.groupId);
    if (!group) {
      group = {
        groupId: item.groupId,
        groupNm: item.groupNm,
        seq: item.seq,
        nodeCodes: [],
      };
      map.set(item.groupId, group);
    }
    if (item.nodeCode) group.nodeCodes.push(item.nodeCode);
  }
  return Array.from(map.values()).sort((a, b) => a.seq - b.seq);
}
