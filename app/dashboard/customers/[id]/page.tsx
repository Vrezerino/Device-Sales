import { CustomersTableType } from '@/app/lib/definitions';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Button from '@/app/ui/button';
import Page from '@/app/ui/customers/page';
import { getCustomer } from '@/services/customers';
import Link from 'next/link';

import { notFound } from 'next/navigation';


const CustomerPage = async ({ params }: { params: { id: string } }) => {
    const customerId = params.id;
    const customer: CustomersTableType = await getCustomer(customerId);

    // Redirect to 404 page if customer not found.
    if (!customer) notFound();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Customers', href: '/dashboard/customers' },
                    {
                        label: 'Single Customer View',
                        href: `/dashboard/customers/${customerId}`,
                        active: true,
                    },
                ]}
            />
            <Page customerId={customerId} />
            <Link href='/dashboard/customers'><Button style={{ marginTop: '7px' }}>🔙 Return</Button></Link>
        </main>
    )
};

export default CustomerPage;