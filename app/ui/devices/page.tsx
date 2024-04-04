import DeviceCard from './card';

const Page = ({ params }: { params: { id: string } }) => {
    return (
        <DeviceCard params={params} />
    );
}

export default Page;