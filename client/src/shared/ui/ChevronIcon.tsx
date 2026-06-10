import { memo } from 'react';
import ChevronDown from './assets/icons/chevron-down.svg?react';

type ChevronIconProps = {
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
};

const directionClasses = {
  up: '-rotate-180',
  down: '',
  left: 'rotate-90',
  right: '-rotate-90',
};

export const ChevronIcon = memo(
  ({ direction = 'down', className }: ChevronIconProps) => {
    const classes = [
      'transform transition-transform',
      directionClasses[direction],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return <ChevronDown className={classes} />;
  }
);
