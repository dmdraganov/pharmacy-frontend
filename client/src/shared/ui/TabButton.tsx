import type { ReactNode } from 'react';

interface TabButtonProps {
  onClick: () => void;
  isActive: boolean;
  children: ReactNode;
  disabled?: boolean;
}

const TabButton = ({
  onClick,
  isActive,
  children,
  disabled = false,
}: TabButtonProps) => (
  <button
    type='button'
    onClick={onClick}
    disabled={disabled}
    className={`flex-1 rounded-md px-4 py-2 text-center font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
      isActive
        ? 'bg-primary text-text-inverse shadow'
        : 'bg-background-muted text-text-default hover:bg-background-muted-hover'
    }`}
  >
    {children}
  </button>
);

export default TabButton;
