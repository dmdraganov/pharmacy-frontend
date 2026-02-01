import { memo, useState } from 'react';
import { CurrentOrder } from '@/widgets/CurrentOrder';
import { OrderHistory } from '@/widgets/OrderHistory';
import { ProfileDetails } from '@/widgets/ProfileDetails';
import { AccountSidebar } from '@/widgets/AccountSidebar';

export type AccountPageView = 'orders' | 'profile';

const AccountPage = memo(() => {
  const [activeView, setActiveView] = useState<AccountPageView>('orders');

  return (
    <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
      <div className='md:col-span-1'>
        <AccountSidebar activeView={activeView} setActiveView={setActiveView} />
      </div>
      <main className='flex flex-col gap-8 md:col-span-3'>
        {activeView === 'orders' && (
          <>
            <CurrentOrder />
            <OrderHistory />
          </>
        )}
        {activeView === 'profile' && <ProfileDetails />}
      </main>
    </div>
  );
});

export default AccountPage;
