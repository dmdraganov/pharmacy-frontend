import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  PropsWithChildren,
} from 'react';

import type { LinkProps } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'small' | 'medium';

// Base props for the button, excluding polymorphic 'as'
interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

// Overload for 'as' prop being 'button' (default)
interface ButtonAsButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, BaseButtonProps {
  as?: 'button';
}

// Overload for 'as' prop being 'a'
interface ButtonAsAnchorProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>, BaseButtonProps {
  as: 'a';
}

// Overload for 'as' prop being a React Router Link
interface ButtonAsLinkProps extends LinkProps, BaseButtonProps {
  as: React.ElementType; // This allows Link to be passed
}

// Combined ButtonProps type
type ButtonProps =
  | ButtonAsButtonProps
  | ButtonAsAnchorProps
  | ButtonAsLinkProps;

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  className,
  as: Component = 'button', // Default to 'button'
  ...props
}: PropsWithChildren<ButtonProps>) => {
  const baseStyles =
    'rounded font-bold transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-primary text-text-inverse hover:bg-primary-hover',
    secondary:
      'bg-background-muted text-text-default hover:bg-background-muted-hover',
    danger: 'bg-danger text-text-inverse hover:bg-danger-hover',
    ghost: 'bg-transparent text-text-default hover:bg-background-muted',
  };

  const sizeStyles = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
  };

  const combinedClasses = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component {...props} className={combinedClasses}>
      {children}
    </Component>
  );
};

export default Button;
