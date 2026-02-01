import { memo } from 'react';
import type { Product } from '@/entities/product';
import { ProductCharacteristics } from '@/entities/product';
import { InfoSection } from '@/shared/ui/InfoSection';

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo = memo(({ product }: ProductInfoProps) => {
  const { description, info, characteristics } = product;

  const sections = [
    { title: 'Описание', content: description },
    { title: 'Состав', content: info?.composition },
    { title: 'Показания', content: info?.indications },
    { title: 'Способ применения', content: info?.usage },
    { title: 'Особые указания', content: info?.warnings },
    { title: 'Условия хранения', content: info?.storage },
  ];

  return (
    <div className='mt-12'>
      {sections.map((section) => {
        if (section.content && section.content.length > 0) {
          return (
            <InfoSection
              key={section.title}
              title={section.title}
              content={section.content}
            />
          );
        }
        return null;
      })}
      {characteristics && characteristics.length > 0 && (
        <ProductCharacteristics characteristics={characteristics} />
      )}
    </div>
  );
});
