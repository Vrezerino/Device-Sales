'use client';

import { setCustomersWithInvoiceInfo } from '@/redux/features/customerSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';

import { getCustomer } from '@/services/customers';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { CardSkeleton } from '../skeletons';
import { formatCurrency } from '@/app/lib/utils';

const CustomerCard = ({ params }: { params: { id: string } }) => {
    const dispatch = useDispatch<AppDispatch>();
    const customers = useSelector(
        (state: RootState) => state.customerReducer.customerWithInvoiceInfoList
    );

    const customer = customers?.find((c) => c._id === params.id);

    /**
     * If customer is not in store for example because you refreshed the single customer view,
     * fetch the customer by id and dispatch this single customer to store
     */
    const fetchAndSetSingleCustomer = async () => {
        if (!customer) {
            const data = await getCustomer(params.id);

            if (!data.error) {
                dispatch(setCustomersWithInvoiceInfo([data]));
            } else {
                toast.error(data.error);
            }
        }
    };

    useEffect(() => {
        fetchAndSetSingleCustomer();
    }, [])

    if (!customer) return(<><CardSkeleton /></>)
    
    return (
        <div className='max-w-sm w-full lg:max-w-full lg:flex'>
            <div className='h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden' style={{ backgroundImage: `url(${customer?.imageUrl})` }} title='Customer image'>
            </div>
            <div className='border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal'>
                <div className='mb-8'>
                    <div className='text-gray-900 font-bold text-xl mb-2'>{customer?.name}</div>
                    <ol className='text-gray-600 text-base'>
                        <li className='text-gray-400 text-sm'>{customer?.email}</li>
                        <li  className='text-gray-400 text-sm'>{customer?.company}</li>
                        <br />
                        <li>Invoices: {customer?.totalInvoices || 0}</li>
                        <li>Paid: {formatCurrency(customer?.totalPaid)}</li>
                        <li>Pending: {formatCurrency(customer?.totalPending)}</li>
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