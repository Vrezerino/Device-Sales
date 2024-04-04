'use client';

import { CustomersTableType } from '@/app/lib/definitions';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

const CustomerCard = ({ customerId }: { customerId: string }) => {
    const customers: CustomersTableType[] = useSelector(
        (state: RootState) => state.customerReducer.customerWithInvoiceInfoList
      );

    const customer = customers?.find((c) => c._id === customerId);

    return (
        <div className='max-w-sm w-full lg:max-w-full lg:flex'>
            <div className='h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden' style={{ backgroundImage: `url(${customer?.imageUrl})` }} title='Customer image'>
            </div>
            <div className='border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal'>
                <div className='mb-8'>
                    <div className='text-gray-900 font-bold text-xl mb-2'>{customer?.name}</div>
                    <ol className='text-gray-600 text-base'>
                        <li>{customer?.email}</li>
                        <li>{customer?.company}</li>
                        <li>Invoices: {customer?.totalInvoices}</li>
                        <li>Paid: {customer?.totalPaid}</li>
                        <li>Pending: {customer?.totalPending}</li>
                    </ol>
                </div>
                <div className='flex items-center'>
                    <div className='text-sm'>
                        <p className='text-amber-400 leading-none'></p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CustomerCard;