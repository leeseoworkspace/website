interface Props {
    label: string;
    id: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string;
}

export default function FilterInput({ label, id, value, onChange, placeholder, className }: Props) {
    return (
        <div className={`flex flex-col ${className ?? ""}`}>
            <label htmlFor={id} className="text-text text-lg mb-1.5">
                {label}
            </label>
            <input
                autoComplete="off"
                id={id}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-11 px-4 rounded-xl bg-card border border-border shadow-md text-text text-sm focus:outline-none hover:scale-103 focus:scale-101 focus:ring-2 focus:ring-secondary transition-all placeholder-text/30"
            />
        </div>
    );
}