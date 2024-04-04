'use client';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { formatCurrency } from '@/app/lib/utils';
import { toast } from 'react-hot-toast';

import { InvoicesTable } from '@/app/lib/definitions';
import { deleteInvoice } from '@/services/invoices';

export const CreateInvoice = () => {
  return (
    <Link
      href='/dashboard/invoices/create'
      className='flex h-10 items-center rounded-lg bg-amber-500 px-4 text-sm font-medium text-white transition-colors hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
    >
      <span className='hidden md:block'>Create Invoice</span>{' '}
      <PlusIcon className='h-5 md:ml-4' />
    </Link>
  );
};

export const UpdateInvoice = ({ id }: { id: string }) => {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className='rounded-md border border-orange-200/20 p-2 hover:bg-amber-500'>
      <PencilIcon className='w-5' />
    </Link>
  );
};

export const DeleteInvoice = ({ invoice }: { invoice: InvoicesTable }) => {
  const deleteInvoiceWithId = async () => {
    const amount = formatCurrency(invoice.amountInCents);

    if (window.confirm(`Really delete ${invoice.name}, ${invoice.date}, ${amount}?`)) {
      const result = await deleteInvoice(invoice._id);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Invoice removed!');
      }
    }
  }
  return (
    <form action={deleteInvoiceWithId}>
      <button className='rounded-md border border-orange-200/20 p-2 hover:bg-red-600'>
        <span className='sr-only'>Delete</span>
        <TrashIcon className='w-5' />
      </button>
    </form>
  );
};
