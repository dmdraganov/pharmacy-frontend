import { memo } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/shared/ui/Button';

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  linkTo: string;
}

const EmptyState = memo(
  ({ title, description, buttonText, linkTo }: EmptyStateProps) => {
    return (
      <div className='text-center'>
        <h1 className='mb-4 text-2xl font-bold text-text-heading'>{title}</h1>
        <p className='mb-6 text-text-muted'>{description}</p>
        <Link to={linkTo}>
          <Button>{buttonText}</Button>
        </Link>
      </div>
    );
  }
);

export default EmptyState;
