import { DevicesTable } from '@/app/lib/definitions';
import DeviceCard from './card';

const Page = ({
    device
}: {
    device: DevicesTable;
}) => {
    return (
        <DeviceCard device={device} />
    );
}

export default Page;