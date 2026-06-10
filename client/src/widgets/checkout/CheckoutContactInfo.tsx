import { memo } from 'react';
import Input from '@/shared/ui/Input';

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface CheckoutContactInfoProps {
  contactInfo: ContactInfo;
  setContactInfo: (contactInfo: ContactInfo) => void;
  errors?: Partial<Record<keyof ContactInfo, string>>;
}

export const CheckoutContactInfo = memo(
  ({ contactInfo, setContactInfo, errors = {} }: CheckoutContactInfoProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setContactInfo({
        ...contactInfo,
        [name]: value,
      });
    };

    return (
      <div className='rounded-lg border border-border-default bg-background-default p-6'>
        <h2 className='mb-4 text-xl font-bold text-text-default'>
          Контактные данные
        </h2>
        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-2 gap-4'>
            <Input
              name='firstName'
              placeholder='Имя'
              label='Имя'
              value={contactInfo.firstName}
              onChange={handleChange}
              error={errors.firstName}
            />
            <Input
              name='lastName'
              placeholder='Фамилия'
              label='Фамилия'
              value={contactInfo.lastName}
              onChange={handleChange}
              error={errors.lastName}
            />
          </div>
          <Input
            name='email'
            type='email'
            placeholder='E-mail'
            label='E-mail'
            value={contactInfo.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            name='phone'
            type='tel'
            placeholder='Телефон'
            label='Телефон'
            value={contactInfo.phone}
            onChange={handleChange}
            error={errors.phone}
          />
        </div>
      </div>
    );
  }
);
