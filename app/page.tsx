import DeviceLogo from '@/app/ui/diLogo';
import { lusitana } from './ui/fonts';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const Page = () => {
  return (
    <main className='flex min-h-screen flex-col p-6'>
      <div className='flex h-20 shrink-0 items-end rounded-lg bg-black p-4 md:h-52'>
        <DeviceLogo />
      </div>
      <div className='mt-4 flex grow flex-col gap-4 md:flex-row'>
        <div className='flex flex-col justify-center gap-6 rounded-lg bg-neutral-900 px-6 py-10 md:w-2/5 md:px-20'>
          <h2 className={`${lusitana.className} antialiased`}>
            Welcome to Device Sales.
          </h2>
          <Link
            href='/login'
            className='flex items-center gap-5 self-start rounded-lg bg-neutral-900 px-6 py-3 border border-orange-200/30 text-sm font-medium text-white transition-colors hover:bg-neutral-800 md:text-base'
          >
            <span>Log in</span> <ArrowRightIcon className='w-5 md:w-6' />
          </Link>
        </div>
        <div className='flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12'>
        </div>
      </div>
    </main>
  );
};

export default Page;