import CustomerCard from './card';

const Page = ({
    customerId
}: {
    customerId: string;
}) => {
    return (
        <CustomerCard customerId={customerId} />
    );
}

export default Page;