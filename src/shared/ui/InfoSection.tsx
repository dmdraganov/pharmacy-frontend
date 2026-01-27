import { memo } from 'react';

export const InfoSection = memo(
  ({ title, content }: { title: string; content: string[] }) => (
    <div className='mb-6'>
      <h2 className='mb-2 text-2xl font-bold'>{title}</h2>
      {content.map((paragraph, index) => (
        <p key={index} className='mb-2'>
          {paragraph}
        </p>
      ))}
    </div>
  )
);
