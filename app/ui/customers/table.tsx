'use client';
import Image from 'next/image';
import { DeleteCustomer, UpdateCustomer } from '@/app/ui/customers/buttons';
import {
  CustomersTableType
} from '@/app/lib/definitions';
import { fetchFilteredCustomers } from '@/services/customers';
import { formatCurrency } from '@/app/lib/utils';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setCustomersWithInvoiceInfo } from '@/redux/features/customerSlice';
import { useEffect } from 'react';

export default function CustomersTable({
  query,
}: {
  query: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const customers: CustomersTableType[] = useSelector(
    (state: RootState) => state.customerReducer.customerWithInvoiceInfoList
  );

  const fetchAndSetCustomers = async () => {
    const data = await fetchFilteredCustomers(query);
    dispatch(setCustomersWithInvoiceInfo(data));
  };

  useEffect(() => {
    fetchAndSetCustomers();
  }, []);

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-neutral-800 p-2 md:pt-0">
              <div className="md:hidden">
                {customers?.map((customer) => (
                  <div
                    key={customer._id}
                    className="mb-2 w-full rounded-md bg-neutral-700 p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <Image
                              src={customer.image_url || '/img/customers/___blankProfile.jpg'}
                              className="rounded-full"
                              alt={`${customer.name}'s profile picture`}
                              width={28}
                              height={28}
                            />
                            <p>{customer.name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-200">
                          {customer.email}
                        </p>
                        <p className="text-sm text-neutral-400">
                          {customer.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Pending</p>
                        <p className="font-medium">{customer.totalPending}</p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Paid</p>
                        <p className="font-medium">{customer.totalPaid}</p>
                      </div>
                    </div>
                    <div className="pt-4 text-sm">
                      <p>{customer.totalInvoices} invoices</p>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gold md:table">
                <thead className="rounded-md text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Company
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Invoices
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Pending
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Total Paid
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-neutral-700">
                  {customers.map((customer) => (
                    <tr key={customer._id} className="w-full border-orange-200/10 border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={customer.image_url || '/img/customers/___blankProfile.jpg'}
                            className="rounded-full"
                            alt={`${customer.name}'s profile picture`}
                            width={90}
                            height={90}
                          />
                          <p>{customer.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {customer.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {customer.company}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {customer.totalInvoices}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {formatCurrency(customer.totalPaid)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {formatCurrency(customer.totalPaid)}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateCustomer id={customer._id} />
                          <DeleteCustomer id={customer._id} name={customer.name} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
