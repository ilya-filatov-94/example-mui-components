import axios from 'axios';

export function getEfsBlocks(ci, stand, setBlocks) {
  axios
    .get('sppd/efs/blockList', {
      params: { ci, stand },
    })
    .then(response => {
      setBlocks(response.data?.nodeCodes || []);
    })
    .catch(error => {
      if (error instanceof axios.AxiosError) {
        addNotification('error', 'Ошибка получения блоков ЕФС');
      }
      setBlocks([]);
    });
}

export function getEfsGroups(ci, stand, setGroups, setLOading) {
  setLoading(true);

  axios
    .post(
      'sppd/efs/groupPage',
      { ci, stand },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then(response => {
      setGroups(response.data || []);
    })
    .catch(error => {
      if (error instanceof axios.AxiosError) {
        addNotification('error', 'Ошибка получения групп');
      }
      setGroups([]);
    })
    .finally(() => {
      setLoading(false);
    });
}

export function saveFsGroups(data, setLoading, onSuccess) {
  setLoading(true);

  axios
    .post(
      'sppd/efs/groupChanges',
      { data },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then(response => {
      addNotification('info', 'Группы успешно сохранены');
      if (onSuccess) {
        onSuccess();
      }
    })
    .catch(error => {
      if (error instanceof axios.AxiosError) {
        addNotification('error', 'Ошибка сохранения групп');
      }
    })
    .finally(() => {
      setLoading(false);
    });
}
