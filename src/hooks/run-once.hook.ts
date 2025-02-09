import { FC, useEffect, useRef } from 'react';

export type useRunOnceProps = {
  fn: () => unknown;
};

export const useRunOnce: FC<useRunOnceProps> = ({ fn }) => {
  const triggered = useRef<boolean>(false);

  useEffect(() => {
    if (!triggered.current) {
      fn();
      triggered.current = true;
    }
  }, [fn]);

  return null;
};
