import Image from 'next/image';
import { UpdateDevice, DeleteDevice } from '@/app/ui/devices/buttons';
import { fetchDevices } from '@/app/lib/data';
import { DevicesTable } from '@/app/lib/definitions';

export default async function InvoicesTable() {
  const devices: DevicesTable[] = await fetchDevices();

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-neutral-800 p-2 md:pt-0">
          <div className="md:hidden">
            {devices?.map((device) => (
              <div
                key={device._id}
                className="mb-2 w-full rounded-md bg-neutral-700 p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={device.imageUrl}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${device.deviceName}'s profile picture`}
                      />
                      <p>{device.deviceName}</p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {device.deviceManufacturer}
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-medium">
                      {device.amount}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateDevice id={device._id} />
                    <DeleteDevice id={device._id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gold md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Device Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Manufacturer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Number
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-neutral-700">
              {devices?.map((device) => (
                <tr
                  key={device._id}
                  className="w-full border-orange-200/10 border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={device.imageUrl}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${device.deviceName}'s profile picture`}
                      />
                      <p>{device.deviceName}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {device.deviceManufacturer}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {device.deviceNumber}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {device.amount}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateDevice id={device._id} />
                      <DeleteDevice id={device._id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
