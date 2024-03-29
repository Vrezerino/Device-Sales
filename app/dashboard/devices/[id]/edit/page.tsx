import Form from '@/app/ui/devices/editForm';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { getDeviceById } from '@/services/devices';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const deviceId = params.id;
    const device = await getDeviceById(deviceId);

    // Redirect to 404 page if invoice not found.
    if (!device) notFound();
    
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Devices', href: '/dashboard/devices' },
                    {
                        label: 'Edit Device',
                        href: `/dashboard/devices/${deviceId}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form device={device} />
        </main>
    );
};