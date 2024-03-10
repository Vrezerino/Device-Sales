import Form from '@/app/ui/devices/createForm';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
 
export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Devices', href: '/dashboard/devices' },
          {
            label: 'Create Device',
            href: '/dashboard/devices/create',
            active: true,
          },
        ]}
      />
      <Form  />
    </main>
  );
}