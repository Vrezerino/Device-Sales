import Form from '@/app/ui/customers/createForm';
import Breadcrumbs from '@/app/ui/breadcrumbs';
 
const Page = () => {
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
};

export default Page;