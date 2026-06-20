import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Label, ListBox, Select } from "@heroui/react";

interface Props {
	label?: string;
	value: string;
	placeholder: string;
	options: { value: string; label: string }[];
	onChange: (val: string) => void;
}

export default function FilterSelect({
	label,
	value,
	placeholder,
	options,
	onChange,
}: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const uniqueId = useRef(
		`select-${Math.random().toString(36).substr(2, 9)}`,
	);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const selectedOption = options.find((opt) => opt.value === value);
	const displayText = selectedOption ? selectedOption.label : placeholder;

	return (
		<div className="flex flex-col relative w-full" ref={containerRef}>
			{/* {label && (
				<label
					htmlFor={uniqueId.current}
					className="text-text text-lg mb-1.5"
				>
					{label}
				</label>
			)}
			<button
				id={uniqueId.current}
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="w-full h-11 px-4 rounded-xl bg-card border border-border shadow-md text-text text-sm focus:outline-none hover:scale-103 focus:scale-101 focus:ring-2 focus:ring-secondary transition-all placeholder-text/30 flex items-center justify-between cursor-pointer select-none text-left"
			>
				<span className={value ? "text-text" : "text-text/30"}>
					{displayText}
				</span>
				<IconChevronDown size={18} className={`text-text/50 shrink-0`} />
			</button>
			{isOpen && (
				<div className="absolute top-full left-0 right-0 mt-2 z-50 py-1.5 rounded-2xl bg-[#fffef4] dark:bg-[#1e1e1e] border border-border/80 shadow-lg max-h-60 overflow-y-auto">
					{options.map((option) => (
						<button
							type="button"
							key={option.value}
							onClick={() => {
								onChange(option.value === value ? "" : option.value);
								setIsOpen(false);
							}}
							className="w-full text-left px-4 py-2 hover:bg-defaultsecondary/20 dark:hover:bg-defaultsecondary/10 cursor-pointer transition-colors flex items-center justify-between text-text text-sm"
						>
							<span>{option.label}</span>
							{value === option.value && <IconCheck size={16} className="text-text" />}
						</button>
					))}
				</div>
			)} */}
			<Select placeholder={displayText}>
				<Label className="text-text text-lg mb-1.5">{label}</Label>
				<Select.Trigger className="w-full h-11 px-4 rounded-xl bg-card border border-border shadow-md text-text text-sm hover:scale-103 focus:scale-101 transition-all placeholder-text/30 flex items-center justify-between cursor-pointer select-none text-left">
					<Select.Value className={value ? "text-text" : "text-text/30"} />
					<Select.Indicator className="text-text" />
				</Select.Trigger>
				<Select.Popover className="rounded-2xl py-2 bg-card">
					<ListBox>
						{options.map((option) => (
							<ListBox.Item
								key={option.value}
								onClick={() => {
									onChange(option.value === value ? "" : option.value);
									setIsOpen(false);
								}}
								className="transition-colors rounded-lg"
								id={option.value}
								textValue={option.label}
							>
								{option.label}
								<ListBox.ItemIndicator />
							</ListBox.Item>
						))}
					</ListBox>
				</Select.Popover>
			</Select>
		</div>
	);
}
