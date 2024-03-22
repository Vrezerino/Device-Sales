import { PowerIcon } from '@heroicons/react/20/solid';

const Button = () => {
    return (
        <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-neutral-900 p-3 border border-orange-200/30 text-sm font-medium hover:bg-neutral-800 hover:text-gold md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
        </button>
    );
};

export default Button;