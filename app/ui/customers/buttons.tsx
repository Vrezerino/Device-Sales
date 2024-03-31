'use client';

import { deleteCustomer } from '@/services/customers';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export function CreateCustomer() {
  return (
    <Link
      href="/dashboard/customers/create"
      className="flex h-10 items-center rounded-lg bg-amber-500 px-4 text-sm font-medium text-white transition-colors hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Customer</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
};

export function UpdateCustomer({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/customers/${id}/edit`}
      className="rounded-md border border-orange-200/20 p-2 hover:bg-amber-500"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
};

export function DeleteCustomer({ id, name }: { id: string, name: string }) {
  const deleteCustomerWithId = async () => {
    if (window.confirm(`Really delete ${name}?`)) {
      const result = await deleteCustomer(id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Customer removed!');
      }
    }
  };
  return (
    <form action={deleteCustomerWithId}>
      <button className="rounded-md border border-orange-200/20 p-2 hover:bg-red-600">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
};
