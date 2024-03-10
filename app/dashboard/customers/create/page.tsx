import Form from '@/app/ui/customers/createForm';
// Can be re-used from Invoices:
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
 
export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: 'Create Customer',
            href: '/dashboard/customers/create',
            active: true,
          },
        ]}
      />
      <Form  />
    </main>
  );
}