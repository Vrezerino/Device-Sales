'use client';

import { CustomerField, InvoiceForm } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Button from '@/app/ui/button';
import { updateInvoice } from '@/services/invoices';
import toast from 'react-hot-toast';

const EditInvoiceForm = ({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) => {
  const update = async (formData: FormData) => {
    const result = await updateInvoice(invoice._id, formData);
    if (result?.error) {
        toast.error(result.error);
    } else {
        toast.success('Invoice edited!');
    }
};
  return (
    <form action={update}>
      <input type='hidden' name='id' value={invoice._id} />
      <div className='rounded-md bg-neutral-800 p-4 md:p-6'>
        {/* Customer Name */}
        <div className='mb-4'>
          <label htmlFor='customer' className='mb-2 block text-sm font-medium'>
            Customer
          </label>
          <div className='relative'>
            <span
              id={invoice.customerId}
              className='peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900 py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500'
            >
              {customers?.find((c) => c._id === invoice?.customerId)?.name}
            </span>
            <UserCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500' />
          </div>
        </div>

        {/* Invoice Amount */}
        <div className='mb-4'>
          <label htmlFor='amount' className='mb-2 block text-sm font-medium'>
            Choose an amount
          </label>
          <div className='relative mt-2 rounded-md'>
            <div className='relative'>
              <input
                id='amount'
                name='amount'
                type='number'
                step='0.01'
                defaultValue={invoice.amount}
                placeholder='Enter USD amount'
                className='peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900 py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500'
                required
              />
              <CurrencyDollarIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900' />
            </div>
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className='mb-2 block text-sm font-medium'>
            Set the invoice status
          </legend>
          <div className='rounded-md border border-neutral-200/30 bg-neutral-900 px-[14px] py-3'>
            <div className='flex gap-4'>
              <div className='flex items-center'>
                <input
                  id='pending'
                  name='status'
                  type='radio'
                  value='pending'
                  defaultChecked={invoice.status === 'pending'}
                  className='h-4 w-4 cursor-pointer border-neutral-200/30 bg-neutral-100 text-neutral-600 focus:ring-2'
                  required
                />
                <label
                  htmlFor='pending'
                  className='ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600'
                >
                  Pending <ClockIcon className='h-4 w-4' />
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  id='paid'
                  name='status'
                  type='radio'
                  value='paid'
                  defaultChecked={invoice.status === 'paid'}
                  className='h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2'
                  required
                />
                <label
                  htmlFor='paid'
                  className='ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white'
                >
                  Paid <CheckIcon className='h-4 w-4' />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className='mt-6 flex justify-end gap-4'>
        <Link
          href='/dashboard/invoices'
          className='flex h-10 items-center rounded-lg bg-neutral-100 px-4 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200'
        >
          Cancel
        </Link>
        <Button type='submit'>Edit Invoice</Button>
      </div>
    </form>
  );
};

export default EditInvoiceForm;