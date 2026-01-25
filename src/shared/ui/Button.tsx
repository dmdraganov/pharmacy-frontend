import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  PropsWithChildren,
} from 'react';

import type { LinkProps } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'small' | 'medium';

// Base props for the button, excluding polymorphic 'as'
interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

// Overload for 'as' prop being 'button' (default)
interface ButtonAsButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    BaseButtonProps {
  as?: 'button';
}

// Overload for 'as' prop being 'a'
interface ButtonAsAnchorProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    BaseButtonProps {
  as: 'a';
}

// Overload for 'as' prop being a React Router Link
interface ButtonAsLinkProps extends LinkProps, BaseButtonProps {
  as: React.ElementType; // This allows Link to be passed
}

// Combined ButtonProps type
type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps | ButtonAsLinkProps;

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  className,
  as: Component = 'button', // Default to 'button'
  ...props
}: PropsWithChildren<ButtonProps>) => {
  const baseStyles =
    'rounded font-bold transition-colors duration-200 hover:cursor-pointer';

  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-700',
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

