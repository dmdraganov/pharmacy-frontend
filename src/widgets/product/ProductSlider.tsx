import { memo, useState, Children, type ReactElement } from 'react';
import { ChevronIcon } from '@/shared/ui/ChevronIcon';

type SliderProps = {
  children: React.ReactNode;
};

const ProductSlider = memo(({ children }: SliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleItems = 4;
  const totalItems = Children.count(children);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalItems - visibleItems;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, totalItems - visibleItems)
    );
  };

  const buttonClasses =
    'absolute top-1/2 z-10 -translate-y-1/2 transform rounded-full border border-border-default bg-background-default p-2 text-text-default hover:bg-background-muted-hover cursor-pointer';

  return (
    <div className='relative'>
      <div className='overflow-hidden py-8'>
        <div
          className='flex transition-transform duration-300 ease-in-out -mx-2'
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
          }}
        >
          {Children.map(children, (child) => (
            <div
              key={(child as ReactElement).key}
              className='shrink-0 px-2'
              style={{ width: `${100 / visibleItems}%` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {canGoPrev && (
        <button onClick={handlePrev} className={`${buttonClasses} -left-5`}>
          <ChevronIcon direction='left' className='h-6 w-6' />
        </button>
      )}
      {canGoNext && (
        <button onClick={handleNext} className={`${buttonClasses} -right-5`}>
          <ChevronIcon direction='right' className='h-6 w-6' />
        </button>
      )}
    </div>
  );
});

export default ProductSlider;
