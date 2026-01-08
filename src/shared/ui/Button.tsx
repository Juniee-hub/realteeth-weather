export function Button({
                           children,
                           className = "",
                           ...props
                       }: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
    return (
        <button
            className={`rounded-xl border px-3 py-2 text-sm hover:bg-gray-50 active:scale-[0.99] disabled:opacity-50 ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}
