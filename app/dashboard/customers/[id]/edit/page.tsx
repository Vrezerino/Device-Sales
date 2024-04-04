import Form from '@/app/ui/customers/editForm';
// Can be re-used from Invoices:
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { getCustomer } from '@/services/customers';
import { notFound } from 'next/navigation';

const Page = async ({ params }: { params: { id: string } }) => {
    const id = params.id;
    const customer = await getCustomer(id);

    // Redirect to 404 page if customer not found.
    if (!customer) notFound();
    
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Customers', href: '/dashboard/customers' },
                    {
                        label: 'Edit Customer',
                        href: `/dashboard/customers/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form customer={customer} />
        </main>
    );
};

export default Page;