'use client';

import Link from 'next/link';
import {
    AtSymbolIcon,
    IdentificationIcon,
    PhotoIcon,
    BriefcaseIcon
} from '@heroicons/react/24/outline';
import Button from '@/app/ui/button';
import { postCustomer } from '@/services/customers';
import { toast } from 'react-hot-toast';

const Form = () => {
    const post = async (formData: FormData) => {
        const result = await postCustomer(formData);
        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success('Customer added!');
        }
    };
    return (
        <form action={post}>
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
                                placeholder='Full Name (min 5, max 50 characters)'
                                className='peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900  py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500'
                                required
                            />
                            <IdentificationIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900' />
                        </div>
                    </div>
                </div>


                {/* Email */}
                <div className='mb-4'>
                    <label htmlFor='email' className='mb-2 block text-sm font-medium'>
                        Email
                    </label>
                    <div className='relative mt-2 rounded-md'>
                        <div className='relative'>
                            <input
                                id='email'
                                name='email'
                                type='string'
                                step='0.01'
                                placeholder='Email Address'
                                className='peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900  py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500'
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
                                placeholder='Company Name (min 1 character)'
                                className='peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900  py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500'
                                required
                            />
                            <BriefcaseIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900' />
                        </div>
                    </div>
                </div>

                {/* Image */}
                <div className='mb-4'>
                    <label htmlFor='image' className='mb-2 block text-sm font-medium'>
                        Profile Image
                    </label>
                    <div className='relative mt-2 rounded-md'>
                        <div className='relative'>
                            <input
                                id='image'
                                name='image'
                                type='file'
                                step='0.01'
                                placeholder='Profile Image (optional)'
                                className='peer block w-full rounded-md border border-neutral-200/30 bg-neutral-900  py-2 pl-10 text-sm outline-2 placeholder:text-neutral-500'
                            />
                            <PhotoIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900' />
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-6 flex justify-end gap-4'>
                <Link
                    href='/dashboard/customers'
                    className='flex h-10 items-center rounded-lg bg-neutral-100 px-4 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200'>
                    Cancel
                </Link>
                <Button type='submit'>Create Customer</Button>
            </div>
        </form>
    );
};

export default Form;