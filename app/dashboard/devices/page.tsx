import { lusitana } from '@/app/ui/fonts';
import { CreateDevice } from '@/app/ui/devices/buttons';
import Table from '@/app/ui/devices/table';
import { DevicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Devices',
};

const Page = () => {
    const rand = Math.floor(Math.random() * 100);

    return (
        <div className='w-full'>
            <div className='flex w-full items-center justify-between'>
                <h1 className={`${lusitana.className} text-2xl`}>Devices</h1>
            </div>
            <div className='mt-4 flex items-center justify-between gap-2 md:mt-8'>
                <CreateDevice />
            </div>
            <Suspense key={rand} fallback={<DevicesTableSkeleton />}>
                <Table />
            </Suspense>
        </div>
    );
};

export default Page;