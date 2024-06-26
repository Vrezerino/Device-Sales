'use client';

import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredInvoices } from '@/services/invoices';
import { InvoicesTable as InvoicesTableType } from '@/app/lib/definitions';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setInvoices } from '@/redux/features/invoiceSlice';
import { useEffect } from 'react';
import { InvoicesTableSkeleton } from '../skeletons';

const InvoicesTable = ({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const fetchAndSetInvoices = async () => {
    const data = await fetchFilteredInvoices(query, currentPage);
    if (data.error) console.log(data.error);
    dispatch(setInvoices(data));
  };

  const invoices: InvoicesTableType[] = useSelector(
    (state: RootState) => state.invoiceReducer.invoiceList
  );

  useEffect(() => {
    fetchAndSetInvoices();
  }, []);

  if (!invoices) return <InvoicesTableSkeleton />
  
  return (
    <div className='mt-6 flow-root'>
      <div className='inline-block min-w-full align-middle'>
        <div className='rounded-lg bg-neutral-800 p-2 md:pt-0'>
          <div className='md:hidden'>
            {invoices?.map((invoice) => (
              <div
                key={invoice._id}
                className='mb-2 w-full rounded-md bg-neutral-700 p-4'
              >
                <div className='flex items-center justify-between border-b pb-4'>
                  <div>
                    <div className='mb-2 flex items-center'>
                      <Image
                        src={invoice.imageUrl || '/img/customers/___blankProfile.jpg'}
                        className='mr-2 rounded-full'
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                    <p className='text-sm text-neutral-500'>{invoice.email}</p>
                  </div>
                  <InvoiceStatus status={invoice.status} />
                </div>
                <div className='flex w-full items-center justify-between pt-4'>
                  <div>
                    <p className='text-xl font-medium'>
                      {formatCurrency(invoice.amountInCents)}
                    </p>
                    <p>{formatDateToLocal(invoice.date)}</p>
                  </div>
                  <div className='flex justify-end gap-2'>
                    <UpdateInvoice id={invoice._id} />
                    <DeleteInvoice invoice={invoice} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className='hidden min-w-full text-gold md:table'>
            <thead className='rounded-lg text-left text-sm font-normal'>
              <tr>
                <th scope='col' className='px-4 py-5 font-medium sm:pl-6'>
                  Customer
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  Email
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  Amount
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  Date
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  Status
                </th>
                <th scope='col' className='relative py-3 pl-6 pr-3'>
                  <span className='sr-only'>Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className='bg-neutral-700'>
              {invoices?.map((invoice) => (
                <tr
                  key={invoice._id}
                  className='w-full border-orange-200/10 border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg'
                >
                  <td className='whitespace-nowrap py-3 pl-6 pr-3'>
                    <div className='flex items-center gap-3'>
                      <Image
                        src={invoice.imageUrl || '/img/customers/___blankProfile.jpg'}
                        className='rounded-full'
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                  </td>
                  <td className='whitespace-nowrap px-3 py-3'>
                    {invoice.email}
                  </td>
                  <td className='whitespace-nowrap px-3 py-3'>
                    {formatCurrency(invoice.amountInCents)}
                  </td>
                  <td className='whitespace-nowrap px-3 py-3'>
                    {formatDateToLocal(invoice.date)}
                  </td>
                  <td className='whitespace-nowrap px-3 py-3'>
                    <InvoiceStatus status={invoice.status} />
                  </td>
                  <td className='whitespace-nowrap py-3 pl-6 pr-3'>
                    <div className='flex justify-end gap-3'>
                      <UpdateInvoice id={invoice._id} />
                      <DeleteInvoice invoice={invoice} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesTable;