import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className, ...props }: InputProps) => {
  const defaultClasses =
    'focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none';

  const combinedClasses = [defaultClasses, className].filter(Boolean).join(' ');

  return <input {...props} className={combinedClasses} />;
};

export default Input;
