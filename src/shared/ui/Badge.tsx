import type { HTMLAttributes, PropsWithChildren } from 'react';

type BadgeProps = HTMLAttributes<HTMLSpanElement>;

const Badge = ({ children, ...props }: PropsWithChildren<BadgeProps>) => {
  return (
    <span
      {...props}
      className='inline-block rounded-full bg-red-500 px-2 py-1 text-xs font-semibold uppercase text-white'
    >
      {children}
    </span>
  );
};

export default Badge;
