import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/services/cards';
import toast from 'react-hot-toast';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {
  const data = await fetchCardData();
  data?.error && toast.error('Failed to fetch card data!');
  
  const numberOfInvoices = data?.numberOfInvoices;
  const numberOfCustomers = data?.numberOfCustomers;
  const totalPaidInvoices = data?.totalPaidInvoices;
  const totalPendingInvoices = data?.totalPendingInvoices;
  return (
    <>
      <Card title='Collected' value={totalPaidInvoices || 0} type='collected' />
      <Card title='Pending' value={totalPendingInvoices || 0} type='pending' />
      <Card title='Total Invoices' value={numberOfInvoices || 0} type='invoices' />
      <Card
        title='Total Customers'
        value={numberOfCustomers || 0}
        type='customers'
      />
    </>
  );
};

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
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
