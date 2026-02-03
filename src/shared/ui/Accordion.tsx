import { useState, type ReactNode } from 'react';

type AccordionProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

const Accordion = ({ title, children, className }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const defaultClasses = 'border-b border-border-subtle';
  const combinedClasses = [defaultClasses, className].filter(Boolean).join(' ');

  return (
    <div className={combinedClasses}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex w-full items-center justify-between py-4 text-left font-semibold text-text-default cursor-pointer'
      >
        <span>{title}</span>
        <svg
          className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          width='16'
          height='16'
          viewBox='0 0 16 16'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M4 6L8 10L12 6'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
      {isOpen && <div className='pb-4'>{children}</div>}
    </div>
  );
};

export default Accordion;
