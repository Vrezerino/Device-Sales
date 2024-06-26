'use client';

import Link from 'next/link';
import {
    CheckIcon,
    ComputerDesktopIcon,
    CpuChipIcon,
    CubeIcon,
    DocumentTextIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';
import Button from '@/app/ui/button';
import { postDevice } from '@/services/devices';
import { toast } from 'react-hot-toast';

const Form = () => {
    const post = async (formData: FormData) => {
        const result = await postDevice(formData);
        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success('Device added!');
        }
    };
    return (
        <form action={post}>
            <div className='rounded-md bg-neutral-800 p-4 md:p-6'>
                {/* Device Name */}
                <div className='mb-4'>
                    <label htmlFor='deviceName' className='mb-2 block text-sm font-medium'>
                        Device Name
                    </label>
                    <div className='relative mt-2 rounded-md'>
                        <div className='relative'>
                            <input
                                id='deviceName'
                                name='deviceName'
                                type='string'
                                step='0.01'
                                placeholder='Device Name (min 5, max 50 characters)'
                                className='peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900  py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500'
                                required
                            />
                            <ComputerDesktopIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900' />

                        </div>
                    </div>
                </div>


                {/* Device Manufacturer */}
                <div className='mb-4'>
                    <label htmlFor='deviceManufacturer' className='mb-2 block text-sm font-medium'>
                        Manufacturer
                    </label>
                    <div className='relative mt-2 rounded-md'>
                        <div className='relative'>
                            <input
                                id='deviceManufacturer'
                                name='deviceManufacturer'
                                type='string'
                                step='0.01'
                                placeholder='Manufacturer (min 1, max 50 characters)'
                                className='peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900  py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500'
                                required
                            />
                            <CpuChipIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900' />
                        </div>
                    </div>
                </div>


                {/* Device Description */}
                <div className='mb-4'>
                    <label htmlFor='deviceDescription' className='mb-2 block text-sm font-medium'>
                        Device Description
                    </label>
                    <div className='relative mt-2 rounded-md'>
                        <div className='relative'>
                            <input
                                id='deviceDescription'
                                name='deviceDescription'
                                type='string'
                                step='0.01'
                                placeholder='Device Description (min 1, max 1000 characters)'
                                className='peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900  py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500'
                                required
                            />
                            <CheckIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900' />
                        </div>
                    </div>
                </div>

                {/* Device Number */}
                <div className='mb-4'>
                    <label htmlFor='deviceNumber' className='mb-2 block text-sm font-medium'>
                        Device Number
                    </label>
                    <div className='relative mt-2 rounded-md'>
                        <div className='relative'>
                            <input
                                id='deviceNumber'
                                name='deviceNumber'
                                type='string'
                                step='0.01'
                                placeholder='Device Number (min 1, max 50 characters)'
                                className='peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900  py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500'
                                required
                            />
                            <DocumentTextIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900' />
                        </div>
                    </div>
                </div>

                {/* Amount in Store */}
                <div className='mb-4'>
                    <label htmlFor='amount' className='mb-2 block text-sm font-medium'>
                        Choose an amount
                    </label>
                    <div className='relative mt-2 rounded-md'>
                        <div className='relative'>
                            <input
                                id='amount'
                                name='amount'
                                type='number'
                                step='0.01'
                                placeholder='Amount of device in store (more than 0)'
                                className='peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900  py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500'
                                required
                            />
                            <CubeIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900' />
                        </div>
                    </div>
                </div>

                {/* Image File */}
                <div className='mb-4'>
                    <label htmlFor='imageUrl' className='mb-2 block text-sm font-medium'>
                        Device Image
                    </label>
                    <div className='relative mt-2 rounded-md'>
                        <div className='relative'>
                            <input
                                id='image'
                                name='image'
                                type='file'
                                step='0.01'
                                placeholder='Device Image (optional)'
                                className='peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900  py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500'
                            />
                            <PhotoIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900' />
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-6 flex justify-end gap-4'>
                <Link
                    href='/dashboard/devices'
                    className='flex h-10 items-center rounded-lg bg-neutral-100 px-4 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200'>
                    Cancel
                </Link>
                <Button type='submit'>Create Device</Button>
            </div>
        </form>
    );
};

export default Form;