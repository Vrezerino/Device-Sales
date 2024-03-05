'use client';

import { Device, DevicesTable } from '@/app/lib/definitions';
import {
    CheckIcon,
    ComputerDesktopIcon,
    CpuChipIcon,
    CubeIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { modifyDevice } from '@/app/lib/actions';

export default function EditInvoiceForm({
    device
}: {
    device: DevicesTable;
}) {
    const updateDeviceWithId = modifyDevice.bind(null, device._id);
    return (
        <form action={updateDeviceWithId}>
            <input type="hidden" name="id" value={device._id} />
            <input type="hidden" name="deviceNumber" value={device.deviceNumber} />
            <div className="rounded-md bg-neutral-800 p-4 md:p-6">
                {/* Device Name */}
                <div className="mb-4">
                    <label htmlFor="deviceName" className="mb-2 block text-sm font-medium">
                        Device Name
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="deviceName"
                                name="deviceName"
                                type="string"
                                step="0.01"
                                defaultValue={device.deviceName}
                                placeholder='Device Name'
                                className="peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900 py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500"
                            />
                            <ComputerDesktopIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900" />
                        </div>
                    </div>
                </div>

                {/* Manufacturer */}
                <div className="mb-4">
                    <label htmlFor="deviceManufacturer" className="mb-2 block text-sm font-medium">
                        Manufacturer
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="deviceManufacturer"
                                name="deviceManufacturer"
                                type="string"
                                step="0.01"
                                defaultValue={device.deviceManufacturer}
                                placeholder='Manufacturer'
                                className="peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900 py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500"
                            />
                            <CpuChipIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900" />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label htmlFor="deviceDescription" className="mb-2 block text-sm font-medium">
                        Description
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="deviceDescription"
                                name="deviceDescription"
                                type="string"
                                step="0.01"
                                defaultValue={device.deviceDescription}
                                placeholder='Description'
                                className="peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900 py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500"
                            />
                            <CheckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900" />
                        </div>
                    </div>
                </div>

                {/* Image URL */}
                <div className="mb-4">
                    <label htmlFor="imageUrl" className="mb-2 block text-sm font-medium">
                        Image URL
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="imageUrl"
                                name="imageUrl"
                                type="string"
                                step="0.01"
                                defaultValue={device.imageUrl}
                                placeholder='Image URL'
                                className="peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900 py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500"
                            />
                            <PhotoIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900" />
                        </div>
                    </div>
                </div>

                {/* Device Amount */}
                <div className="mb-4">
                    <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                        Amount
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                defaultValue={device.amount}
                                placeholder="Enter integer value"
                                className="peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900 py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500"
                            />
                            <CubeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/devices"
                    className="flex h-10 items-center rounded-lg bg-neutral-100 px-4 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Edit Device</Button>
            </div>
        </form>
    );
}
