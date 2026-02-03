import { memo, useState, useEffect } from 'react';
import { useUser } from '@/features/user-profile';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import type { User } from '@/entities/user';

export const ProfileDetails = memo(() => {
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState<User>(user);
  const [errors, setErrors] = useState<Partial<User>>({});
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear the error for the field being edited
    if (errors[name as keyof User]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<User> = {};
    if (!formData.firstName)
      newErrors.firstName = 'Имя обязательно для заполнения';
    if (!formData.lastName)
      newErrors.lastName = 'Фамилия обязательна для заполнения';

    if (!formData.email) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }

    if (!formData.phone) {
      newErrors.phone = 'Телефон обязателен для заполнения';
    } else if (!/^[-\d\s() +]+$/.test(formData.phone)) {
      newErrors.phone =
        'Номер телефона может содержать только цифры и символы +, -, (, )';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    updateUser(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='rounded-lg border border-border-default bg-background-default p-6 shadow-sm'
    >
      <h2 className='mb-4 text-2xl font-bold text-text-heading'>
        Личные данные
      </h2>
      <div className='flex flex-col gap-4'>
        <div>
          <label
            htmlFor='firstName'
            className='mb-1 block text-sm font-medium text-text-default'
          >
            Имя
          </label>
          <Input
            id='firstName'
            name='firstName'
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? 'border-danger' : ''}
          />
          {errors.firstName && (
            <p className='mt-1 text-xs text-danger'>{errors.firstName}</p>
          )}
        </div>
        <div>
          <label
            htmlFor='lastName'
            className='mb-1 block text-sm font-medium text-text-default'
          >
            Фамилия
          </label>
          <Input
            id='lastName'
            name='lastName'
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? 'border-danger' : ''}
          />
          {errors.lastName && (
            <p className='mt-1 text-xs text-danger'>{errors.lastName}</p>
          )}
        </div>
        <div>
          <label
            htmlFor='phone'
            className='mb-1 block text-sm font-medium text-text-default'
          >
            Телефон
          </label>
          <Input
            id='phone'
            name='phone'
            type='tel'
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? 'border-danger' : ''}
          />
          {errors.phone && (
            <p className='mt-1 text-xs text-danger'>{errors.phone}</p>
          )}
        </div>
        <div>
          <label
            htmlFor='email'
            className='mb-1 block text-sm font-medium text-text-default'
          >
            E-mail
          </label>
          <Input
            id='email'
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'border-danger' : ''}
          />
          {errors.email && (
            <p className='mt-1 text-xs text-danger'>{errors.email}</p>
          )}
        </div>
      </div>
      <div className='mt-6 flex items-center gap-4'>
        <Button type='submit' variant='primary'>
          Сохранить изменения
        </Button>
        {isSaved && (
          <span className='text-success'>Данные успешно сохранены!</span>
        )}
      </div>
    </form>
  );
});
