import { useState, useRef, useEffect, useCallback } from 'react';

interface UseDropdownProps {
  triggerOn?: 'click' | 'hover';
}

export const useDropdown = ({ triggerOn = 'click' }: UseDropdownProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const close = useCallback(
    (immediate = false) => {
      if (triggerOn === 'hover' && !immediate) {
        timeoutRef.current = window.setTimeout(() => setIsOpen(false), 200);
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(false);
      }
    },
    [triggerOn]
  );

  const open = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerOn === 'click' &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [triggerOn]);

  // Props to spread onto the trigger element for 'click' mode
  const triggerProps =
    triggerOn === 'click'
      ? {
          onClick: toggle,
        }
      : {};

  // Props to spread onto the main container for 'hover' mode
  const containerProps =
    triggerOn === 'hover'
      ? {
          onMouseEnter: open,
          onMouseLeave: () => close(),
        }
      : {};

  return {
    isOpen,
    setIsOpen,
    close,
    triggerProps,
    containerProps,
    dropdownRef,
  };
};
