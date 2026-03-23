import { useState, type ReactNode } from 'react';
import { ChevronIcon } from './ChevronIcon';

type AccordionProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

const Accordion = ({ title, children, className }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const defaultClasses = 'border-b border-border-default';
  const combinedClasses = [defaultClasses, className].filter(Boolean).join(' ');

  return (
    <div className={combinedClasses}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex w-full items-center justify-between py-4 text-left font-semibold text-text-default cursor-pointer'
      >
        <span>{title}</span>
        <ChevronIcon
          direction={isOpen ? 'up' : 'down'}
          className='h-4 w-4'
        />
      </button>
      {isOpen && <div className='pb-4'>{children}</div>}
    </div>
  );
};

export default Accordion;
