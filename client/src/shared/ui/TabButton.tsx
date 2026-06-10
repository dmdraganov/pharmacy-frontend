import type { ReactNode } from 'react';

interface TabButtonProps {
  onClick: () => void;
  isActive: boolean;
  children: ReactNode;
}

const TabButton = ({ onClick, isActive, children }: TabButtonProps) => (
  <button
    type='button'
    onClick={onClick}
    className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-center font-medium transition-colors ${
      isActive
        ? 'bg-primary text-text-inverse shadow'
        : 'bg-background-muted text-text-default hover:bg-background-muted-hover'
    }`}
  >
    {children}
  </button>
);

export default TabButton;
