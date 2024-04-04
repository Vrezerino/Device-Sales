import CustomerCard from './card';

const Page = ({ params }: { params: { id: string } }) => {
    return (
        <CustomerCard params={params} />
    );
}

export default Page;