import axios from 'axios';
import type { EfsGroupRaw, SaveEfsGroupsPayload } from '../EfsGroupEditor';

export async function fetchEfsBlocks(
  ci: string,
  stand: string,
): Promise<string[]> {
  const { data } = await axios.get<{ nodeCodes?: string[] }>(
    'sppd/efs/blockList',
    { params: { ci, stand } },
  );
  return data?.nodeCodes ?? [];
}

export async function fetchEfsGroups(
  ci: string,
  stand: string,
): Promise<EfsGroupRaw[]> {
  const { data } = await axios.post<{ data?: EfsGroupRaw[] }>(
    'sppd/efs/groupPage',
    { ci, stand },
    { withCredentials: true, headers: { 'Content-Type': 'application/json' } },
  );
  return data?.data ?? [];
}

export async function saveEfsGroups(
  payload: SaveEfsGroupsPayload,
): Promise<void> {
  await axios.post(
    'sppd/efs/groupChanges',
    { data: payload },
    { withCredentials: true, headers: { 'Content-Type': 'application/json' } },
  );
}
