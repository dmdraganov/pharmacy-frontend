import { type InputHTMLAttributes } from 'react';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
};

const Checkbox = ({ className, label, id, ...props }: CheckboxProps) => {
  const defaultClasses =
    'flex items-center gap-2 text-sm text-text-default cursor-pointer';
  const combinedClasses = [defaultClasses, className].filter(Boolean).join(' ');

  return (
    <label htmlFor={id} className={combinedClasses}>
      <input
        type='checkbox'
        id={id}
        className='size-4 cursor-pointer rounded border-border-default text-primary-emphasis focus:ring-primary'
        {...props}
      />
      {label}
    </label>
  );
};

export default Checkbox;
