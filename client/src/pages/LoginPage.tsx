import { memo, useState, type SubmitEvent } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import { BASE_URL } from '@/shared/config/constants';

const LoginPage = memo(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || BASE_URL;

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Неверный email или пароль.');
      console.error(err);
    }
  };

  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-text-default'>
          Войдите в свой аккаунт
        </h2>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <form className='space-y-6' onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium leading-6 text-text-default'
            >
              Email
            </label>
            <div className='mt-2'>
              <Input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='password'
                className='block text-sm font-medium leading-6 text-text-default'
              >
                Пароль
              </label>
            </div>
            <div className='mt-2'>
              <Input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className='text-sm text-danger'>{error}</p>}

          <div>
            <Button type='submit' className='w-full'>
              Войти
            </Button>
          </div>
        </form>

        <p className='mt-10 text-center text-sm text-text-muted'>
          Нет аккаунта?{' '}
          <Link
            to='/register'
            className='font-semibold leading-6 text-primary hover:text-primary-hover'
          >
            Зарегистрируйтесь
          </Link>
        </p>
      </div>
    </div>
  );
});

export default LoginPage;
