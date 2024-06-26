import Form from '@/app/ui/invoices/editForm';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchCustomers } from '@/services/customers';
import { fetchInvoiceById } from '@/services/invoices';
import { notFound } from 'next/navigation';

const Page = async ({ params }: { params: { id: string } }) => {
    const id = params.id;
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
    ]);

    // Redirect to 404 page if invoice not found.
    if (!invoice) notFound();
    
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    {
                        label: 'Edit Invoice',
                        href: `/dashboard/invoices/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form invoice={invoice} customers={customers} />
        </main>
    );
};

export default Page;