import { useFavorites } from '@/features/favorites';
import HeartIcon from '@/shared/ui/HeartIcon';

interface FavoriteButtonProps {
  productId: string;
  className?: string;
}

export const FavoriteButton = ({
  productId,
  className,
}: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const isFavorited = isFavorite(productId);

  const handleToggle = () => {
    toggleFavorite(productId);
  };

  const baseClasses = 'z-10 cursor-pointer';

  return (
    <button
      onClick={handleToggle}
      className={`${baseClasses} ${className || ''}`}
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
