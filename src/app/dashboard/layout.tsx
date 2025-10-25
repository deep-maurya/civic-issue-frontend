import ProtectedLayout from '@/components/common/Protected-route';
import ReduxProvider from '@/redux/ReduxProvider';
import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return <ReduxProvider>
        <ProtectedLayout>
          {children}
        </ProtectedLayout>
      </ReduxProvider>;
};

export default layout;
