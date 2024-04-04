import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

import { getDeviceById } from '@/services/devices';
import { DevicesTable } from '@/app/lib/definitions';

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Breadcrumbs from '@/app/ui/breadcrumbs';
import Page from '@/app/ui/devices/page';
import Button from '@/app/ui/button';

export const metadata: Metadata = {
    title: 'Devices',
};

const DevicePage = async ({ params }: { params: { id: string } }) => {
    const deviceId = params.id;
    const device: DevicesTable = await getDeviceById(deviceId);

    // Redirect to 404 page if device not found.
    if (!device) notFound();
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Devices', href: '/dashboard/devices' },
                    {
                        label: 'Single Device View',
                        href: `/dashboard/devices/${deviceId}`,
                        active: true,
                    },
                ]}
            />
            <Page device={device} />
            <Link href='/dashboard/devices'><Button style={{ marginTop: '7px' }}>🔙 Return</Button></Link>
        </main>
    )
}
export default DevicePage;