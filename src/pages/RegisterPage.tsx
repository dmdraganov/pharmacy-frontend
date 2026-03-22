import { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';

const RegisterPage = memo(() => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.password) {
      setError('Пароль не может быть пустым');
      return;
    }
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
      console.error(err);
    }
  };

  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-text-default'>
          Создайте аккаунт
        </h2>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <form className='space-y-6' onSubmit={handleSubmit}>
          <div className='grid grid-cols-2 gap-4'>
            <Input
              name='firstName'
              placeholder='Имя'
              required
              value={formData.firstName}
              onChange={handleChange}
            />
            <Input
              name='lastName'
              placeholder='Фамилия'
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <Input
            name='email'
            type='email'
            placeholder='Email'
            required
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            name='phone'
            type='tel'
            placeholder='Телефон'
            required
            value={formData.phone}
            onChange={handleChange}
          />
          <Input
            name='password'
            type='password'
            placeholder='Пароль'
            required
            value={formData.password}
            onChange={handleChange}
          />

          {error && <p className='text-sm text-danger'>{error}</p>}

          <div>
            <Button type='submit' className='w-full'>
              Зарегистрироваться
            </Button>
          </div>
        </form>

        <p className='mt-10 text-center text-sm text-text-muted'>
          Уже есть аккаунт?{' '}
          <Link
            to='/login'
            className='font-semibold leading-6 text-primary hover:text-primary-hover'
          >
            Войдите
          </Link>
        </p>
      </div>
    </div>
  );
});

export default RegisterPage;
