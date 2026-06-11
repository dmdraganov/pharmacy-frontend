type DebouncedCallback<TKey, TArgs extends unknown[]> = (
  key: TKey,
  ...args: TArgs
) => void;

type KeyedDebounce<TKey, TArgs extends unknown[]> = DebouncedCallback<
  TKey,
  TArgs
> & {
  cancel: (key: TKey) => void;
  cancelAll: () => void;
};

export const createKeyedDebounce = <TKey, TArgs extends unknown[]>(
  callback: (key: TKey, ...args: TArgs) => void | Promise<void>,
  delay: number
) => {
  const timers = new Map<TKey, ReturnType<typeof setTimeout>>();

  const debounced = ((key, ...args) => {
    clearTimeout(timers.get(key));
    timers.set(
      key,
      setTimeout(() => {
        timers.delete(key);
        void callback(key, ...args);
      }, delay)
    );
  }) as KeyedDebounce<TKey, TArgs>;

  debounced.cancel = (key: TKey) => {
    clearTimeout(timers.get(key));
    timers.delete(key);
  };

  debounced.cancelAll = () => {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
  };

  return debounced;
};
