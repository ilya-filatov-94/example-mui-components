import { DataTable } from '../../DataTable2';
import type { EfsGroup, EditingIds } from '../EfsGroupEditor';
import type { NameEditingState } from '../EfsGroupEditor';
import type { CompositionEditingState } from '../EfsGroupEditor';
import { useGroupsColumns } from './columns';

interface GroupsTableProps {
  groups: EfsGroup[];
  allBlocks: string[];
  editingName: NameEditingState;
  editingNodeCodes: CompositionEditingState;
  editingIds: EditingIds;
  onMove: (groupId: string, direction: 'up' | 'down') => void;
  onDisband: (groupId: string) => void;
}

export function GroupsTable(props: GroupsTableProps) {
  const columns = useGroupsColumns(props);

  return (
    <DataTable<EfsGroup>
      data={props.groups}
      columns={columns}
      getRowId={row => row.groupId}
      minWidth={900}
    />
  );
}
