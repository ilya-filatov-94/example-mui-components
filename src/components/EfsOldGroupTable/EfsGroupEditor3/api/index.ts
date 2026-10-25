import axios from 'axios';
import type { EfsGroupRaw } from '../model/types';

export async function fetchEfsGroups(
  ci: string,
  stand: string,
): Promise<EfsGroupRaw[]> {
  const { data } = await axios.post<EfsGroupRaw[]>(
    'sppd/efs/groupPage',
    { ci, stand },
    { withCredentials: true, headers: { 'Content-Type': 'application/json' } },
  );
  return data ?? [];
}

export async function fetchEfsRolloutTemplate(
  ci: string,
  stand: string,
): Promise<EfsTemplateStageRaw[]> {
  const { data } = await axios.get<EfsTemplateStageRaw[]>(
    'sppd/efs/rollout/templatePage',
    { params: { ci, stand } },
  );
  return data ?? [];
}

export async function saveEfsRolloutTemplate(
  payload: SaveTemplatePayload,
): Promise<void> {
  await axios.post(
    'sppd/efs/rollout/template',
    { data: payload },
    { withCredentials: true, headers: { 'Content-Type': 'application/json' } },
  );
}
