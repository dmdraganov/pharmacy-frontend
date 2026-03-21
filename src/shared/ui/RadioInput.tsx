import type { ReactNode } from 'react';

interface RadioInputProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export const RadioInput = ({
  name,
  value,
  checked,
  onChange,
  children,
  className = '',
}: RadioInputProps) => {
  const handleChange = () => {
    onChange(value);
  };

  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border border-border-default p-3 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/20 ${className}`}
    >
      <input
        type='radio'
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        className='mt-1'
      />
      <div className='flex-grow'>{children}</div>
    </label>
  );
};

export default RadioInput;
