import { memo, useState, Children } from 'react';

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

  return (
    <div className='relative'>
      <div className='overflow-hidden'>
        <div
          className='flex transition-transform duration-300 ease-in-out'
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
          }}
        >
          {Children.map(children, (child) => (
            <div
              className='flex-shrink-0'
              style={{ width: `${100 / visibleItems}%` }}
            >
              <div className='p-2'>{child}</div>
            </div>
          ))}
        </div>
      </div>

      {canGoPrev && (
        <button
          onClick={handlePrev}
          className='absolute -left-2 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm hover:bg-white'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
        </button>
      )}
      {canGoNext && (
        <button
          onClick={handleNext}
          className='absolute -right-2 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm hover:bg-white'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5l7 7-7 7'
            />
          </svg>
        </button>
      )}
    </div>
  );
});

export default ProductSlider;
