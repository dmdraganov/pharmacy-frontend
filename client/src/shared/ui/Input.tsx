import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const defaultClasses =
      'w-full appearance-none rounded border border-border-default px-3 py-2 text-text-default focus:outline-2 focus:outline-primary';
    const errorClasses =
      'border-danger focus:outline-danger-emphasis text-danger';

    const combinedClasses = [defaultClasses, error && errorClasses, className]
      .filter(Boolean)
      .join(' ');

    return (
      <div className='w-full'>
        {label && (
          <label
            htmlFor={id}
            className='mb-1 block text-sm font-medium text-text-muted'
          >
            {label}
          </label>
        )}
        <input {...props} id={id} ref={ref} className={combinedClasses} />
        {error && <p className='mt-1 text-sm text-danger'>{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
