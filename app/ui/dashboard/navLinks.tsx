'use client';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { 
    name: 'Home', 
    href: '/dashboard', 
    icon: HomeIcon
  },
  { 
    name: 'Customers',
    href: '/dashboard/customers',
    icon: UserGroupIcon
  },
  {
    name: 'Devices',
    href: '/dashboard/devices',
    icon: ComputerDesktopIcon,
  },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
];

const NavLinks = () => {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-neutral-900 p-3 border border-orange-200/30 text-sm font-medium hover:bg-neutral-800 hover:text-gold md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-neutral-600 text-gold': pathname === link.href,
              },
            )}
          >
            <LinkIcon className='w-6' />
            <p className='hidden md:block'>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;