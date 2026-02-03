import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className, ...props }: InputProps) => {
  const defaultClasses =
    'w-full appearance-none rounded border border-border-default px-3 py-2 leading-tight text-text-default shadow focus:outline-none focus:ring-2 focus:ring-primary';

  const combinedClasses = [defaultClasses, className].filter(Boolean).join(' ');

  return <input {...props} className={combinedClasses} />;
};

export default Input;
