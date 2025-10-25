'use client';
import ReduxProvider from '@/redux/ReduxProvider';
import { GalleryVerticalEnd } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.includes('not-found')) {
    return <>{children}</>;
  }

  return (
    <ReduxProvider>
    <div className="grid min-h-svh lg:grid-cols-6">
      <div className="bg-muted relative hidden lg:block col-span-4">
        <Image
          src="/bg.jpg"
          alt="Image"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full "
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10 lg:col-span-2">
        <div className="flex justify-center items-center gap-2">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
    </div>
    </ReduxProvider>
  );
}
