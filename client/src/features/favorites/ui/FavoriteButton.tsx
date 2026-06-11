import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useFavoriteActions, useIsFavorite } from '../model/hooks';
import HeartIcon from '@/shared/ui/HeartIcon';

interface FavoriteButtonProps {
  productId: string;
  isAuthenticated: boolean;
  className?: string;
}

export const FavoriteButton = ({
  productId,
  isAuthenticated,
  className,
}: FavoriteButtonProps) => {
  const queryClient = useQueryClient();
  const toggleFavorite = useFavoriteActions();
  const isFavorited = useIsFavorite(productId);
  const [isPending, setIsPending] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleToggle = async () => {
    if (!isAuthenticated || isPending) return;

    setIsPending(true);
    setHasError(false);

    try {
      await toggleFavorite(productId);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    } catch (_error) {
      setHasError(true);
    } finally {
      setIsPending(false);
    }
  };

  const isDisabled = !isAuthenticated || isPending;
  const baseClasses =
    'z-10 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60';
  const label = !isAuthenticated
    ? 'Войдите, чтобы добавить в избранное'
    : isFavorited
      ? 'Удалить из избранного'
      : 'Добавить в избранное';
  const heartStateClasses = hasError
    ? 'text-danger'
    : isPending
      ? 'text-text-muted'
      : isFavorited
        ? 'text-danger'
        : 'fill-none stroke-current stroke-2 text-border-default hover:text-danger';

  return (
    <button
      onClick={handleToggle}
      disabled={isDisabled}
      className={`${baseClasses} ${className || ''}`}
      aria-label={label}
      title={hasError ? 'Не удалось обновить избранное' : label}
    >
      <HeartIcon className={`h-6 w-6 transition-colors ${heartStateClasses}`} />
    </button>
  );
};
