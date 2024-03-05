import { lusitana } from '@/app/ui/fonts';
import { CreateCustomer } from '@/app/ui/customers/buttons';
import Table from '@/app/ui/customers/table';
import { CustomersTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';

export default async function Page() {
    const rand = Math.floor(Math.random() * 100);
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <CreateCustomer />
            </div>
            <Suspense key={rand} fallback={<CustomersTableSkeleton />}>
                <Table />
            </Suspense>
        </div>
    );
}