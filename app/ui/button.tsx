import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-neutral-900 p-3 border border-orange-200/30 text-sm font-medium hover:bg-neutral-800 hover:text-gold md:flex-none md:justify-start md:p-2 md:px-3',
        className,
      )}
    >
      {children}
    </button>
  );
}
