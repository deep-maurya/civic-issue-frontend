import ProtectedLayout from '@/components/common/Protected-route';
import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return <ProtectedLayout>
          {children}
        </ProtectedLayout>;
};

export default layout;
