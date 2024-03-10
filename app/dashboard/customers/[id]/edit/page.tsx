import Form from '@/app/ui/customers/editForm';
// Can be re-used from Invoices:
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { getCustomer } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
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
}