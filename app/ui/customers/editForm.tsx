'use client';

import { CustomersTableType } from '@/app/lib/definitions';
import {
    AtSymbolIcon,
    IdentificationIcon,
    PhotoIcon,
    BriefcaseIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Button from '@/app/ui/button';
import { updateCustomer } from '@/services/customers';
import { toast } from 'react-hot-toast';

export default function EditInvoiceForm({
    customer
}: {
    customer: CustomersTableType;
}) {
    const update = async (formData: FormData) => {
        const result = await updateCustomer(customer._id, formData);
        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success('Customer edited!');
        }
    };
    return (
        <form action={update}>
            <input type='hidden' name='_id' value={customer._id} />
            <div className='rounded-md bg-neutral-800 p-4 md:p-6'>
                {/* Name */}
                <div className='mb-4'>
                    <label htmlFor='name' className='mb-2 block text-sm font-medium'>
                        Full Name
                    </label>
                    <div className='relative mt-2 rounded-md'>
                        <div className='relative'>
                            <input
                                id='name'
                                name='name'
                                type='string'
                                step='0.01'
                                defaultValue={customer.name}
                                placeholder='Name (min 5, max 50 characters)'
                                className='peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900 py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500'
                                required
                            />
                            <IdentificationIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900' />
                        </div>
                    </div>
                </div>

                {/* Email */}
                <div className='mb-4'>
                    <label htmlFor='email' className='mb-2 block text-sm font-medium'>
                        Email address
                    </label>
                    <div className='relative mt-2 rounded-md'>
                        <div className='relative'>
                            <input
                                id='email'
                                name='email'
                                type='string'
                                step='0.01'
                                defaultValue={customer.email}
                                placeholder='Email'
                                className='peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900 py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500'
                                required
                            />
                            <AtSymbolIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900' />
                        </div>
                    </div>
                </div>

                {/* Company */}
                <div className='mb-4'>
                    <label htmlFor='company' className='mb-2 block text-sm font-medium'>
                        Company Name
                    </label>
                    <div className='relative mt-2 rounded-md'>
                        <div className='relative'>
                            <input
                                id='company'
                                name='company'
                                type='string'
                                step='0.01'
                                defaultValue={customer.company}
                                placeholder='Company Name (min 1, max 50 characters)'
                                className='peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900 py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500'
                                required
                            />
                            <BriefcaseIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900' />
                        </div>
                    </div>
                </div>

                {/* Image */}
                <div className='mb-4'>
                    <label htmlFor='image' className='mb-2 block text-sm font-medium'>
                        Profile Image (optional)
                    </label>
                    <div className='relative mt-2 rounded-md'>
                        <div className='relative'>
                            <input
                                id='image'
                                name='image'
                                type='file'
                                step='0.01'
                                placeholder='Profile Image (optional)'
                                className='peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900 py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500'
                            />
                            <PhotoIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900' />
                        </div>
                        <span className='mb-2 block text-xs text-neutral-500 font-medium'>If you leave the image field empty, existing image will be deleted.</span>
                    </div>
                </div>
            </div>
            <div className='mt-6 flex justify-end gap-4'>
                <Link
                    href='/dashboard/customers'
                    className='flex h-10 items-center rounded-lg bg-neutral-100 px-4 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200'
                >
                    Cancel
                </Link>
                <Button type='submit'>Edit Customer</Button>
            </div>
        </form>
    );
};
