import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/navLinks';
import DeviceLogo from '@/app/ui/diLogo';
import '@/app/ui/dashboard/sidenav.css';
//import Button from './button';
//import { signOut } from '../../auth';

const SideNav = () => {
  return (
    <div className='flex h-full flex-col px-3 py-4 md:px-2'>
      <Link
        className='mb-2 flex h-20 items-end justify-start rounded-md bg-black p-4 md:h-40'
        href='/'>
        <div className='w-32 text-white md:w-40'>
          <DeviceLogo />
        </div>
      </Link>
      <div className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
        <NavLinks />
        <div className='hidden h-auto w-full grow rounded-md bg-neutral-900 md:block'></div>
        {/*
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <Button />
        </form> 
        */}
      </div>
    </div>
  );
};

export default SideNav;