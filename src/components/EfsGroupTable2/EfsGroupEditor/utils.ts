import type { EfsGroup, EfsGroupPayload, EfsGroupRaw } from './types';

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

export function normalizeSequence(groups: EfsGroup[]): EfsGroup[] {
  return groups.map((group, index) => ({ ...group, seq: index + 1 }));
}

export function getFreeBlocks(
  allBlocks: string[],
  groups: EfsGroup[],
): string[] {
  const used = new Set(groups.flatMap(g => g.nodeCodes));
  return allBlocks.filter(block => !used.has(block));
}

export function toSavePayload(
  groups: EfsGroup[],
  freeBlocks: string[],
): EfsGroupPayload[] {
  const existing = groups.map(group => ({
    name: group.groupNm,
    sequenceNo: group.seq,
    nodeCodes: group.nodeCodes,
  }));
  const singletons = freeBlocks.map((block, index) => ({
    name: block,
    sequenceNo: groups.length + index + 1,
    nodeCodes: [block],
  }));
  return [...existing, ...singletons];
}

export function getBlockedByOthers(
  groups: EfsGroup[],
  excludeGroupId: string | null,
): Set<string> {
  const set = new Set<string>();
  if (!excludeGroupId) return set;
  for (const group of groups) {
    if (group.groupId === excludeGroupId) continue;
    for (const code of group.nodeCodes) set.add(code);
  }
  return set;
}
