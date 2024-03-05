'use client';

import { CustomerField, Device } from '@/app/lib/definitions';
import {
    CheckIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

export default function EditInvoiceForm({
    device
}: {
    device: Device;
}) {
    return (
        <form>
            <div className="rounded-md bg-neutral-800 p-4 md:p-6">
                {/* Device Name */}
                <div className="mb-4">
                    <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        Device
                    </label>
                    <div className="relative">
                        <select
                            id="customer"
                            name="customerId"
                            className="peer block w-full cursor-pointer rounded-md border border-neutral-200/30 bg-neutral-900 py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500"
                            defaultValue={device.deviceName}
                        >
                            <option value="" disabled>
                                Select device
                            </option>

                            <option key={device.deviceNumber} value={device.deviceNumber}>
                                {device.deviceName}
                            </option>

                        </select>
                        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500" />
                    </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                        Enter manufacturer
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="deviceManufacturer"
                                name="deviceManufacturer"
                                type="string"
                                step="0.01"
                                defaultValue={device.deviceDescription}
                                placeholder={device.deviceDescription}
                                className="peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900 py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500"
                            />
                            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/invoices"
                    className="flex h-10 items-center rounded-lg bg-neutral-100 px-4 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Edit Invoice</Button>
            </div>
        </form>
    );
}
