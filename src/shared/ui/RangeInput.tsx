import { useEffect, useState, useCallback, useRef } from 'react';
import { useDebouncedCallback } from '@/shared/hooks/useDebouncedCallback';
import Input from './Input';

type RangeInputProps = {
  min: number;
  max: number;
  step?: number;
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  className?: string;
};

const RangeInput = ({
  min,
  max,
  step = 1,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  className,
}: RangeInputProps) => {
  // Internal state for immediate visual feedback
  const [displayMin, setDisplayMin] = useState(minValue);
  const [displayMax, setDisplayMax] = useState(maxValue);

  // Separate state for the live text in the input box
  const [inputValueMin, setInputValueMin] = useState(String(minValue));
  const [inputValueMax, setInputValueMax] = useState(String(maxValue));

  const trackRef = useRef<HTMLDivElement>(null);
  const minThumbRef = useRef<HTMLDivElement>(null);
  const maxThumbRef = useRef<HTMLDivElement>(null);

  // Debounce the callbacks to the parent component
  const debouncedOnMinChange = useDebouncedCallback(onMinChange, 300);
  const debouncedOnMaxChange = useDebouncedCallback(onMaxChange, 300);

  // Sync internal display state with props from parent
  useEffect(() => {
    setDisplayMin(minValue);
    setInputValueMin(String(minValue));
  }, [minValue]);

  useEffect(() => {
    setDisplayMax(maxValue);
    setInputValueMax(String(maxValue));
  }, [maxValue]);

  const getPercent = useCallback(
    (value: number) => (max === min ? 0 : ((value - min) / (max - min)) * 100),
    [min, max]
  );

  const getValueFromX = useCallback(
    (x: number) => {
      if (!trackRef.current) return 0;
      const { left, width } = trackRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (x - left) / width));
      const value = min + percent * (max - min);
      return Math.round(value / step) * step;
    },
    [min, max, step]
  );

  // --- Slider Drag Logic ---
  const useDraggable = (
    thumbRef: React.RefObject<HTMLDivElement | null>,
    onDrag: (value: number) => void,
    constrain: (value: number) => number
  ) => {
    useEffect(() => {
      const thumb = thumbRef.current;
      if (!thumb) return;

      const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const handleMouseMove = (moveEvent: MouseEvent) => {
          const newValue = getValueFromX(moveEvent.clientX);
          onDrag(constrain(newValue));
        };

        const handleMouseUp = () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      };

      thumb.addEventListener('mousedown', handleMouseDown);
      return () => thumb.removeEventListener('mousedown', handleMouseDown);
    }, [thumbRef, onDrag, constrain]);
  };

  const handleMinDrag = (value: number) => {
    setDisplayMin(value);
    setInputValueMin(String(value));
    debouncedOnMinChange(value);
  };

  const handleMaxDrag = (value: number) => {
    setDisplayMax(value);
    setInputValueMax(String(value));
    debouncedOnMaxChange(value);
  };

  useDraggable(minThumbRef, handleMinDrag, (val) =>
    Math.min(val, displayMax - step)
  );
  useDraggable(maxThumbRef, handleMaxDrag, (val) =>
    Math.max(val, displayMin + step)
  );

  // --- Track Click Logic ---
  const handleTrackMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const newValue = getValueFromX(e.clientX);
    const distToMin = Math.abs(newValue - displayMin);
    const distToMax = Math.abs(newValue - displayMax);

    if (newValue < displayMin) handleMinDrag(newValue);
    else if (newValue > displayMax) handleMaxDrag(newValue);
    else if (distToMin < distToMax) handleMinDrag(newValue);
    else handleMaxDrag(newValue);
  };

  // --- Number Input Logic ---
  const commitMinValue = () => {
    let value = Number(inputValueMin);
    if (isNaN(value) || value < min) value = min;
    if (value > displayMax) value = displayMax;

    // Sync all states and notify parent via debounce
    setDisplayMin(value);
    setInputValueMin(String(value));
    debouncedOnMinChange(value);
  };

  const commitMaxValue = () => {
    let value = Number(inputValueMax);
    if (isNaN(value) || value > max) value = max;
    if (value < displayMin) value = displayMin;

    setDisplayMax(value);
    setInputValueMax(String(value));
    debouncedOnMaxChange(value);
  };

  const handleMinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) =>
    e.key === 'Enter' && commitMinValue();
  const handleMaxKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) =>
    e.key === 'Enter' && commitMaxValue();

  // --- Render ---
  const minPercent = getPercent(displayMin);
  const maxPercent = getPercent(displayMax);

  return (
    <div className={className}>
      <div className='flex items-center gap-2'>
        <Input
          type='number'
          value={inputValueMin}
          min={min}
          max={max}
          onChange={(e) => setInputValueMin(e.target.value)}
          onKeyDown={handleMinKeyDown}
          onBlur={commitMinValue}
          placeholder='От'
          className='w-full'
        />
        <span className='text-text-subtle'>-</span>
        <Input
          type='number'
          value={inputValueMax}
          min={min}
          max={max}
          onChange={(e) => setInputValueMax(e.target.value)}
          onKeyDown={handleMaxKeyDown}
          onBlur={commitMaxValue}
          placeholder='До'
          className='w-full'
        />
      </div>

      <div className='relative mt-6 flex h-8 items-center px-2'>
        <div
          ref={trackRef}
          onMouseDown={handleTrackMouseDown}
          className='relative h-1 w-full cursor-pointer rounded-md bg-background-muted'
        >
          <div
            className='absolute z-10 h-1 rounded-md bg-primary'
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          ></div>
          <div
            ref={minThumbRef}
            className='absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 h-4 w-4 cursor-grab rounded-full bg-primary-emphasis active:cursor-grabbing'
            style={{ left: `${minPercent}%` }}
          ></div>
          <div
            ref={maxThumbRef}
            className='absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 h-4 w-4 cursor-grab rounded-full bg-primary-emphasis active:cursor-grabbing'
            style={{ left: `${maxPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default RangeInput;
