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

export function getEfsRolloutTemplate(ci, stand, setTemplate, setLoading) {
  setLoading(true);
  axios
    .get('sppd/efs/rollout/templatePage', {
      params: { ci, stand },
    })
    .then(response => {
      setTemplate(response.data || []);
    })
    .catch(error => {
      if (error instanceof axios.AxiosError) {
        addNotification('error', 'Ошибка получения шаблона тиража ЕФС');
        setTemplate([]);
      }
    })
    .finally(() => {
      setLoading(false);
    });
}

export function saveEfsRolloutTemplate(data, setLoading, onSuccess) {
  setLoading(true);

  axios
    .post(
      'sppd/efs/rollout/template',
      { data },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then(response => {
      addNotification('success', 'Шаблон тиража ЕФС успешно сохранён');

      if (onSuccess) {
        onSuccess();
      }
    })
    .catch(error => {
      if (error instanceof axios.AxiosError) {
        addNotification('error', 'Ошибка сохранения шаблона тиража ЕФС');
      }
      setGroups([]);
    })
    .finally(() => {
      setLoading(false);
    });
}
