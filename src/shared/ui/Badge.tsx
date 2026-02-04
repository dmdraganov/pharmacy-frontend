import type { HTMLAttributes, PropsWithChildren } from 'react';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'warning';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const Badge = ({
  children,
  className,
  variant = 'secondary',
  ...props
}: PropsWithChildren<BadgeProps>) => {
  const baseStyles =
    'inline-block h-fit rounded-full px-2 py-1 text-xs font-semibold uppercase';

  const variantStyles = {
    primary: 'bg-primary-subtle text-primary-emphasis',
    secondary: 'bg-background-muted text-text-default',
    danger: 'bg-danger-subtle text-danger',
    success: 'bg-success-subtle text-success',
    warning: 'bg-warning-subtle text-warning-text',
  };

  const combinedClasses = [baseStyles, variantStyles[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <span {...props} className={combinedClasses}>
      {children}
    </span>
  );
};

export default Badge;
