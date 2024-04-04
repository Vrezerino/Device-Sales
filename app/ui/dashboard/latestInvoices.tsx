import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { fetchLatestInvoices } from '@/services/invoices';
import { LatestInvoice } from '@/app/lib/definitions';
import { formatCurrency } from '@/app/lib/utils';

const LatestInvoices = async () => {
  const latestInvoices: LatestInvoice[] = await fetchLatestInvoices();
  return (
    <div className='flex w-full flex-col md:col-span-4'>
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Latest Invoices
      </h2>
      <div className='flex grow flex-col justify-between rounded-xl bg-neutral-800 p-4'>
        {/* NOTE: comment in this code when you get to this point in the course */}

        <div className='bg-neutral-800 px-6'>
          {latestInvoices?.map((invoice, i) => {
            return (
              <div
                key={invoice.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className='flex items-center'>
                  <Image
                    src={invoice.imageUrl || '/img/customers/___blankProfile.jpg'}
                    alt={`${invoice.name}'s profile picture`}
                    className='mr-4 rounded-full'
                    width={32}
                    height={32}
                  />
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-semibold md:text-base'>
                      {invoice.name}
                    </p>
                    <p className='hidden text-sm text-neutral-500 sm:block'>
                      {invoice.email}
                    </p>
                  </div>
                </div>
                <p
                  className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                >
                  {formatCurrency(Number(invoice.amountInCents))}
                </p>
              </div>
            );
          })}
        </div>
        <div className='flex items-center pb-2 pt-6'>
          <ArrowPathIcon className='h-5 w-5 text-neutral-500' />
          <h3 className='ml-2 text-sm text-neutral-500 '>Updated just now</h3>
        </div>
      </div>
    </div>
  );
};

export default LatestInvoices;