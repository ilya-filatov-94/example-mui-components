export function isCancelledError(error: unknown): boolean {
  if (!error) return false;

  if (typeof error === 'object' && error !== null) {
    const e = error as {
      __CANCEL__?: boolean;
      name?: string;
      code?: string;
      message?: string;
    };

    if (e.__CANCEL__ === true) return true;
    if (e.name === 'CanceledError') return true;
    if (e.name === 'Cancel') return true; // axios v0.x
    if (e.name === 'AbortError') return true; // нативный AbortController
    if (e.name === 'CancelledError') return true; // TanStack Query v5
    if (e.code === 'ERR_CANCELED') return true; // axios v1.x
  }

  return false;
}
