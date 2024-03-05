import Form from '@/app/ui/devices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { getDeviceByNumber } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { deviceNumber: string } }) {
    const num = params.deviceNumber;
    const device = await getDeviceByNumber(num);

    // Redirect to 404 page if invoice not found.
    if (!device) notFound();
    
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard/devices' },
                    {
                        label: 'Edit Invoice',
                        href: `/dashboard/devices/${num}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form device={device} />
        </main>
    );
}