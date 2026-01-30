import type { ReactNode, ReactElement } from 'react';

export const composeProviders = (
  ...providers: Array<(props: { children: ReactNode }) => ReactElement>
): ((props: { children: ReactNode }) => ReactNode) => {
  return ({ children }) =>
    providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children
    );
};
