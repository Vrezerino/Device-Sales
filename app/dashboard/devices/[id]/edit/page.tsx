import Form from '@/app/ui/devices/editForm';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { getDeviceById } from '@/services/devices';
import { notFound } from 'next/navigation';

const Page = async ({ params }: { params: { id: string } }) => {
    const deviceId = params.id;
    const device = await getDeviceById(deviceId);

    // Redirect to 404 page if device not found.
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

export default Page;