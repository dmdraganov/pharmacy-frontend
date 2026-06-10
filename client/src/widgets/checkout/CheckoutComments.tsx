import { memo } from 'react';
import Textarea from '@/shared/ui/Textarea';

interface CheckoutCommentsProps {
  comment: string;
  setComment: (comment: string) => void;
}

export const CheckoutComments = memo(
  ({ comment, setComment }: CheckoutCommentsProps) => {
    return (
      <div className='rounded-lg border border-border-default bg-background-default p-6'>
        <h2 className='mb-4 text-xl font-bold text-text-default'>
          Комментарий к заказу
        </h2>
        <Textarea
          name='comment'
          placeholder='Ваш комментарий...'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />
      </div>
    );
  }
);
