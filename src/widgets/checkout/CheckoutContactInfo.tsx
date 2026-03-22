import { memo, useState } from 'react';
import { useAuthStore } from '@/features/auth';
import Input from '@/shared/ui/Input';
import type { User } from '@/entities/user';

const emptyUser: User = {
  id: '',
  role: 'USER',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

export const CheckoutContactInfo = memo(() => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<User>(user || emptyUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      key={JSON.stringify(user)}
      className='rounded-lg border border-border-default bg-background-default p-6'
    >
      <h2 className='mb-4 text-xl font-bold text-text-default'>
        Контактные данные
      </h2>
      <div className='flex flex-col gap-4'>
        <div className='grid grid-cols-2 gap-4'>
          <Input
            name='firstName'
            placeholder='Имя'
            value={formData.firstName}
            onChange={handleChange}
          />
          <Input
            name='lastName'
            placeholder='Фамилия'
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <Input
          name='email'
          type='email'
          placeholder='E-mail'
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          name='phone'
          type='tel'
          placeholder='Телефон'
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
    </div>
  );
});
