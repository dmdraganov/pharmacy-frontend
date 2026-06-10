import { useQueryClient } from '@tanstack/react-query';
import { useIsFavorite, useFavoriteActions } from '@/features/favorites';
import HeartIcon from '@/shared/ui/HeartIcon';

interface FavoriteButtonProps {
  productId: string;
  className?: string;
}

export const FavoriteButton = ({
  productId,
  className,
}: FavoriteButtonProps) => {
  const queryClient = useQueryClient();
  const toggleFavorite = useFavoriteActions();
  const isFavorited = useIsFavorite(productId);

  const handleToggle = async () => {
    await toggleFavorite(productId);
    queryClient.invalidateQueries({ queryKey: ['favorites'] });
  };

  const baseClasses = 'z-10 cursor-pointer';

  return (
    <button
      onClick={handleToggle}
      className={`${baseClasses} ${className || ''}`}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <HeartIcon
        className={`h-6 w-6 transition-colors ${
          isFavorited
            ? 'text-danger'
            : 'fill-none stroke-current stroke-2 text-border-default hover:text-danger'
        }`}
      />
    </button>
  );
};
