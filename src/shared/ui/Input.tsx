import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className, ...props }: InputProps) => {
  const defaultClasses =
    'w-full appearance-none rounded border border-border-default px-3 py-2 text-text-default focus:outline-2 focus:outline-primary';

  const combinedClasses = [defaultClasses, className].filter(Boolean).join(' ');

  return <input {...props} className={combinedClasses} />;
};

export default Input;
