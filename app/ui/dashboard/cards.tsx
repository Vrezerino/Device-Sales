'use client';

import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';

import { lusitana } from '@/app/ui/fonts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setCardsData } from '@/redux/features/cardsSlice';

import { fetchCardData } from '@/services/cards';
import { isErrorWithStatusCodeType } from '@/app/lib/utils';

import { useEffect } from 'react';
import toast from 'react-hot-toast';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

const CardWrapper = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cardsData = useSelector(
    (state: RootState) => state.cardsReducer.cardsData
  );

  const fetchData = async () => {
    const data = await fetchCardData();

    if (isErrorWithStatusCodeType(data)) {
      toast.error(data.error);
    } else {
      dispatch(setCardsData(data));
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <>
      <Card title='Collected' value={cardsData.totalPaidInvoices || 0} type='collected' />
      <Card title='Pending' value={cardsData.totalPendingInvoices || 0} type='pending' />
      <Card title='Total Invoices' value={cardsData.numberOfInvoices || 0} type='invoices' />
      <Card
        title='Total Customers'
        value={cardsData.numberOfCustomers || 0}
        type='customers'
      />
    </>
  );
};

export const Card = ({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) => {
  const Icon = iconMap[type];

  return (
    <div className='rounded-xl bg-neutral-800 p-2 shadow-sm'>
      <div className='flex p-4'>
        {Icon ? <Icon className='h-5 w-5 text-neutral-700' /> : null}
        <h3 className='ml-2 text-sm font-medium'>{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-neutral-900 px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
};

export default CardWrapper;