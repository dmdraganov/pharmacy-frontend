import { useState, useRef, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

interface DropdownProps {
  triggerOn?: 'click' | 'hover';
  children: (
    isOpen: boolean,
    open: () => void,
    close: (immediate?: boolean) => void,
    toggle: () => void
  ) => ReactNode;
}

export const Dropdown = ({ triggerOn = 'click', children }: DropdownProps) => {
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

  const eventHandlers =
    triggerOn === 'hover'
      ? { onMouseEnter: open, onMouseLeave: () => close() }
      : {};

  return (
    <div ref={dropdownRef} className='relative inline-block' {...eventHandlers}>
      {/* eslint-disable-next-line react-hooks/refs */}
      {children(isOpen, open, close, toggle)}
    </div>
  );
};
