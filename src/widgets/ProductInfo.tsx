import { memo } from 'react';
import type { Product } from '@/entities/product/model';
import { ProductCharacteristics } from '@/entities/product/ui/ProductCharacteristics';
import { InfoSection } from '@/shared/ui/InfoSection';

interface ProductInfoProps {
  product: Product;
}

const INFO_SECTIONS = [
  { key: 'description', title: 'Описание' },
  { key: 'composition', title: 'Состав' },
  { key: 'indications', title: 'Показания' },
  { key: 'contraindications', title: 'Противопоказания' },
  { key: 'sideEffects', title: 'Побочные эффекты' },
  { key: 'dosage', title: 'Способ применения и дозы' },
  { key: 'storage', title: 'Условия хранения' },
] as const;

export const ProductInfo = memo(({ product }: ProductInfoProps) => {
  return (
    <div className='mt-12'>
      {INFO_SECTIONS.map((section) => {
        const content = product[section.key];
        if (content && content.length > 0) {
          return (
            <InfoSection
              key={section.key}
              title={section.title}
              content={content}
            />
          );
        }
        return null;
      })}
      {product.characteristics && product.characteristics.length > 0 && (
        <ProductCharacteristics characteristics={product.characteristics} />
      )}
    </div>
  );
});
