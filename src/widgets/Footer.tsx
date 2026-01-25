import { memo } from 'react';

const Footer = memo(() => {
  return (
    <footer className='border-t'>
      <div className='container mx-auto p-4 text-center text-gray-500'>
        <p>© 2026 Pharmacy. Учебный проект.</p>
      </div>
    </footer>
  );
});

export default Footer;
