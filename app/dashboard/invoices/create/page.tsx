import Form from '@/app/ui/invoices/createForm';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchCustomers } from '@/services/customers';
 
const Page = async () => {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
};

export default Page;